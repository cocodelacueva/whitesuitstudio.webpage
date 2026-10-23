// Estructura de textos del sitio. Cada idioma (es.ts, en.ts, pt.ts) exporta un objeto Dict.
// En cualquier string se puede usar **texto** para negrita (strong, peso 500).

export type Item = { title: string; text: string };
export type Step = { when: string; title: string; text: string };
export type Stat = { value: string; label: string };
export type Work = {
  title: string;
  tag: string;
  text: string;
  status?: string;
  link?: { label: string; href: string };
};
export type Game = {
  title: string;
  platform: string;
  status: string;
  text: string;
  image?: string;
  links: { label: string; href: string }[];
};

export type PageMeta = { title: string; description: string };

export type Dict = {
  langName: string;
  nav: { home: string; software: string; iot: string; mvp: string; games: string; contact: string; menu: string };
  common: {
    talk: string;
    seeHow: string;
    founderNote: string;
    founderLink: string;
    companyNote: string;
    companyLink: string;
    confidential: string;
    inProgress: string;
  };
  contact: {
    title: string;
    text: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    ok: string;
    error: string;
    orSchedule: string;
    calendarLabel: string;
    schedule: string;
    whatsapp: string;
    whatsappMsg: string;
  };
  cookies: { text: string; policy: string; ok: string };
  footer: { rights: string; city: string };
  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    stats: Stat[];
    linkedin: string;
  };
  works: {
    kicker: string;
    title: string;
    note: string;
    clientsLabel: string;
    ownLabel: string;
    own: Work[];
    clients: Work[];
  };
  home: {
    meta: PageMeta;
    intro: string;
    scroll: string;
    doorsKicker: string;
    doorsTitle: string;
    doors: { key: 'software' | 'iot' | 'mvp' | 'games'; title: string; who: string; text: string }[];
  };
  software: {
    meta: PageMeta;
    kicker: string;
    title: string;
    lead: string;
    stats: Stat[];
    whyTitle: string;
    why: Item[];
    whatTitle: string;
    what: Item[];
    processTitle: string;
    processNote: string;
    process: Step[];
  };
  iot: {
    meta: PageMeta;
    kicker: string;
    title: string;
    lead: string;
    demoCta: string;
    whatTitle: string;
    what: Item[];
    modelTitle: string;
    yours: Item;
    ours: Item;
    nichesTitle: string;
    niches: Item[];
    demoTitle: string;
    demoText: string;
  };
  demo: {
    meta: PageMeta;
    back: string;
    title: string;
    banner: string;
    online: string;
    alerts: string;
    msgs: string;
    battery: string;
    batteryCol: string;
    devices: string;
    device: string;
    site: string;
    reading: string;
    signal: string;
    lastSeen: string;
    status: string;
    statusOk: string;
    statusWarn: string;
    statusCrit: string;
    statusOff: string;
    secondsAgo: string;
    alertLog: string;
    noAlerts: string;
    threshold: string;
    lastMinutes: string;
    pause: string;
    resume: string;
    cta: string;
    ctaText: string;
    alertHigh: string;
    alertLow: string;
    alertOffline: string;
    alertBack: string;
    alertNormal: string;
    sensors: { name: string; site: string; metric: string }[];
  };
  mvp: {
    meta: PageMeta;
    kicker: string;
    title: string;
    lead: string;
    stats: Stat[];
    principlesTitle: string;
    principles: Item[];
    methodTitle: string;
    method: Step[];
    deckText: string;
    deckLink: string;
    insightsTitle: string;
    insights: { tag: string; title: string; href: string }[];
    readOn: string;
    modal: { title: string; text: string; email: string; name: string; optional: string; submit: string; opening: string; error: string; privacy: string; close: string };
  };
  games: {
    meta: PageMeta;
    kicker: string;
    title: string;
    lead: string;
    list: Game[];
  };
};
