'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Dict } from '@/content/types';

/* ------------------------------------------------------------------
   Demo de telemetría con datos SIMULADOS. Nada se conecta a un backend:
   cada 2 segundos se genera una nueva lectura por dispositivo.
------------------------------------------------------------------- */

type Cfg = { unit: string; base: number; noise: number; drift: number; low?: number; high?: number; battery: number; signal: number; decimals: number };

const CFG: Cfg[] = [
  { unit: '°C', base: 3.4, noise: 0.18, drift: 0.35, low: 0, high: 6, battery: 92, signal: 4, decimals: 1 }, // cámara de frío 1
  { unit: '°C', base: 18.5, noise: 0.15, drift: 0.8, high: 28, battery: 71, signal: 3, decimals: 1 }, // silo
  { unit: 'bar', base: 3.2, noise: 0.08, drift: 0.25, low: 2, high: 4.5, battery: 64, signal: 2, decimals: 2 }, // bomba
  { unit: 'A', base: 142, noise: 4, drift: 14, high: 180, battery: 100, signal: 4, decimals: 0 }, // tablero
  { unit: '%', base: 64, noise: 0.9, drift: 6, low: 20, high: 90, battery: 48, signal: 3, decimals: 0 }, // estación meteo
  { unit: '°C', base: 3.8, noise: 0.18, drift: 0.3, low: 0, high: 6, battery: 88, signal: 4, decimals: 1 }, // cámara de frío 2 (tiene un evento)
];

const HISTORY = 60; // 60 puntos x 2 s = 2 minutos
const TICK_MS = 2000;
const CYCLE = 150; // los eventos guionados se repiten cada 5 minutos
const START = CYCLE + 40; // arranca con la cámara 2 calentándose: a los ~15 s dispara la primera alerta

type Status = 'ok' | 'warn' | 'crit' | 'off';
type Device = { values: (number | null)[]; battery: number; online: boolean; lastSeen: number };
type LogEntry = { id: number; tick: number; level: Status; text: string };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Valor "verdadero" de cada sensor en un tick dado, con eventos guionados. */
function signal(i: number, tick: number, rnd: () => number): number | null {
  const c = CFG[i];
  const phase = tick % CYCLE;
  // la bomba de riego pierde conexión un rato
  if (i === 2 && phase >= 95 && phase < 112) return null;
  let v = c.base + Math.sin((tick + i * 17) / 14) * c.drift + (rnd() - 0.5) * 2 * c.noise;
  // la cámara de frío 2 se calienta (puerta abierta) y después se recupera
  if (i === 5 && phase >= 30 && phase < 80) {
    const p = phase - 30;
    v += p < 30 ? p * 0.12 : Math.max(0, 3.6 - (p - 30) * 0.2);
  }
  return v;
}

function statusOf(i: number, v: number | null, online: boolean): Status {
  if (!online || v === null) return 'off';
  const c = CFG[i];
  if ((c.high !== undefined && v > c.high) || (c.low !== undefined && v < c.low)) return 'crit';
  const span = (c.high ?? c.base * 1.5) - (c.low ?? 0);
  if ((c.high !== undefined && v > c.high - span * 0.1) || (c.low !== undefined && v < c.low + span * 0.1)) return 'warn';
  return 'ok';
}

function fmt(v: number | null, i: number) {
  if (v === null) return '—';
  return `${v.toFixed(CFG[i].decimals)} ${CFG[i].unit}`;
}

function fill(s: string, vars: Record<string, string>) {
  return s.replace(/\{(\w)\}/g, (_, k) => vars[k] ?? '');
}

const ICON: Record<Status, string> = { ok: '●', warn: '▲', crit: '■', off: '○' };

function initial() {
  const rnd = mulberry32(7);
  const devices: Device[] = CFG.map((c, i) => {
    const values: (number | null)[] = [];
    for (let t = START - HISTORY + 1; t <= START; t++) values.push(signal(i, t, rnd));
    return { values, battery: c.battery, online: values[values.length - 1] !== null, lastSeen: 0 };
  });
  return { devices, tick: START };
}

export default function IotDemo({ t }: { t: Dict['demo'] }) {
  const [state, setState] = useState(initial);
  const [selected, setSelected] = useState(5);
  const [paused, setPaused] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const rndRef = useRef(mulberry32(99));
  const logId = useRef(0);
  const alerted = useRef<boolean[]>(CFG.map(() => false));

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const prev = stateRef.current;
      const tick = prev.tick + 1;
      const events: LogEntry[] = [];
      const devices = prev.devices.map((d, i) => {
        const v = signal(i, tick, rndRef.current);
        const prevV = d.values[d.values.length - 1];
        const before = statusOf(i, prevV, d.online);
        const online = v !== null;
        const after = statusOf(i, v, online);
        const name = t.sensors[i].name;
        if (before !== 'off' && after === 'off') events.push({ id: ++logId.current, tick, level: 'off', text: fill(t.alertOffline, { d: name }) });
        if (before === 'off' && after !== 'off') events.push({ id: ++logId.current, tick, level: 'ok', text: fill(t.alertBack, { d: name }) });
        if (after === 'ok' && alerted.current[i]) {
          alerted.current[i] = false;
          events.push({ id: ++logId.current, tick, level: 'ok', text: fill(t.alertNormal, { d: name }) });
        }
        if (before !== 'crit' && after === 'crit' && v !== null && !alerted.current[i]) {
          alerted.current[i] = true;
          const high = CFG[i].high !== undefined && v > CFG[i].high!;
          events.push({ id: ++logId.current, tick, level: 'crit', text: fill(high ? t.alertHigh : t.alertLow, { d: name, m: t.sensors[i].metric.toLowerCase(), v: fmt(v, i) }) });
        }
        const values = [...d.values.slice(1), v];
        const battery = Math.max(5, d.battery - (rndRef.current() < 0.04 ? 1 : 0));
        return { values, battery, online, lastSeen: online ? 0 : d.lastSeen + TICK_MS / 1000 };
      });
      const next = { devices, tick };
      stateRef.current = next;
      setState(next);
      if (events.length) setLog((l) => [...events.reverse(), ...l].slice(0, 12));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [paused, t]);

  const statuses = state.devices.map((d, i) => statusOf(i, d.values[d.values.length - 1], d.online));
  const online = state.devices.filter((d) => d.online).length;
  const activeAlerts = statuses.filter((s, i) => s === 'crit' || s === 'off' || alerted.current[i]).length;
  const msgs = online * 12 + (state.tick % 5);
  const battery = Math.round(state.devices.reduce((a, d) => a + d.battery, 0) / state.devices.length);
  const statusLabel: Record<Status, string> = { ok: t.statusOk, warn: t.statusWarn, crit: t.statusCrit, off: t.statusOff };

  const sel = state.devices[selected];
  const selV = sel.values[sel.values.length - 1];

  return (
    <div className="demo">
      <div className="demo-top">
        <div>
          <span className="demo-badge">{t.banner}</span>
          <h1 className="demo-title">{t.title}</h1>
        </div>
        <button type="button" className="link" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? `▶ ${t.resume}` : `❙❙ ${t.pause}`}
        </button>
      </div>

      <div className="kpis">
        <div className="kpi"><span className="kl">{t.online}</span><span className="kv">{online}<small> / {state.devices.length}</small></span></div>
        <div className="kpi"><span className="kl">{t.alerts}</span><span className={`kv${activeAlerts ? ' is-crit' : ''}`}>{activeAlerts}</span></div>
        <div className="kpi"><span className="kl">{t.msgs}</span><span className="kv">{msgs}</span></div>
        <div className="kpi"><span className="kl">{t.battery}</span><span className="kv">{battery}<small> %</small></span></div>
      </div>

      <div className="demo-main">
        <div className="panel chart-panel">
          <div className="chart-head">
            <div>
              <div className="ch-name">{t.sensors[selected].name}</div>
              <div className="ch-sub">{t.sensors[selected].site} · {t.sensors[selected].metric} · {t.lastMinutes}</div>
            </div>
            <div className="ch-value">
              <span>{fmt(selV, selected)}</span>
              <StatusTag s={statuses[selected]} label={statusLabel[statuses[selected]]} />
            </div>
          </div>
          <LineChart values={sel.values} idx={selected} thresholdLabel={t.threshold} secondsAgo={t.secondsAgo} />
        </div>

        <div className="panel log-panel">
          <h2 className="panel-title">{t.alertLog}</h2>
          {log.length === 0 ? (
            <p className="muted small-text">{t.noAlerts}</p>
          ) : (
            <ul className="log">
              {log.map((e) => (
                <li key={e.id}>
                  <span className={`ico s-${e.level}`} aria-hidden>{ICON[e.level]}</span>
                  <span className="lt">{e.text}</span>
                  <span className="lw">{fill(t.secondsAgo, { n: String((state.tick - e.tick) * 2) })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">{t.devices}</h2>
        <table className="dtable">
          <thead>
            <tr>
              <th>{t.device}</th>
              <th>{t.site}</th>
              <th className="num">{t.reading}</th>
              <th className="num">{t.batteryCol}</th>
              <th>{t.signal}</th>
              <th>{t.lastSeen}</th>
              <th>{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {state.devices.map((d, i) => {
              const v = d.values[d.values.length - 1];
              return (
                <tr key={i} className={i === selected ? 'is-sel' : ''} onClick={() => setSelected(i)} tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(i)} aria-selected={i === selected}>
                  <td data-l={t.device}><strong>{t.sensors[i].name}</strong><span className="mob-site">{t.sensors[i].site}</span></td>
                  <td data-l={t.site} className="hide-mob">{t.sensors[i].site}</td>
                  <td data-l={t.reading} className="num">{fmt(v, i)}</td>
                  <td data-l={t.batteryCol} className="num">{d.battery} %</td>
                  <td data-l={t.signal}><Bars n={d.online ? CFG[i].signal : 0} /></td>
                  <td data-l={t.lastSeen}>{fill(t.secondsAgo, { n: String(d.online ? 2 : Math.round(d.lastSeen)) })}</td>
                  <td data-l={t.status}><StatusTag s={statuses[i]} label={statusLabel[statuses[i]]} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusTag({ s, label }: { s: Status; label: string }) {
  return (
    <span className={`stag s-${s}`}>
      <span aria-hidden>{ICON[s]}</span> {label}
    </span>
  );
}

function Bars({ n }: { n: number }) {
  return (
    <span className="bars" aria-label={`${n}/4`}>
      {[1, 2, 3, 4].map((b) => <i key={b} className={b <= n ? 'on' : ''} style={{ height: `${(3 + b * 3) / 16}rem` }} />)}
    </span>
  );
}

function LineChart({ values, idx, thresholdLabel, secondsAgo }: { values: (number | null)[]; idx: number; thresholdLabel: string; secondsAgo: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const [hover, setHover] = useState<number | null>(null);
  const [rem, setRem] = useState(16);
  const k = rem / 16; // escala con la tipografía en pantallas grandes
  const h = Math.round(240 * k);
  const pad = { l: 44 * k, r: 12 * k, t: 14 * k, b: 26 * k };

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    setRem(parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
    const ro = new ResizeObserver(([e]) => {
      setW(Math.max(260, e.contentRect.width));
      setRem(parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const c = CFG[idx];
  const { min, max } = useMemo(() => {
    const nums = values.filter((v): v is number => v !== null);
    let lo = Math.min(...nums, c.high !== undefined ? c.high : Infinity);
    let hi = Math.max(...nums, c.high !== undefined ? c.high : -Infinity);
    if (c.low !== undefined && Math.min(...nums) - c.low < (hi - lo) * 0.6) lo = Math.min(lo, c.low);
    const padv = (hi - lo) * 0.12 || 1;
    return { min: lo - padv, max: hi + padv };
  }, [values, c]);

  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const x = (i: number) => pad.l + (i / (values.length - 1)) * iw;
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * ih;

  // segmentos continuos (se corta donde el dispositivo no reportó)
  const segs: string[] = [];
  let cur = '';
  values.forEach((v, i) => {
    if (v === null) { if (cur) segs.push(cur); cur = ''; return; }
    cur += `${cur ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
  });
  if (cur) segs.push(cur);

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, k) => min + ((max - min) * k) / ticks);
  const last = values.length - 1;
  const lastV = values[last];
  const thresholds = [c.high, c.low].filter((v): v is number => v !== undefined && v > min && v < max);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const i = Math.round(((px - pad.l) / iw) * (values.length - 1));
    setHover(i >= 0 && i <= last ? i : null);
  }

  const hv = hover !== null ? values[hover] : null;

  return (
    <div className="chart" ref={wrap}>
      <svg width={w} height={h} onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label="chart">
        {yTicks.map((v, k) => (
          <g key={k}>
            <line x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} className="grid-line" />
            <text x={pad.l - 8} y={y(v) + 4} className="axis" textAnchor="end">{v.toFixed(c.decimals > 0 ? 1 : 0)}</text>
          </g>
        ))}
        {thresholds.map((tv) => (
          <g key={tv}>
            <line x1={pad.l} x2={w - pad.r} y1={y(tv)} y2={y(tv)} className="thr" />
            <text x={pad.l + 6} y={y(tv) - 6} className="thr-label">{thresholdLabel} {tv} {c.unit}</text>
          </g>
        ))}
        <text x={pad.l} y={h - 6} className="axis">−2 min</text>
        <text x={pad.l + iw / 2} y={h - 6} className="axis" textAnchor="middle">−1 min</text>
        <text x={w - pad.r} y={h - 6} className="axis" textAnchor="end">0</text>
        {segs.map((d, k) => <path key={k} d={d} className="series" />)}
        {lastV !== null && <circle cx={x(last)} cy={y(lastV)} r={4.5 * k} className="last-dot" />}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} className="cross" />
            {hv !== null && <circle cx={x(hover)} cy={y(hv)} r={4.5 * k} className="hover-dot" />}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div className="tip" style={{ left: Math.min(Math.max(x(hover), 70), w - 70), top: hv !== null ? y(hv) - 12 : pad.t }}>
          <strong>{hv === null ? '—' : `${hv.toFixed(c.decimals)} ${c.unit}`}</strong>
          <span>{fill(secondsAgo, { n: String((last - hover) * 2) })}</span>
        </div>
      )}
    </div>
  );
}
