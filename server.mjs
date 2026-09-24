import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
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
const acceptedRequests = new Map();
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const ALLOWED_ORIGINS = new Set([
  "https://algoforge.ru",
  "https://www.algoforge.ru",
  "https://algoforge-uus2.onrender.com",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

app.set("trust proxy", 1);

app.use((req, res, next) => {
  const host = String(req.hostname || "").toLowerCase();
  // Дубль на *.onrender.com не индексируем — канонический домен algoforge.ru
  if (host.endsWith(".onrender.com")) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// JSON сохраняет совместимость со старой формой, multipart нужен посадочной
// странице для необязательного файла ТЗ. Ограничение применяется до разбора.
app.use((req, res, next) => {
  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (contentType.startsWith("multipart/form-data")) {
    return express.raw({ type: () => true, limit: "6mb" })(req, res, next);
  }
  next();
});
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  });
});

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

function isValidName(value) {
  return value.length >= 2 && value.length <= 100 && /^[A-Za-zА-Яа-яЁё\s.'-]+$/.test(value);
}

function parseMultipartBody(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary="?([^";]+)"?/i);
  if (!boundaryMatch || !Buffer.isBuffer(buffer)) throw new Error("Некорректное тело формы.");
  const boundary = Buffer.from(`--${boundaryMatch[1]}`);
  const separator = Buffer.from("\r\n\r\n");
  const fields = {};
  let file = null;
  let cursor = 0;

  while (cursor < buffer.length) {
    const start = buffer.indexOf(boundary, cursor);
    if (start < 0) break;
    let partStart = start + boundary.length;
    if (buffer.slice(partStart, partStart + 2).toString() === "--") break;
    if (buffer.slice(partStart, partStart + 2).toString() === "\r\n") partStart += 2;
    const end = buffer.indexOf(boundary, partStart);
    if (end < 0) break;
    const part = buffer.slice(partStart, Math.max(partStart, end - 2));
    const headerEnd = part.indexOf(separator);
    if (headerEnd < 0) { cursor = end; continue; }
    const headers = part.slice(0, headerEnd).toString("utf8");
    const content = part.slice(headerEnd + separator.length);
    const disposition = headers.match(/content-disposition:\s*form-data;\s*([^\r\n]+)/i)?.[1] || "";
    const name = disposition.match(/name="([^"]+)"/i)?.[1];
    const filename = disposition.match(/filename="([^"]*)"/i)?.[1] || "";
    if (name && filename) {
      file = { name: path.basename(filename).slice(0, 160), type: headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() || "", buffer: content };
    } else if (name) {
      fields[name] = content.toString("utf8").trim().slice(0, 2400);
    }
    cursor = end;
  }
  return { fields, file };
}

function safeFileExtension(filename) {
  const extension = path.extname(filename || "").toLowerCase().replace(".", "");
  return ["pdf", "docx", "txt"].includes(extension) ? extension : "";
}

async function persistLead(lead, upload) {
  const dataDir = path.join(__dirname, "data");
  await fs.promises.mkdir(dataDir, { recursive: true });
  const leadId = `lead-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  let storedFile = null;
  if (upload) {
    const extension = safeFileExtension(upload.name);
    if (!extension || (upload.type && !ALLOWED_FILE_TYPES.has(upload.type)) || upload.buffer.length > 5 * 1024 * 1024) {
      throw new Error("Недопустимый файл ТЗ.");
    }
    const fileName = `${leadId}.${extension}`;
    await fs.promises.writeFile(path.join(dataDir, fileName), upload.buffer, { flag: "wx" });
    storedFile = { name: upload.name, type: upload.type, size: upload.buffer.length, path: fileName };
  }
  const record = { ...lead, id: leadId, stored_file: storedFile, received_at: new Date().toISOString() };
  await fs.promises.appendFile(path.join(dataDir, "leads.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
  return { leadId, storedFile };
}

async function sendTelegramLead(payload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram is not configured");

  const lines = [
    "Новая заявка с сайта AlgoForge",
    `Канал: ${cleanTelegramText(payload.contactMethod || "не указан", 30)}`,
  ];
  if (payload.name) lines.push(`Имя: ${cleanTelegramText(payload.name, 100)}`);
  if (payload.phone) lines.push(`Телефон: ${cleanTelegramText(payload.phone, 40)}`);
  if (payload.telegram) lines.push(`Telegram: ${cleanTelegramText(payload.telegram, 100)}`);
  if (payload.exchange) lines.push(`Платформа: ${cleanTelegramText(payload.exchange, 80)}`);
  if (payload.projectTypeLabel) lines.push(`Тип проекта: ${cleanTelegramText(payload.projectTypeLabel, 80)}`);
  if (payload.timeline) lines.push(`Сроки: ${cleanTelegramText(payload.timeline, 60)}`);
  if (payload.budget) lines.push(`Бюджет: ${cleanTelegramText(payload.budget, 60)}`);
  if (payload.file) lines.push(`Файл ТЗ: ${cleanTelegramText(payload.file.name, 160)} (${payload.file.size} байт)`);
  if (payload.landingUrl) lines.push(`Страница: ${cleanTelegramText(payload.landingUrl, 500)}`);
  if (payload.utm_source) lines.push(`UTM: ${cleanTelegramText([payload.utm_source, payload.utm_medium, payload.utm_campaign, payload.utm_content, payload.utm_term].filter(Boolean).join(" / "), 500)}`);
  if (payload.yclid) lines.push(`yclid: ${cleanTelegramText(payload.yclid, 200)}`);
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
  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.startsWith("application/json") && !contentType.startsWith("multipart/form-data")) {
    return res.status(415).json({ ok: false, message: "Ожидается JSON." });
  }

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < rateWindowMs);
  if (recent.length >= 4) {
    return res.status(429).json({ ok: false, message: "Слишком много попыток. Позвоните нам." });
  }
  attempts.set(ip, [...recent, now]);

  let source = req.body && typeof req.body === "object" ? req.body : {};
  let upload = null;
  if (contentType.startsWith("multipart/form-data")) {
    try {
      const parsed = parseMultipartBody(req.body, contentType);
      source = parsed.fields;
      upload = parsed.file;
    } catch (error) {
      return res.status(400).json({ ok: false, message: error.message || "Некорректная форма." });
    }
  }

  const formKind = field(source, "form_kind", 60);
  const isTradingBotLanding = ["trading-bot-landing", "website-landing"].includes(formKind);
  const name = field(source, "name", 100);
  const phone = field(source, "phone", 30);
  const telegram = field(source, "telegram", 100);
  const exchange = field(source, "exchange", 80);
  const projectType = field(source, "project_type", 30);
  const timeline = field(source, "timeline", 60);
  const budget = field(source, "budget", 60);
  const message = field(source, "message", 2000);
  const website = field(source, "website", 200);
  const consent = field(source, "personal_consent", 1);
  const requestId = field(source, "request_id", 80);

  if (website) return res.json({ ok: true, spam: true });

  if (isTradingBotLanding) {
    const contactMethod = field(source, "contact_method", 20);
    if (!isValidName(name)) {
      return res.status(400).json({ ok: false, message: "Проверьте имя." });
    }
    if (contactMethod === "phone" && !/^\+?[\d\s()-]{10,20}$/.test(phone)) {
      return res.status(400).json({ ok: false, message: "Проверьте номер телефона." });
    }
    if (contactMethod === "telegram" && !/^@?[A-Za-z0-9_]{3,32}$/.test(telegram)) {
      return res.status(400).json({ ok: false, message: "Проверьте Telegram." });
    }
    if (!["phone", "telegram"].includes(contactMethod)) {
      return res.status(400).json({ ok: false, message: "Выберите способ связи." });
    }
    if (message.length < 20) {
      return res.status(400).json({ ok: false, message: "Опишите задачу минимум в 20 символах." });
    }
    if (consent !== "1") {
      return res.status(400).json({ ok: false, message: "Подтвердите согласие на обработку персональных данных." });
    }
    const extension = upload ? safeFileExtension(upload.name) : "";
    if (upload && (!extension || (upload.type && !ALLOWED_FILE_TYPES.has(upload.type)) || upload.buffer.length > 5 * 1024 * 1024)) {
      return res.status(400).json({ ok: false, message: "Файл должен быть PDF, DOCX или TXT до 5 МБ." });
    }
    if (requestId && acceptedRequests.has(requestId)) {
      return res.json({ ok: true, lead_id: acceptedRequests.get(requestId) });
    }

    const attribution = {
      utm_source: field(source, "utm_source", 200),
      utm_medium: field(source, "utm_medium", 200),
      utm_campaign: field(source, "utm_campaign", 200),
      utm_content: field(source, "utm_content", 200),
      utm_term: field(source, "utm_term", 200),
      yclid: field(source, "yclid", 200),
      landing_url: field(source, "landing_url", 500),
      client_id: field(source, "client_id", 80),
    };
    const lead = { form_kind: formKind, request_id: requestId, name, phone, telegram, contact_method: contactMethod, exchange, message, ...attribution };
    let persisted;
    try {
      persisted = await persistLead(lead, upload);
    } catch (error) {
      console.error("Lead persistence failed:", error?.message || error);
      return res.status(500).json({ ok: false, message: "Не удалось сохранить заявку. Попробуйте ещё раз." });
    }
    if (requestId) acceptedRequests.set(requestId, persisted.leadId);

    let notification = "not_configured";
    try {
      await sendTelegramLead({ ...lead, file: persisted.storedFile, landingUrl: attribution.landing_url, utm_source: attribution.utm_source, utm_medium: attribution.utm_medium, utm_campaign: attribution.utm_campaign, utm_content: attribution.utm_content, utm_term: attribution.utm_term, yclid: attribution.yclid });
      notification = "sent";
    } catch (error) {
      const token = process.env.TELEGRAM_BOT_TOKEN || "";
      const safeMessage = String(error?.message || "unknown").replaceAll(token, "[redacted]");
      console.error("Telegram delivery failed; lead is persisted:", safeMessage);
      notification = "failed";
    }
    return res.json({ ok: true, lead_id: persisted.leadId, notification });
  }

  const legacyTelegram = telegram || field(source, "company", 100);
  if (!isValidName(name)) {
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
  try {
    const persisted = await persistLead({
      form_kind: "legacy-contact-form",
      name,
      phone,
      telegram: legacyTelegram,
      project_type: projectType,
      timeline,
      budget,
      message,
      landing_url: field(source, "landing_url", 500),
      client_id: field(source, "client_id", 80),
    }, null);
    let notification = "not_configured";
    if (token && chatId) {
      await sendTelegramLead({
      name,
      phone,
      telegram: legacyTelegram,
      projectTypeLabel: PROJECT_TYPES[projectType],
      timeline,
      budget,
      message,
      });
      notification = "sent";
    }
    res.json({ ok: true, lead_id: persisted.leadId, notification });
  } catch (error) {
    const safeMessage = String(error?.message || "unknown").replaceAll(token, "[redacted]");
    console.error("Telegram delivery failed:", safeMessage);
    res.status(502).json({ ok: false, message: "Не удалось отправить. Позвоните +7 950 688-88-62." });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(['/data', '/tools'], (_req, res) => res.sendStatus(404));
app.use(express.static(__dirname, {
  index: "index.html",
  extensions: ["html"],
  dotfiles: "ignore",
}));

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ ok: false, message: "Not found" });
  }
  res.status(404).type("text").send("Not Found");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`AlgoForge server listening on http://0.0.0.0:${port}`);
});
