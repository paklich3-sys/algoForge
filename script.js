// ==========================================
// Site config: window.SITE_CONFIG задаётся в index.html перед подключением этого файла
// ==========================================
const SITE_DEFAULTS = {
    brandName: 'AlgoForge',
    telegramUsername: 'your_username',
    email: 'your@email.com',
    githubUrl: '',
};

function getSiteConfig() {
    const raw = typeof window.SITE_CONFIG === 'object' && window.SITE_CONFIG != null ? window.SITE_CONFIG : {};
    const merged = { ...SITE_DEFAULTS };
    for (const key of Object.keys(raw)) {
        const v = raw[key];
        if (v !== undefined) merged[key] = v;
    }
    return merged;
}

function normalizeTelegramUser(raw) {
    if (raw == null || raw === '') return '';
    return String(raw).trim().replace(/^@+/, '');
}

function normalizeEmail(raw) {
    const mail = (raw || '').trim();
    if (!mail) return '';
    // Simple safe check for mailto link rendering.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? mail : '';
}

function sanitizeHttpUrl(raw) {
    if (!raw) return '';
    try {
        const url = new URL(String(raw).trim());
        if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
        return url.toString();
    } catch (e) {
        return '';
    }
}

const I18N = {
    ru: {
        titleSuffix: 'Алгоритмы. Боты. Софт. Сайты.',
        telegramLabel: 'Telegram',
        langButton: 'EN',
        langAriaSwitch: 'Переключить язык на английский',
        navAriaLogo: 'AlgoForge — на главную',

        'nav.services': 'Услуги',
        'nav.about': 'О нас',
        'nav.process': 'Процесс',
        'nav.tech': 'Технологии',
        'nav.portfolio': 'Портфолио',
        'nav.faq': 'FAQ',
        'nav.blog': 'Блог',
        'nav.cases': 'Кейсы',
        'nav.news': 'Новости',
        'nav.contact': 'Связаться',

        'hero.badge': 'Принимаем новые проекты',
        'hero.title': 'Автоматизация, которая делает <span class="gradient-text glow-green">деньги</span>.<span class="block mt-1 sm:mt-2">От криптоботов до энтерпрайза.</span>',
        'hero.aria': 'Автоматизация, которая делает деньги. От криптоботов до энтерпрайза.',
        'hero.lead': 'Разрабатываем инфраструктуру для трейдинга и бизнеса. API-интеграции, десктоп, веб и мобильные приложения под ключ. Чистый код и математическая точность в каждом алгоритме.',
        'hero.cta_primary': 'Начать проект',
        'hero.cta_secondary': 'Наши услуги',
        'hero.scroll': 'scroll',

        'services.badge': 'УСЛУГИ',
        'services.title': 'Что мы <span class="gradient-text">создаём</span>',
        'services.subtitle': 'Полный спектр разработки — от архитектуры до релиза на серверах',
        'services.s1.title': 'Торговые алгоритмы',
        'services.s1.desc': 'Разработка HFT и алгоритмических торговых систем для криптобирж и традиционных рынков. Выстраивание логики исполнения ордеров, внедрение риск-менеджмента и деплой.',
        'services.s2.title': 'Торговые боты',
        'services.s2.desc': 'Автоматизация торговых процессов: арбитражные, маркетмейкерские, DCA и Grid-боты. Роботы работают 24/7, обеспечивая миллисекундную реакцию на изменения рынка без эмоций и ошибок.',
        'services.s3.title': 'API интеграции',
        'services.s3.desc': 'Подключение к любым биржам, торговым площадкам и сервисам. Обеспечиваем бесперебойный потоковый обмен данными. Binance, Bybit, OKX и десятки других API.',
        'services.s4.title': 'Десктопный софт',
        'services.s4.desc': 'Отказоустойчивые приложения для Windows и Linux. Торговые терминалы, дашборды, аналитические инструменты и утилиты, способные обрабатывать реал-тайм данные без фризов.',
        'services.s5.title': 'Веб-разработка',
        'services.s5.desc': 'Landing pages, корпоративные сайты, SaaS-платформы и сложные дашборды. Современный стек, микросервисная архитектура и готовность к высоким нагрузкам.',
        'services.s6.title': 'Мобильные приложения',
        'services.s6.desc': 'Разработка нативных и кроссплатформенных приложений для Android. Финтех-инструменты, трейдинг и управление бизнес-процессами прямо в телефоне.',

        'about.badge': 'О КОМПАНИИ',
        'about.title': 'Мы — <span class="gradient-text">команда</span>, которой доверяют',
        'about.lead': 'AlgoForge — команда инженеров и продуктовых специалистов с профильным опытом в FinTech и разработке софта. Мы не просто пишем код, а проектируем надежную архитектуру под конкретную бизнес-задачу.',
        'about.desc': 'Каждый проект начинается с анализа логики и требований. Мы глубоко погружаемся в вашу предметную область, продумываем технические решения и только потом приступаем к реализации. Результат — стабильный продукт, готовый к работе.',
        'about.tag1': 'NDA защита',
        'about.tag2': 'точные сроки',
        'about.tag3': '24/7 поддержка',
        'about.stat_projects': 'ПРОЕКТОВ',
        'about.stat_years': 'ЛЕТ ОПЫТА',
        'about.stat_engineers': 'ИНЖЕНЕРОВ',
        'about.stat_uptime': 'UPTIME',

        'process.badge': 'ПРОЦЕСС',
        'process.title': 'Как мы <span class="gradient-text">работаем</span>',
        'process.subtitle': 'Системный подход и прозрачный трекинг на каждом этапе',
        'process.p1.title': 'Аналитика и требования',
        'process.p1.desc': 'Изучаем бизнес-задачи и технические ограничения. Составляем подробное техническое задание без «слепых зон» и подбираем оптимальный стек технологий.',
        'process.p2.title': 'Проектирование и дизайн',
        'process.p2.desc': 'Создаём архитектуру будущего решения. Для визуальных продуктов — отрисовываем UI/UX прототипы. Вы утверждаете логику и внешний вид до старта разработки.',
        'process.p3.title': 'Разработка и код-ревью',
        'process.p3.desc': 'Работаем спринтами с регулярными демо-релизами. Практикуем строгий код-ревью, модульное тестирование и стандарты чистого кода для обеспечения стабильности системы.',
        'process.p4.title': 'Запуск и поддержка',
        'process.p4.desc': 'Разворачиваем продукт на серверах, настраиваем CI/CD и мониторинг. После релиза обеспечиваем техническую поддержку, быстрые фиксы и дальнейшее масштабирование.',

        'tech.badge': 'ТЕХНОЛОГИИ',
        'tech.title': 'Наш <span class="gradient-text">стек</span>',
        'tech.subtitle': 'Используем лучшие инструменты для каждой задачи',

        'portfolio.badge': 'ПОРТФОЛИО',
        'portfolio.title': 'Наши <span class="gradient-text">проекты</span>',
        'portfolio.subtitle': 'Описания ориентированы на реальные услуги — детали и масштаб обсудим под ваш запрос',
        'portfolio.p1.alt': 'QuantTerminal Pro — торговый терминал',
        'portfolio.p1.desc': 'Десктопный торговый терминал (Windows/Linux) с визуализацией ордербука и интеграцией 15+ бирж через единый API на базе WebSockets.',
        'portfolio.p2.alt': 'ArbitrageX Bot — панель мониторинга',
        'portfolio.p2.desc': 'Кросс-биржевой арбитражный бот с latency &lt; 50ms. Интеллектуальный обход rate-лимитов и жесткая система риск-менеджмента для контроля проскальзываний.',
        'portfolio.p3.alt': 'CryptoAnalytics SaaS — дашборд аналитики',
        'portfolio.p3.desc': 'Аналитическая платформа с real-time дашбордами и обработкой потоковых данных для сотен одновременных подключений.',
        'portfolio.p4.alt': 'TradeFlow — мобильное приложение для портфеля и торговли',
        'portfolio.p4.desc': 'Мобильное Android-приложение для управления портфелем. Быстрый доступ к торгам, мониторинг позиций и push-уведомления об исполнении ордеров.',
        'portfolio.read_case': 'Читать кейс',

        'contact.badge': 'НАЧАТЬ ПРОЕКТ',
        'contact.title': 'Готовы <span class="gradient-text">создать</span>?',
        'contact.lead': 'Расскажите о вашем проекте — мы подготовим оценку и предложение в течение 24 часов',
        'form.name': 'Имя',
        'form.tg': 'Ваш Telegram (@username)',
        'form.tg_title': 'Латиница, 5–32 символа, с @ или без',
        'form.message': 'Опишите ваш проект...',
        'form.submit': 'Отправить заявку',
        'form.type': 'Тип проекта',
        'form.type.algo': 'Торговый алгоритм',
        'form.type.bot': 'Торговый бот',
        'form.type.api': 'API интеграция',
        'form.type.desktop': 'Десктопное приложение',
        'form.type.web': 'Веб-разработка',
        'form.type.mobile': 'Мобильное приложение',
        'form.type.other': 'Другое',

        'faq.badge': 'FAQ',
        'faq.title': 'Вы спрашиваете — <span class="gradient-text">мы отвечаем</span>',
        'faq.subtitle': 'Коротко о праве на код, платформах, безопасности ключей и том, как мы подключаемся к биржам.',
        'faq.q1': 'Кому принадлежит исходный код после разработки?',
        'faq.a1': 'После полной оплаты проекта вы получаете все права на интеллектуальную собственность и исходный код. Мы работаем по договору и подписываем NDA — ваша торговая логика остаётся только вашей.',
        'faq.q2': 'На каких операционных системах работает ваш софт?',
        'faq.a2': 'Мы специализируемся на высокопроизводительных решениях для <strong class="text-gray-300 font-medium">Windows</strong> и <strong class="text-gray-300 font-medium">Linux</strong>. Также разрабатываем мобильные терминалы и системы управления для <strong class="text-gray-300 font-medium">Android</strong>.',
        'faq.q3': 'Как обстоит дело с безопасностью моих API-ключей?',
        'faq.a3': 'Мы проектируем системы так, чтобы у нас не было доступа к вашим средствам. Софт устанавливается на ваш сервер. В API-ключах вы настраиваете доступ только на «Торговлю», блокируя возможность «Вывода средств».',
        'faq.q4': 'Какие протоколы вы используете для подключения к биржам?',
        'faq.a4': 'Мы не используем медленный REST для высокочастотных задач. Только WebSockets, gRPC и FIX API для обеспечения минимального пинга и мгновенного исполнения ордеров.',
        'faq.q5': 'Вы предоставляете готовые стратегии?',
        'faq.a5': 'Нет, мы — инженеры: превращаем вашу уникальную логику или бизнес-задачу в устойчивый программный код. Мы не занимаемся прогнозированием рынка за вас, но при необходимости можем направить в нужное русло.',
        'faq.q6': 'Сколько времени занимает разработка?',
        'faq.a6': 'Срок зависит от сложности логики и количества интеграций. Простой бот или MVP обычно занимает от 2–4 недель, сложная торговая система, терминал или SaaS-платформа — от 2–3 месяцев. Точную оценку даём после короткого технического разбора задачи.',
        'faq.q7': 'Можно ли доработать уже существующий проект?',
        'faq.a7': 'Да. Мы можем провести аудит текущего кода, найти узкие места, исправить ошибки, добавить новые биржи, переписать нестабильные модули или подготовить проект к запуску на сервере.',
        'faq.q8': 'Как проходит оплата проекта?',
        'faq.a8': 'Обычно проект делится на этапы: аналитика, прототип, разработка, тестирование и запуск. Оплата также может идти по этапам — это фиксируется в договоре или согласованном техническом задании.',
        'faq.q9': 'Вы помогаете с запуском на сервере?',
        'faq.a9': 'Да. Настраиваем сервер, окружение, автозапуск, логи, мониторинг, резервные копии и базовую защиту. Для торговых систем отдельно проверяем стабильность подключения к API и поведение при сбоях сети.',
        'faq.q10': 'Есть ли поддержка после релиза?',
        'faq.a10': 'Да. После запуска можно подключить сопровождение: исправление ошибок, обновления API бирж, добавление функций, мониторинг и оптимизацию производительности.',

        'footer.brand_desc': 'Создаём технологии, которые работают на вас. Торговые алгоритмы, боты, софт и приложения под ключ.',
        'footer.col_services': 'Услуги',
        'footer.col_dev': 'Разработка',
        'footer.col_contacts': 'Контакты',
        'footer.link.algos': 'Торговые алгоритмы',
        'footer.link.bots': 'Торговые боты',
        'footer.link.api': 'API интеграции',
        'footer.link.desktop': 'Десктопный софт',
        'footer.link.web': 'Веб-сайты',
        'footer.link.mobile': 'Мобильные приложения',
        'footer.link.tech': 'Технологии',
        'footer.link.process': 'Как мы работаем',
        'footer.link.faq': 'FAQ',
        'footer.link.blog': 'Блог',
        'footer.link.cases': 'Кейсы',
        'footer.link.news': 'Новости',
        'footer.legal_title': 'Юридическая информация и уведомление о рисках',
        'footer.legal_p1': '<strong class="text-gray-500">Правовая информация.</strong> Исполнитель: ИП КОНОВАЛОВ, ОГРНИП 320532100016343. Сайт AlgoForge оказывает услуги по разработке программного обеспечения на заказ. Информация на сайте не является публичной офертой; итоговые условия, сроки и стоимость фиксируются в договоре или согласованном техническом задании.',
        'footer.legal_p2': '<strong class="text-gray-500">Риски.</strong> Торговля на финансовых и криптовалютных рынках сопряжена с высоким риском полной или частичной потери денежных средств. Любые алгоритмы, боты и стратегии являются инструментами автоматизации и не гарантируют получение прибыли в будущем. Результаты, продемонстрированные в кейсах, являются субъективными и не являются обещанием аналогичной доходности.',
        'footer.legal_p3': '<strong class="text-gray-500">Использование сервиса.</strong> Весь контент на сайте носит информационно-образовательный характер. Пользователь самостоятельно принимает решения о запуске торговых систем и несёт полную ответственность за любые финансовые результаты. Мы не принимаем денежные средства для торговли и не предлагаем финансовые продукты.',
        'footer.copy_rights': 'Все права защищены.',

        'modal.title': 'Сообщение',
        'modal.ok': 'Понятно',
        modalSelectProjectType: 'Выберите тип проекта в списке.',
        modalInvalidTelegram: 'В поле Telegram укажите корректный username: латиница, 5–32 символа, как в ссылке t.me/username (можно с @ или без).',
        modalConfigTelegram: 'Внизу файла index.html найдите блок window.SITE_CONFIG и укажите telegramUsername — ваш логин в Telegram без символа @ (как в ссылке t.me/username).',
        modalTooLong: 'Текст слишком длинный для одной ссылки Telegram. Сократите описание проекта.',
        requestTitle: 'Заявка с сайта',
        requestName: 'Имя',
        requestClientTelegram: 'Telegram клиента',
        requestProjectType: 'Тип проекта',
        submitOpening: 'Открываем Telegram…',
        submitDone: 'Готово — проверьте Telegram',
    },
    en: {
        titleSuffix: 'Algorithms. Bots. Software. Websites.',
        telegramLabel: 'Telegram',
        langButton: 'RU',
        langAriaSwitch: 'Switch language to Russian',
        navAriaLogo: 'AlgoForge — home',

        'nav.services': 'Services',
        'nav.about': 'About',
        'nav.process': 'Process',
        'nav.tech': 'Tech',
        'nav.portfolio': 'Portfolio',
        'nav.faq': 'FAQ',
        'nav.blog': 'Blog',
        'nav.cases': 'Cases',
        'nav.news': 'News',
        'nav.contact': 'Contact',

        'hero.badge': 'Accepting new projects',
        'hero.title': 'Automation that makes <span class="gradient-text glow-green">money</span>.<span class="block mt-1 sm:mt-2">From crypto bots to enterprise.</span>',
        'hero.aria': 'Automation that makes money. From crypto bots to enterprise.',
        'hero.lead': 'We build infrastructure for trading and business. API integrations, desktop, web, and mobile apps end-to-end. Clean code and mathematical precision in every algorithm.',
        'hero.cta_primary': 'Start project',
        'hero.cta_secondary': 'Our services',
        'hero.scroll': 'scroll',

        'services.badge': 'SERVICES',
        'services.title': 'What we <span class="gradient-text">build</span>',
        'services.subtitle': 'Full-cycle development — from architecture to production deployment',
        'services.s1.title': 'Trading algorithms',
        'services.s1.desc': 'We develop HFT and algorithmic trading systems for crypto exchanges and traditional markets — order execution logic, risk management, and deployment.',
        'services.s2.title': 'Trading bots',
        'services.s2.desc': 'Automation of trading workflows: arbitrage, market-making, DCA, and grid bots. They run 24/7 with millisecond reactions, no emotions, no mistakes.',
        'services.s3.title': 'API integrations',
        'services.s3.desc': 'Connectivity to any exchanges, marketplaces, and services. Reliable streaming data exchange — Binance, Bybit, OKX, and dozens of other APIs.',
        'services.s4.title': 'Desktop software',
        'services.s4.desc': 'Fault-tolerant Windows and Linux apps: trading terminals, dashboards, analytics tools, and utilities that handle real-time data without freezes.',
        'services.s5.title': 'Web development',
        'services.s5.desc': 'Landing pages, corporate websites, SaaS platforms, and complex dashboards. Modern stack, microservice architecture, and readiness for heavy loads.',
        'services.s6.title': 'Mobile apps',
        'services.s6.desc': 'Native and cross-platform Android apps: fintech tools, trading, and business process management right on the phone.',

        'about.badge': 'ABOUT',
        'about.title': 'We are a <span class="gradient-text">team</span> trusted by clients',
        'about.lead': 'AlgoForge is a team of engineers and product specialists with a strong background in FinTech and software development. We don’t just write code — we design reliable architecture for specific business goals.',
        'about.desc': 'Every project starts with logic and requirements analysis. We dive deep into your domain, design technical solutions, and only then move to implementation. The result is a stable product ready for production.',
        'about.tag1': 'NDA protection',
        'about.tag2': 'on-time delivery',
        'about.tag3': '24/7 support',
        'about.stat_projects': 'PROJECTS',
        'about.stat_years': 'YEARS OF EXPERIENCE',
        'about.stat_engineers': 'ENGINEERS',
        'about.stat_uptime': 'UPTIME',

        'process.badge': 'PROCESS',
        'process.title': 'How we <span class="gradient-text">work</span>',
        'process.subtitle': 'A systematic approach and transparent tracking at every stage',
        'process.p1.title': 'Discovery & requirements',
        'process.p1.desc': 'We study business goals and technical constraints, write a detailed spec without blind spots, and choose the optimal tech stack.',
        'process.p2.title': 'Design & architecture',
        'process.p2.desc': 'We design the architecture of the future product. For visual products we craft UI/UX prototypes. You sign off on the logic and look before development starts.',
        'process.p3.title': 'Development & code review',
        'process.p3.desc': 'We work in sprints with regular demo releases, practice strict code review, unit testing, and clean-code standards for system stability.',
        'process.p4.title': 'Launch & support',
        'process.p4.desc': 'We deploy the product, set up CI/CD and monitoring. After release we provide tech support, quick fixes, and further scaling.',

        'tech.badge': 'TECH',
        'tech.title': 'Our <span class="gradient-text">stack</span>',
        'tech.subtitle': 'We use the best tools for each task',

        'portfolio.badge': 'PORTFOLIO',
        'portfolio.title': 'Our <span class="gradient-text">projects</span>',
        'portfolio.subtitle': 'Descriptions reflect real services — we will discuss details and scope based on your request',
        'portfolio.p1.alt': 'QuantTerminal Pro — trading terminal',
        'portfolio.p1.desc': 'Desktop trading terminal (Windows/Linux) with order book visualization and 15+ exchanges integrated via a single WebSockets API.',
        'portfolio.p2.alt': 'ArbitrageX Bot — monitoring dashboard',
        'portfolio.p2.desc': 'Cross-exchange arbitrage bot with latency &lt; 50ms. Smart rate-limit handling and a strict risk-management system to control slippage.',
        'portfolio.p3.alt': 'CryptoAnalytics SaaS — analytics dashboard',
        'portfolio.p3.desc': 'Analytics platform with real-time dashboards and streaming-data processing for hundreds of concurrent connections.',
        'portfolio.p4.alt': 'TradeFlow — mobile app for portfolio and trading',
        'portfolio.p4.desc': 'Android mobile app for portfolio management. Fast access to trading, position monitoring, and push notifications on order execution.',
        'portfolio.read_case': 'Read case',

        'contact.badge': 'START PROJECT',
        'contact.title': 'Ready to <span class="gradient-text">build</span>?',
        'contact.lead': 'Tell us about your project — we will prepare an estimate and proposal within 24 hours.',
        'form.name': 'Name',
        'form.tg': 'Your Telegram (@username)',
        'form.tg_title': 'Latin letters, 5–32 chars, with or without @',
        'form.message': 'Describe your project...',
        'form.submit': 'Send request',
        'form.type': 'Project type',
        'form.type.algo': 'Trading algorithm',
        'form.type.bot': 'Trading bot',
        'form.type.api': 'API integration',
        'form.type.desktop': 'Desktop application',
        'form.type.web': 'Web development',
        'form.type.mobile': 'Mobile application',
        'form.type.other': 'Other',

        'faq.badge': 'FAQ',
        'faq.title': 'You ask — <span class="gradient-text">we answer</span>',
        'faq.subtitle': 'In short: source code ownership, platforms, API key security, and how we connect to exchanges.',
        'faq.q1': 'Who owns the source code after development?',
        'faq.a1': 'After full payment you receive all IP rights and the source code. We work under contract and sign NDA — your trading logic stays yours only.',
        'faq.q2': 'Which operating systems do your solutions run on?',
        'faq.a2': 'We specialize in high-performance solutions for <strong class="text-gray-300 font-medium">Windows</strong> and <strong class="text-gray-300 font-medium">Linux</strong>. We also build mobile terminals and management systems for <strong class="text-gray-300 font-medium">Android</strong>.',
        'faq.q3': 'How do you handle API key security?',
        'faq.a3': 'We design systems so that we never have access to your funds. The software runs on your server. In API keys you allow only “Trading” and block “Withdraw”.',
        'faq.q4': 'Which protocols do you use for exchange connectivity?',
        'faq.a4': 'We don’t use slow REST for high-frequency tasks. Only WebSockets, gRPC, and FIX API for minimal latency and instant order execution.',
        'faq.q5': 'Do you provide ready-made strategies?',
        'faq.a5': 'No — we are engineers. We turn your unique logic or business case into resilient code. We don’t predict the market for you, but we can guide you in the right direction.',
        'faq.q6': 'How long does development take?',
        'faq.a6': 'Timing depends on logic complexity and the number of integrations. A simple bot or MVP usually takes 2–4 weeks, while a complex trading system, terminal, or SaaS platform can take 2–3 months. We provide an accurate estimate after a short technical review.',
        'faq.q7': 'Can you improve an existing project?',
        'faq.a7': 'Yes. We can audit existing code, find bottlenecks, fix bugs, add new exchanges, rewrite unstable modules, or prepare the project for server deployment.',
        'faq.q8': 'How does payment work?',
        'faq.a8': 'Usually the project is split into stages: analysis, prototype, development, testing, and launch. Payment can also be split by stages — this is fixed in the agreement or approved technical specification.',
        'faq.q9': 'Do you help with server deployment?',
        'faq.a9': 'Yes. We configure the server, runtime environment, autostart, logs, monitoring, backups, and basic protection. For trading systems we additionally check API connection stability and behavior during network failures.',
        'faq.q10': 'Do you provide support after release?',
        'faq.a10': 'Yes. After launch, support can include bug fixes, exchange API updates, new features, monitoring, and performance optimization.',

        'footer.brand_desc': 'We build technology that works for you. Trading algorithms, bots, software, and apps end-to-end.',
        'footer.col_services': 'Services',
        'footer.col_dev': 'Development',
        'footer.col_contacts': 'Contacts',
        'footer.link.algos': 'Trading algorithms',
        'footer.link.bots': 'Trading bots',
        'footer.link.api': 'API integrations',
        'footer.link.desktop': 'Desktop software',
        'footer.link.web': 'Websites',
        'footer.link.mobile': 'Mobile apps',
        'footer.link.tech': 'Tech',
        'footer.link.process': 'How we work',
        'footer.link.faq': 'FAQ',
        'footer.link.blog': 'Blog',
        'footer.link.cases': 'Cases',
        'footer.link.news': 'News',
        'footer.legal_title': 'Legal information and risk notice',
        'footer.legal_p1': '<strong class="text-gray-500">Legal information.</strong> Contractor: Individual Entrepreneur KONOVALOV, OGRNIP 320532100016343. AlgoForge provides custom software development services. Information on this website is not a public offer; final terms, timelines, and pricing are fixed in an agreement or approved technical specification.',
        'footer.legal_p2': '<strong class="text-gray-500">Risks.</strong> Trading on financial and crypto markets carries a high risk of partial or full loss of funds. Any algorithms, bots, and strategies are automation tools and do not guarantee future profits. Results shown in case studies are subjective and are not a promise of similar returns.',
        'footer.legal_p3': '<strong class="text-gray-500">Use of service.</strong> All content on the website is for informational and educational purposes. The user makes independent decisions on running trading systems and bears full responsibility for any financial results. We do not accept funds for trading and do not offer financial products.',
        'footer.copy_rights': 'All rights reserved.',

        'modal.title': 'Message',
        'modal.ok': 'OK',
        modalSelectProjectType: 'Please select a project type from the list.',
        modalInvalidTelegram: 'Enter a valid Telegram username: latin letters, 5–32 characters, as in t.me/username (with or without @).',
        modalConfigTelegram: 'In index.html, find window.SITE_CONFIG and set telegramUsername — your Telegram handle without @ (as in t.me/username).',
        modalTooLong: 'The message is too long for a single Telegram link. Please shorten the project description.',
        requestTitle: 'Website request',
        requestName: 'Name',
        requestClientTelegram: 'Client Telegram',
        requestProjectType: 'Project type',
        submitOpening: 'Opening Telegram…',
        submitDone: 'Done — check Telegram',
    },
};

let currentLanguage = 'ru';

function t(key) {
    return (I18N[currentLanguage] && I18N[currentLanguage][key] !== undefined)
        ? I18N[currentLanguage][key]
        : (I18N.ru[key] !== undefined ? I18N.ru[key] : key);
}

function getLocalizedTitle(brandName) {
    return `${brandName} — ${t('titleSuffix')}`;
}

function applyDataI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (key) el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        const key = el.getAttribute('data-i18n-html');
        if (key) el.innerHTML = t(key);
    });
    const ATTR_MAP = ['placeholder', 'title', 'aria-label', 'alt'];
    ATTR_MAP.forEach((attr) => {
        const sel = `[data-i18n-attr-${attr}]`;
        document.querySelectorAll(sel).forEach((el) => {
            const key = el.getAttribute(`data-i18n-attr-${attr}`);
            if (key) el.setAttribute(attr, t(key));
        });
    });
}

function applyLanguage(lang) {
    currentLanguage = lang === 'en' ? 'en' : 'ru';
    document.documentElement.lang = currentLanguage;
    localStorage.setItem('site_lang', currentLanguage);

    applyDataI18n();

    const triggerLabel = document.getElementById('custom-type-label');
    const hiddenType = document.getElementById('contact-type');
    if (triggerLabel && hiddenType && !hiddenType.value) triggerLabel.textContent = t('form.type');
    if (triggerLabel && hiddenType && hiddenType.value) {
        const currentVal = hiddenType.value;
        triggerLabel.textContent = t('form.type.' + currentVal);
    }

    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    if (submitBtn && !submitBtn.disabled) {
        submitBtn.innerHTML = `${t('form.submit')}<i data-lucide="send" class="w-5 h-5"></i>`;
        if (window.lucide) lucide.createIcons();
    }

    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
        btn.textContent = t('langButton');
        btn.setAttribute('aria-label', t('langAriaSwitch'));
    });

    if (typeof applySiteConfig === 'function') applySiteConfig();
}

function applySiteConfig() {
    const c = getSiteConfig();
    const tg = normalizeTelegramUser(c.telegramUsername);
    const mail = normalizeEmail(c.email);
    const tgUrl = tg ? 'https://t.me/' + tg : '#';

    document.title = getLocalizedTitle(c.brandName);

    document.querySelectorAll('[data-site-email]').forEach((el) => { el.textContent = mail || ''; });
    document.querySelectorAll('[data-site-email-footer]').forEach((el) => { el.textContent = mail || ''; });
    document.querySelectorAll('[data-site-email-link]').forEach((el) => {
        el.href = mail ? 'mailto:' + mail : '#';
        if (!mail) el.setAttribute('aria-disabled', 'true');
    });
    document.querySelectorAll('[data-site-email-link-footer]').forEach((el) => {
        el.href = mail ? 'mailto:' + mail : '#';
    });

    document.querySelectorAll('[data-site-email-row]').forEach((el) => {
        if (!mail) {
            el.classList.add('hidden');
            el.setAttribute('aria-hidden', 'true');
        } else {
            el.classList.remove('hidden');
            el.removeAttribute('aria-hidden');
        }
    });

    const tgLabel = tg ? `${t('telegramLabel')}: @${tg}` : t('telegramLabel');
    document.querySelectorAll('[data-site-telegram-label]').forEach((el) => { el.textContent = tgLabel; });
    document.querySelectorAll('[data-site-telegram-footer]').forEach((el) => { el.textContent = tg ? '@' + tg : t('telegramLabel'); });
    document.querySelectorAll('[data-site-telegram-link], [data-site-telegram-link-footer], [data-site-social-telegram]').forEach((el) => {
        el.href = tgUrl;
    });

    const gh = sanitizeHttpUrl(c.githubUrl);
    const ghLine = document.querySelector('[data-site-github-line]');
    const ghFooterA = document.querySelector('[data-site-github-link-footer]');
    const ghSocial = document.querySelector('[data-site-social-github]');
    if (ghLine && ghFooterA) {
        if (!gh) {
            ghLine.hidden = true;
            if (ghSocial) ghSocial.style.display = 'none';
        } else {
            ghLine.hidden = false;
            ghFooterA.href = gh;
            ghFooterA.textContent = gh.replace(/^https?:\/\//i, '').replace(/\/$/, '');
            if (ghSocial) {
                ghSocial.href = gh;
                ghSocial.style.display = '';
            }
        }
    }

    const y = document.querySelector('[data-site-year]');
    if (y) y.textContent = String(new Date().getFullYear());
    document.querySelectorAll('[data-site-brand-copy]').forEach((el) => { el.textContent = c.brandName; });
}

currentLanguage = localStorage.getItem('site_lang') === 'en' ? 'en' : 'ru';
document.documentElement.lang = currentLanguage;

// ==========================================
// Модальное окно (вместо alert)
// ==========================================
function showSiteModal(text) {
    const modal = document.getElementById('site-modal');
    const p = document.getElementById('site-modal-text');
    if (!modal || !p) return;
    p.textContent = text;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function hideSiteModal() {
    const modal = document.getElementById('site-modal');
    if (modal) modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

(function initSiteModal() {
    const modal = document.getElementById('site-modal');
    if (!modal) return;
    const ok = document.getElementById('site-modal-ok');
    const bd = document.getElementById('site-modal-backdrop');
    if (ok) ok.addEventListener('click', hideSiteModal);
    if (bd) bd.addEventListener('click', hideSiteModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) hideSiteModal();
    });
})();

// ==========================================
// Three.js 3D Background Animation
// ==========================================
(function() {
    const canvas = document.getElementById('three-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // --- Particle System ---
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        new THREE.Color('#00ff88'),
        new THREE.Color('#00d4ff'),
        new THREE.Color('#a855f7'),
        new THREE.Color('#ec4899'),
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Connection Lines ---
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];
    const maxDist = 12;

    function updateLines() {
        linePositions.length = 0;
        lineColors.length = 0;
        
        const pos = particleGeometry.attributes.position.array;
        const col = particleGeometry.attributes.color.array;
        
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < maxDist) {
                    linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                    linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                    
                    const alpha = 1 - dist / maxDist;
                    lineColors.push(col[i * 3] * alpha, col[i * 3 + 1] * alpha, col[i * 3 + 2] * alpha);
                    lineColors.push(col[j * 3] * alpha, col[j * 3 + 1] * alpha, col[j * 3 + 2] * alpha);
                }
            }
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    }

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Floating Geometries ---
    const torusGeo = new THREE.TorusGeometry(3, 0.08, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.15, wireframe: true });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-20, 10, -10);
    scene.add(torus);

    const icosaGeo = new THREE.IcosahedronGeometry(2.5, 0);
    const icosaMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.1, wireframe: true });
    const icosa = new THREE.Mesh(icosaGeo, icosaMat);
    icosa.position.set(20, -8, -5);
    scene.add(icosa);

    const octaGeo = new THREE.OctahedronGeometry(2, 0);
    const octaMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.12, wireframe: true });
    const octa = new THREE.Mesh(octaGeo, octaMat);
    octa.position.set(15, 15, -15);
    scene.add(octa);

    // --- Mouse tracking ---
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // --- Scroll offset ---
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });

    // --- Animation Loop ---
    let frameCount = 0;
    function animate() {
        requestAnimationFrame(animate);
        frameCount++;

        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Rotate particles
        particles.rotation.x = mouseY * 0.3 + frameCount * 0.0002;
        particles.rotation.y = mouseX * 0.3 + frameCount * 0.0003;

        // Move particles slightly
        const pos = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3 + 1] += Math.sin(frameCount * 0.001 + i) * 0.005;
        }
        particleGeometry.attributes.position.needsUpdate = true;

        // Update lines periodically (performance)
        if (frameCount % 3 === 0) {
            updateLines();
            lineGeometry.attributes.position.needsUpdate = true;
            lineGeometry.attributes.color.needsUpdate = true;
        }

        lines.rotation.x = mouseY * 0.3 + frameCount * 0.0002;
        lines.rotation.y = mouseX * 0.3 + frameCount * 0.0003;

        // Floating geometries
        torus.rotation.x = frameCount * 0.003;
        torus.rotation.y = frameCount * 0.005;
        torus.position.y = 10 + Math.sin(frameCount * 0.008) * 3;

        icosa.rotation.x = frameCount * 0.004;
        icosa.rotation.z = frameCount * 0.006;
        icosa.position.y = -8 + Math.sin(frameCount * 0.006) * 2.5;

        octa.rotation.y = frameCount * 0.005;
        octa.rotation.z = frameCount * 0.003;
        octa.position.y = 15 + Math.cos(frameCount * 0.007) * 2;

        // Camera parallax
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Scroll-based movement
        const scrollOffset = scrollY * 0.002;
        particles.position.y = -scrollOffset * 5;
        lines.position.y = -scrollOffset * 5;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();


// ==========================================
// GSAP Scroll Animations
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Reveal animations
document.querySelectorAll('.reveal').forEach((el, i) => {
    gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            delay: i % 3 * 0.1,
        }
    );
});

// Parallax for hero
gsap.to('#hero', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
    }
});


// ==========================================
// Navbar Scroll Effect
// ==========================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});


// ==========================================
// FAQ Accordion
// ==========================================
function initFaqAccordion() {
    const triggers = document.querySelectorAll('.faq-trigger');
    if (!triggers.length) return;

    function setOpen(trigger, shouldOpen) {
        const answerId = trigger.getAttribute('aria-controls');
        const answer = answerId ? document.getElementById(answerId) : null;
        const icon = trigger.querySelector('.faq-icon');
        trigger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        if (answer) answer.classList.toggle('hidden', !shouldOpen);
        if (icon) icon.classList.toggle('rotate-180', shouldOpen);
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
            triggers.forEach((item) => setOpen(item, false));
            setOpen(trigger, willOpen);
        });
    });
}


// ==========================================
// Stat Counter Animation
// ==========================================
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    
    ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        onEnter: () => {
            let current = 0;
            const increment = target / 60;
            const suffix = stat.textContent.includes('%') ? '%' : '+';
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 25);
        },
        once: true,
    });
});


// ==========================================
// Form Submission
// ==========================================
function resetCustomProjectTypeSelect() {
    const hidden = document.getElementById('contact-type');
    const label = document.getElementById('custom-type-label');
    const panel = document.getElementById('custom-type-panel');
    const trigger = document.getElementById('custom-type-trigger');
    if (hidden) hidden.value = '';
    if (label) {
        label.textContent = t('form.type');
        label.classList.add('text-gray-400');
        label.classList.remove('text-white');
    }
    if (panel) panel.classList.add('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function initCustomProjectTypeSelect() {
    const root = document.getElementById('custom-type-root');
    const trigger = document.getElementById('custom-type-trigger');
    const panel = document.getElementById('custom-type-panel');
    const hidden = document.getElementById('contact-type');
    const label = document.getElementById('custom-type-label');
    if (!root || !trigger || !panel || !hidden || !label) return;

    function closePanel() {
        panel.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
    }

    function openPanel() {
        panel.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel.classList.contains('hidden')) openPanel();
        else closePanel();
    });

    panel.querySelectorAll('.custom-type-opt').forEach((btn) => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-value') || '';
            hidden.value = val;
            label.textContent = val ? t('form.type.' + val) : btn.textContent.trim();
            label.classList.remove('text-gray-400');
            label.classList.add('text-white');
            closePanel();
        });
    });

    document.addEventListener('click', (e) => {
        if (!root.contains(e.target)) closePanel();
    });
}

function initLanguageToggle() {
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const next = currentLanguage === 'ru' ? 'en' : 'ru';
            applyLanguage(next);
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
        });
    });
}

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nameEl = document.getElementById('contact-name');
    const tgEl = document.getElementById('contact-telegram');
    const msgEl = document.getElementById('contact-message');
    const typeVal = document.getElementById('contact-type').value;

    if (!nameEl.checkValidity()) {
        nameEl.reportValidity();
        return;
    }
    if (!tgEl.checkValidity()) {
        tgEl.reportValidity();
        return;
    }
    if (!msgEl.checkValidity()) {
        msgEl.reportValidity();
        return;
    }
    if (!typeVal) {
        showSiteModal(t('modalSelectProjectType'));
        return;
    }

    const clientTg = normalizeTelegramUser(tgEl.value);
    if (!clientTg || !/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(clientTg)) {
        showSiteModal(t('modalInvalidTelegram'));
        return;
    }

    const cfg = getSiteConfig();
    const tg = normalizeTelegramUser(cfg.telegramUsername);
    if (!tg || tg === 'your_username') {
        showSiteModal(t('modalConfigTelegram'));
        return;
    }

    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    const typeLabel = t('form.type.' + typeVal) || typeVal;

    const text = [
        t('requestTitle'),
        t('requestName') + ': ' + name,
        t('requestClientTelegram') + ': @' + clientTg,
        t('requestProjectType') + ': ' + typeLabel,
        '',
        message,
    ].join('\n');

    const url = 'https://t.me/' + tg + '?text=' + encodeURIComponent(text);
    if (url.length > 3500) {
        showSiteModal(t('modalTooLong'));
        return;
    }

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `
        <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        ${t('submitOpening')}
    `;
    btn.disabled = true;

    window.open(url, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
        btn.innerHTML = `
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ${t('submitDone')}
        `;
        btn.classList.remove('from-neon-green', 'to-accent-400');
        btn.classList.add('from-green-500', 'to-green-400');

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.classList.remove('from-green-500', 'to-green-400');
            btn.classList.add('from-neon-green', 'to-accent-400');
            this.reset();
            resetCustomProjectTypeSelect();
            lucide.createIcons();
        }, 2200);
    }, 400);
});


// ==========================================
// 3D Card Tilt Effect
// ==========================================
document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


// ==========================================
// Initialize Lucide Icons
// ==========================================
lucide.createIcons();
initCustomProjectTypeSelect();
initLanguageToggle();
initFaqAccordion();
applyLanguage(currentLanguage);


// ==========================================
// Smooth scroll for anchor links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});