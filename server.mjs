import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

const app = express();
const port = Number(process.env.PORT) || 4173;
const rateWindowMs = 60_000;
const attempts = new Map();

app.set("trust proxy", 1);
app.use(express.json({ limit: "32kb" }));

const PROJECT_TYPES = {
  site: "Написание сайта",
  algo: "Торговый алгоритм",
  bot: "Торговый бот",
  api: "API интеграция",
  desktop: "Десктопное приложение",
  web: "Веб-разработка",
  mobile: "Мобильное приложение",
  other: "Другое",
};

function field(source, key, max = 500) {
  return typeof source[key] === "string" ? source[key].trim().slice(0, max) : "";
}

function cleanTelegramText(value, max = 1200) {
  return String(value).replace(/[<>\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

function fallbackPhoneMessage() {
  return "Онлайн-заявка настраивается. Позвоните +7 950 688-88-62.";
}

async function sendTelegramLead(payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram is not configured");

  const lines = [
    "Новая заявка с сайта AlgoForge",
    `Имя: ${cleanTelegramText(payload.name, 100)}`,
    `Телефон: ${cleanTelegramText(payload.phone, 40)}`,
  ];
  if (payload.company) lines.push(`Компания: ${cleanTelegramText(payload.company, 200)}`);
  lines.push(`Тип проекта: ${cleanTelegramText(payload.projectTypeLabel, 80)}`);
  if (payload.timeline) lines.push(`Сроки: ${cleanTelegramText(payload.timeline, 60)}`);
  if (payload.budget) lines.push(`Бюджет: ${cleanTelegramText(payload.budget, 60)}`);
  lines.push("", "Описание:", cleanTelegramText(payload.message, 1800));

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Telegram API error: ${response.status} ${body.slice(0, 120)}`);
  }
}

app.post("/api/lead", async (req, res) => {
  if (!req.is("application/json")) {
    return res.status(415).json({ ok: false, message: "Ожидается JSON." });
  }

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < rateWindowMs);
  if (recent.length >= 4) {
    return res.status(429).json({ ok: false, message: "Слишком много попыток. Позвоните нам." });
  }
  attempts.set(ip, [...recent, now]);

  const source = req.body && typeof req.body === "object" ? req.body : {};
  const name = field(source, "name", 100);
  const phone = field(source, "phone", 30);
  const company = field(source, "company", 200);
  const projectType = field(source, "project_type", 30);
  const timeline = field(source, "timeline", 60);
  const budget = field(source, "budget", 60);
  const message = field(source, "message", 2000);
  const website = field(source, "website", 200);
  const consent = field(source, "personal_consent", 1);

  if (website) return res.json({ ok: true });

  if (name.length < 2 || !/^[\p{L}\p{M}\s.'-]{2,100}$/u.test(name)) {
    return res.status(400).json({ ok: false, message: "Проверьте имя." });
  }
  if (!/^\+?[\d\s()-]{10,20}$/.test(phone)) {
    return res.status(400).json({ ok: false, message: "Проверьте номер телефона." });
  }
  if (!PROJECT_TYPES[projectType]) {
    return res.status(400).json({ ok: false, message: "Выберите тип проекта." });
  }
  if (message.length < 10) {
    return res.status(400).json({ ok: false, message: "Опишите проект чуть подробнее." });
  }
  if (consent !== "1") {
    return res.status(400).json({ ok: false, message: "Подтвердите согласие на обработку персональных данных." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(503).json({ ok: false, message: fallbackPhoneMessage() });
  }

  try {
    await sendTelegramLead({
      name,
      phone,
      company,
      projectTypeLabel: PROJECT_TYPES[projectType],
      timeline,
      budget,
      message,
    });
    res.json({ ok: true });
  } catch (error) {
    const safeMessage = String(error?.message || "unknown").replaceAll(token, "[redacted]");
    console.error("Telegram delivery failed:", safeMessage);
    res.status(502).json({ ok: false, message: "Не удалось отправить. Позвоните +7 950 688-88-62." });
  }
});

app.use(express.static(__dirname, { extensions: ["html"] }));

app.listen(port, () => {
  console.log(`AlgoForge server listening on http://127.0.0.1:${port}`);
});
