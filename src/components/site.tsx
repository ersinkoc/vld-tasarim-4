"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Copy,
  Moon,
  Sun,
  Menu,
  X,
  Terminal,
  Zap,
  Braces,
  ShieldCheck,
  Package,
  Globe,
  Play,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { v } from "@oxog/vld";
import { repository } from "@/lib/site-config";

function navigateTabs(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  select: (index: number) => void,
) {
  const next =
    event.key === "ArrowRight"
      ? (index + 1) % count
      : event.key === "ArrowLeft"
        ? (index - 1 + count) % count
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? count - 1
            : null;
  if (next === null) return;
  event.preventDefault();
  select(next);
  event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
}

function Github({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label="VLD home"
    >
      <span className="brand-mark">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M5 7L13 24H18L27 7H20L15.5 17L11 7H5Z" fill="currentColor" />
          <path d="M21 21H27V27H21V21Z" fill="currentColor" />
        </svg>
      </span>
      <span>
        vld<span className="brand-period">.</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    try {
      document.documentElement.dataset.theme =
        localStorage.getItem("vld-theme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch {
      /* Preserve the inline script's theme when storage is unavailable. */
    }
  }, []);
  function toggleTheme() {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("vld-theme", next);
    } catch {
      /* Theme works without storage. */
    }
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="header">
        <div className="header-inner">
          <Logo />
          <nav
            className={`navigation ${open ? "is-open" : ""}`}
            aria-label="Main navigation"
            onClick={() => setOpen(false)}
          >
            <Link href="/docs">Documentation</Link>
            <Link href="/#features">Why VLD?</Link>
            <Link href="/#benchmarks">Benchmarks</Link>
            <Link href="/playground">
              Playground <span className="nav-dot" />
            </Link>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
            >
              <Moon className="moon" size={18} />
              <Sun className="sun" size={18} />
            </button>
            <span className="nav-divider" />
            <a
              className="github-nav"
              href={repository}
              target="_blank"
              rel="noreferrer"
              aria-label="VLD on GitHub"
            >
              <Github size={19} />
              <span>GitHub</span>
              <ArrowUpRight size={14} />
            </a>
            <button
              className="icon-button mobile-menu"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("revealed");
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState("idle"), 2200);
  }
  return (
    <button
      onClick={copy}
      className={`copy-button ${className}`}
      aria-label={state === "copied" ? "Copied to clipboard" : `Copy ${label}`}
    >
      <span aria-live="polite">
        {state === "copied"
          ? "Copied!"
          : state === "error"
            ? "Select to copy"
            : label}
      </span>
      {state === "copied" ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

export function InstallCommand({ compact = false }: { compact?: boolean }) {
  const [manager, setManager] = useState("npm");
  const command = `${manager} ${manager === "npm" ? "install" : "add"} @oxog/vld`;
  return (
    <div className={`install ${compact ? "compact" : ""}`}>
      <select
        aria-label="Package manager"
        value={manager}
        onChange={(event) => setManager(event.target.value)}
      >
        {["npm", "pnpm", "bun", "yarn"].map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <ChevronDown size={12} className="select-chevron" />
      <code>
        <span className="prompt">$</span> {command}
      </code>
      <CopyButton text={command} label="install command" />
    </div>
  );
}

const heroSchema = v.object({
  name: v.string().min(2),
  email: v.string().email(),
  ready: v.boolean(),
});
// Round SVG coordinates so server and browser floating-point math serialize identically.
const coreRings = Array.from({ length: 52 }, (_, index) => {
  const angle = (index * Math.PI * 2) / 52;
  const cx = (Math.cos(angle) * 103).toFixed(4);
  const cy = (Math.sin(angle) * 67).toFixed(4);
  return {
    cx,
    cy,
    transform: `rotate(${((index * 360) / 52).toFixed(4)} ${cx} ${cy})`,
    opacity: (0.55 + Math.sin(angle) * 0.35).toFixed(4),
  };
});

export function ValidationCore() {
  const [validated, setValidated] = useState(false);
  const [hover, setHover] = useState(false);
  const [message, setMessage] = useState("Click the core. Trust the data.");
  function validate() {
    if (validated) {
      setValidated(false);
      setMessage("Click the core. Trust the data.");
      return;
    }
    const result = heroSchema.safeParse({
      name: "Alex",
      email: "alex@vld.dev",
      ready: true,
    });
    setValidated(result.success);
    setMessage(
      result.success
        ? "Schema checked. Possibilities unlocked."
        : "Invalid data detected.",
    );
  }
  return (
    <div
      className={`core-scene ${validated ? "is-validated" : ""} ${hover ? "is-hovered" : ""}`}
    >
      <div className="scene-grid" aria-hidden="true" />
      <div className="scene-orbit orbit-one" aria-hidden="true" />
      <div className="scene-orbit orbit-two" aria-hidden="true" />
      <div className="scene-caption">
        <span className="tiny-cross">+</span> THE VALIDATION CORE{" "}
        <span>001</span>
      </div>
      <div className="floating-token token-string">
        <Braces size={15} />
        <span>string</span>
      </div>
      <div className="floating-token token-number">
        <span className="token-hash">#</span>
        <span>number</span>
      </div>
      <div className="floating-token token-boolean">
        <Check size={14} />
        <span>boolean</span>
      </div>
      <button
        className="core-button"
        onClick={validate}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        aria-label={
          validated ? "Reset validation core" : "Validate sample data"
        }
        aria-pressed={validated}
      >
        <div className="core-shadow" />
        <svg
          className="core-art"
          viewBox="0 0 500 500"
          fill="none"
          aria-hidden="true"
        >
          <g transform="translate(250 250) rotate(-32)">
            {coreRings.map((ring, index) => (
              <ellipse
                key={index}
                {...ring}
                rx={51}
                ry={112}
                stroke="currentColor"
                strokeWidth="1.6"
              />
            ))}
            <ellipse
              rx="159"
              ry="166"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </g>
        </svg>
        <div className="core-center">
          {validated ? <Check size={38} strokeWidth={1.5} /> : <LogoGlyph />}
        </div>
      </button>
      <div className="core-status">
        <span className="status-light" />
        {validated ? "ALL SYSTEMS VALID" : "BUILT TO BE CERTAIN"}
        <span className="status-corner">↗</span>
      </div>
      <div className="data-tag data-tag-input">
        <span>INPUT</span>
        <code>{validated ? "unknown → trusted" : "{ data: unknown }"}</code>
        <span className="data-tag-dot" />
      </div>
      <div className="data-tag data-tag-output">
        <span>OUTPUT</span>
        <code>
          <span className="code-green">success</span>:{" "}
          {validated ? "true" : "?"}
        </code>
        <ShieldCheck size={18} />
      </div>
      <div className="scene-bottom">
        <span className="tiny-cross">+</span>
        <span aria-live="polite">{message}</span>
        <span className="scene-coordinates">50.0 / 50.0</span>
      </div>
    </div>
  );
}

function LogoGlyph() {
  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 7L13 24H18L27 7H20L15.5 17L11 7H5Z" fill="currentColor" />
      <path d="M21 21H27V27H21V21Z" fill="currentColor" />
    </svg>
  );
}

const demos = [
  {
    name: "User profile",
    filename: "user.schema.ts",
    schema: v.object({
      name: v.string().min(2),
      email: v.string().email(),
      age: v.number().int().positive(),
    }),
    code: `import { v } from '@oxog/vld';\n\nconst user = v.object({\n  name: v.string().min(2),\n  email: v.string().email(),\n  age: v.number().int().positive(),\n});\n\ntype User = v.infer<typeof user>;\n\nuser.safeParse(data);`,
    valid: { name: "Alex Morgan", email: "alex@example.com", age: 28 },
    invalid: { name: "A", email: "not-an-email", age: -2 },
  },
  {
    name: "API response",
    filename: "response.schema.ts",
    schema: v.object({
      id: v.number().int().positive(),
      status: v.enum("success", "pending"),
      tags: v.array(v.string()),
    }),
    code: `import { v } from '@oxog/vld';\n\nconst response = v.object({\n  id: v.number().int().positive(),\n  status: v.enum('success', 'pending'),\n  tags: v.array(v.string()),\n});\n\ntype Response = v.infer<typeof response>;\n\nresponse.safeParse(data);`,
    valid: { id: 42, status: "success", tags: ["typescript", "vld"] },
    invalid: { id: -1, status: "failed", tags: [123] },
  },
  {
    name: "App settings",
    filename: "settings.schema.ts",
    schema: v.object({
      theme: v.enum("light", "dark"),
      notifications: v.boolean(),
      language: v.string().min(2),
    }),
    code: `import { v } from '@oxog/vld';\n\nconst settings = v.object({\n  theme: v.enum('light', 'dark'),\n  notifications: v.boolean(),\n  language: v.string().min(2),\n});\n\ntype Settings = v.infer<typeof settings>;\n\nsettings.safeParse(data);`,
    valid: { theme: "dark", notifications: true, language: "en" },
    invalid: { theme: "neon", notifications: "yes", language: "" },
  },
];

export function Code({ code }: { code: string }) {
  const tokenPattern =
    /('[^']*'|"[^"]*"|\b(?:import|from|const|type|typeof|true|false|return|export)\b|\b\d+\b|\/\/.*$)/g;
  return (
    <pre className="highlighted-code">
      <code>
        {code.split("\n").map((line, i) => (
          <span className="code-line" key={i}>
            <span className="line-number" aria-hidden="true">
              {i + 1}
            </span>
            <span>
              {line.split(tokenPattern).map((token, j) => (
                <span
                  className={
                    /^['"]/.test(token)
                      ? "syntax-string"
                      : /^(import|from|const|type|typeof|return|export)$/.test(
                            token,
                          )
                        ? "syntax-keyword"
                        : /^(true|false|\d+)$/.test(token)
                          ? "syntax-value"
                          : /^\/\//.test(token)
                            ? "syntax-comment"
                            : ""
                  }
                  key={j}
                >
                  {token}
                </span>
              ))}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}

export function Playground({ standalone = false }: { standalone?: boolean }) {
  const [active, setActive] = useState(0);
  const [input, setInput] = useState(JSON.stringify(demos[0].valid, null, 2));
  const [output, setOutput] = useState<{ success: boolean; text: string }>({
    success: true,
    text: JSON.stringify(demos[0].valid, null, 2),
  });
  const [time, setTime] = useState("");
  const [dirty, setDirty] = useState(false);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function run(value = input, index = active) {
    const start = performance.now();
    try {
      const parsed: unknown = JSON.parse(value);
      const result = demos[index].schema.safeParse(parsed);
      setOutput({
        success: result.success,
        text: JSON.stringify(
          result.success ? result.data : result.error.issues,
          null,
          2,
        ),
      });
    } catch (error) {
      setOutput({
        success: false,
        text: error instanceof Error ? error.message : "Invalid JSON",
      });
    }
    setTime((performance.now() - start).toFixed(2));
    setDirty(false);
    setRunning(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRunning(false), 500);
  }
  function select(index: number) {
    setActive(index);
    const value = JSON.stringify(demos[index].valid, null, 2);
    setInput(value);
    run(value, index);
  }
  function invalid() {
    const value = JSON.stringify(demos[active].invalid, null, 2);
    setInput(value);
    run(value);
  }
  function reset() {
    const value = JSON.stringify(demos[active].valid, null, 2);
    setInput(value);
    run(value);
  }
  return (
    <section
      className={`playground-section ${standalone ? "standalone" : ""}`}
      id="playground"
    >
      <div className="container">
        <Reveal>
          <div className="section-eyebrow">
            <span className="eyebrow-square" /> LESS GUESSWORK. MORE BUILDING.
          </div>
          <div className="section-heading-row">
            <h2>
              See certainty
              <br />
              in action<span className="orange-text">.</span>
            </h2>
            <div className="section-intro">
              <p>
                A familiar API. An unfamiliar amount of speed.
                <br />
                Give your data a little reality check.
              </p>
              <span className="live-pill">
                <span /> REAL VLD. RIGHT IN YOUR BROWSER.
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="playground-panel">
            <div className="playground-toolbar">
              <div
                className="playground-tabs"
                role="tablist"
                aria-label="Validation examples"
              >
                {demos.map((demo, i) => (
                  <button
                    role="tab"
                    id={`example-tab-${i}`}
                    aria-controls="playground-example"
                    tabIndex={i === active ? 0 : -1}
                    aria-selected={i === active}
                    key={demo.name}
                    onClick={() => select(i)}
                    onKeyDown={(event) =>
                      navigateTabs(event, i, demos.length, select)
                    }
                  >
                    {demo.name}
                  </button>
                ))}
              </div>
              <span className="browser-label">
                <span />
                @oxog/vld
              </span>
            </div>
            <div
              className="editor-grid"
              id="playground-example"
              role="tabpanel"
              aria-labelledby={`example-tab-${active}`}
            >
              <div className="schema-editor">
                <div className="editor-heading">
                  <span>
                    <Braces size={14} />
                    {demos[active].filename}
                  </span>
                  <CopyButton text={demos[active].code} label="schema" />
                </div>
                <Code code={demos[active].code} />
                <div className="schema-note">
                  <ShieldCheck size={14} /> Your schema is your type. Always in
                  sync.
                </div>
              </div>
              <div className="data-editor">
                <div className="editor-heading">
                  <label htmlFor="json-input">
                    <span className="json-icon">{}</span>input.json
                  </label>
                  <button className="text-button" onClick={invalid}>
                    Try invalid data <ArrowUpRight size={13} />
                  </button>
                </div>
                <textarea
                  id="json-input"
                  aria-label="JSON input"
                  spellCheck={false}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setDirty(true);
                  }}
                  onKeyDown={(event) => {
                    if (
                      (event.ctrlKey || event.metaKey) &&
                      event.key === "Enter"
                    ) {
                      event.preventDefault();
                      run();
                    }
                  }}
                />
                <div
                  className={`result-panel ${!output.success ? "result-error" : ""}`}
                  aria-live="polite"
                >
                  <div className="result-heading">
                    <span>
                      {dirty ? (
                        <RotateCcw size={14} />
                      ) : output.success ? (
                        <Check size={14} />
                      ) : (
                        <X size={14} />
                      )}{" "}
                      {dirty
                        ? "Input changed · run to validate"
                        : output.success
                          ? "Validation passed"
                          : "Validation failed"}
                    </span>
                    {time && <span>{time} ms</span>}
                  </div>
                  <pre>{output.text}</pre>
                </div>
              </div>
            </div>
            <div className="playground-bottom">
              <span>
                <span className="status-light" />{" "}
                {running
                  ? "Freshly validated. Feels good, right?"
                  : "No setup. No server. Just your data."}
              </span>
              <div>
                <button
                  onClick={reset}
                  className="reset-button"
                  aria-label="Reset example"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  className="button button-orange run-button"
                  onClick={() => run()}
                >
                  <Play size={13} fill="currentColor" />
                  Run validation <span>⌘ ↵</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const benchmarkCases = [
  {
    label: "Realistic API",
    vld: 243,
    zod: 767,
    ratio: "3.2×",
    detail: "10-field object schema",
  },
  {
    label: "Number",
    vld: 6,
    zod: 39,
    ratio: "6.5×",
    detail: "Integer, positive, minimum",
  },
  {
    label: "String",
    vld: 22,
    zod: 50,
    ratio: "2.3×",
    detail: "Minimum length + email",
  },
  {
    label: "Object",
    vld: 11,
    zod: 18,
    ratio: "1.6×",
    detail: "A string and a number",
  },
];
export function Benchmarks() {
  const [active, setActive] = useState(0);
  const item = benchmarkCases[active];
  return (
    <section className="benchmark-section" id="benchmarks">
      <div className="container">
        <Reveal className="benchmark-layout">
          <div className="benchmark-copy">
            <div className="section-eyebrow">
              <span className="eyebrow-square" /> FAST IS A FEATURE.
            </div>
            <h2>
              Your app has
              <br />
              places to be<span>.</span>
            </h2>
            <p>
              Validation shouldn’t be the thing slowing it down.
              <br />
              Less waiting. Less memory. More room to build.
            </p>
            <a
              className="text-link"
              href={`${repository}/blob/main/benchmarks/dropin-vs-zod.cjs`}
              target="_blank"
              rel="noreferrer"
            >
              Don't take our word for it <ArrowUpRight size={16} />
            </a>
            <span className="benchmark-asterisk" aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="benchmark-chart">
            <div className="chart-header">
              <span>ONE MILLION VALIDATIONS</span>
              <span>
                LESS TIME = BETTER <ArrowDownMini />
              </span>
            </div>
            <div
              className="chart-tabs"
              role="tablist"
              aria-label="Benchmark scenario"
            >
              {benchmarkCases.map((item, i) => (
                <button
                  key={item.label}
                  role="tab"
                  id={`benchmark-tab-${i}`}
                  aria-controls="benchmark-result"
                  tabIndex={i === active ? 0 : -1}
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  onKeyDown={(event) =>
                    navigateTabs(event, i, benchmarkCases.length, setActive)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div
              className="chart-bars"
              id="benchmark-result"
              role="tabpanel"
              aria-labelledby={`benchmark-tab-${active}`}
            >
              <div className="chart-row">
                <span className="chart-name">
                  vld<span>.</span>
                </span>
                <div className="bar-track">
                  <div
                    className="bar bar-vld"
                    style={{ width: `${(item.vld / item.zod) * 82}%` }}
                  />
                </div>
                <span className="chart-time">{item.vld} ms</span>
              </div>
              <div className="chart-row">
                <span className="chart-name zod-name">Zod</span>
                <div className="bar-track">
                  <div className="bar bar-zod" style={{ width: "82%" }} />
                </div>
                <span className="chart-time">{item.zod} ms</span>
              </div>
            </div>
            <div className="chart-verdict" aria-live="polite">
              <span className="chart-multiplier">{item.ratio}</span>
              <div>
                <strong>faster. Same peace of mind.</strong>
                <span>{item.detail} · VLD V2 vs Zod 4.5</span>
              </div>
              <Zap size={28} />
            </div>
            <p className="benchmark-footnote">
              Published repository measurements · 1M safeParse operations.
              <br />
              Results vary by schema and environment.{" "}
              <a
                href={`${repository}#performance-impact-v2-vs-v1-same-machine-1m-safeparse-ops`}
                target="_blank"
                rel="noreferrer"
              >
                Methodology ↗
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArrowDownMini() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 1v9m-4-4 4 4 4-4" stroke="currentColor" fill="none" />
    </svg>
  );
}

export function Features() {
  const features = [
    {
      number: "01",
      title: "Nothing weighing you down.",
      copy: "Zero runtime dependencies. A tree-shakeable Mini API. Take exactly what you need, and leave the rest.",
      link: "Explore the Mini API",
      href: "/docs#mini",
      icon: Package,
      style: "feature-mini",
    },
    {
      number: "02",
      title: "Feels like you’ve used it before.",
      copy: "Already know Zod? You already know VLD. Familiar schemas, familiar methods, one new import.",
      link: "Make the switch",
      href: "/docs#migration",
      icon: Braces,
      style: "feature-import",
    },
    {
      number: "03",
      title: "Speaks your users’ language.",
      copy: "Helpful errors in 27+ languages, with lazy loading. Because clarity shouldn’t get lost in translation.",
      link: "Meet the locales",
      href: "/docs#locales",
      icon: Globe,
      style: "feature-globe",
    },
  ];
  return (
    <section className="features-section" id="features">
      <div className="container">
        <Reveal>
          <div className="section-eyebrow">
            <span className="eyebrow-square" /> SMALL BY DESIGN. CAPABLE BY
            NATURE.
          </div>
          <div className="section-heading-row">
            <h2>
              All the good stuff.
              <br />
              None of the baggage.
            </h2>
            <p className="section-intro">
              Built for developers who care about
              <br />
              what they ship. And how it feels to build.
            </p>
          </div>
        </Reveal>
        <div className="features-grid">
          {features.map(
            ({ number, title, copy, link, href, icon: Icon, style }) => (
              <Reveal className={`feature ${style}`} key={number}>
                <div className="feature-art" aria-hidden="true">
                  {number === "01" ? (
                    <>
                      <div className="mini-box">
                        <Icon size={49} strokeWidth={1} />
                        <span>vld / mini</span>
                      </div>
                      <span className="art-label">ONLY WHAT YOU NEED.</span>
                      <div className="box-orbit" />
                    </>
                  ) : number === "02" ? (
                    <div className="import-art">
                      <code>
                        <span>−</span> from <b>'zod'</b>
                      </code>
                      <code>
                        <span>+</span> from <b>'@oxog/vld'</b>
                      </code>
                      <span className="import-check">
                        <Check size={18} />
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="language-ring">
                        <Globe size={104} strokeWidth={0.6} />
                      </div>
                      <span className="language lang-one">Hello</span>
                      <span className="language lang-two">Merhaba</span>
                      <span className="language lang-three">こんにちは</span>
                      <span className="language lang-four">Hallo</span>
                    </>
                  )}
                </div>
                <div className="feature-content">
                  <span className="feature-number">/{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <Link href={href} className="text-link">
                    {link}
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo footer />
            <p>
              A little validation.
              <br />A lot of possibility.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <span>BUILD</span>
              <Link href="/docs">Documentation</Link>
              <Link href="/playground">Playground</Link>
              <Link href="/#benchmarks">Benchmarks</Link>
            </div>
            <div>
              <span>EXPLORE</span>
              <a
                href={`${repository}/releases`}
                target="_blank"
                rel="noreferrer"
              >
                Changelog <ArrowUpRight size={12} />
              </a>
              <a href={repository} target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight size={12} />
              </a>
              <a
                href="https://www.npmjs.com/package/@oxog/vld"
                target="_blank"
                rel="noreferrer"
              >
                npm <ArrowUpRight size={12} />
              </a>
            </div>
            <div>
              <span>CONNECT</span>
              <a
                href={`${repository}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noreferrer"
              >
                Contribute
              </a>
              <a href={`${repository}/issues`} target="_blank" rel="noreferrer">
                Report an issue
              </a>
              <a href="https://oxog.dev" target="_blank" rel="noreferrer">
                The OXOG family <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VLD · Open source. Open possibilities.</span>
          <a
            href={`${repository}/blob/main/LICENSE`}
            target="_blank"
            rel="noreferrer"
          >
            MIT licensed
          </a>
          <span>
            Made with intention by{" "}
            <a
              href="https://github.com/ersinkoc"
              target="_blank"
              rel="noreferrer"
            >
              Ersin KOC ↗
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <a
                className="release-badge"
                href={`${repository}/releases`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="release-dot" />
                <span>v3.0.11 IS HERE</span>
                <span className="release-divider" />
                <span>Small package. Big energy.</span>
                <ArrowUpRight size={13} />
              </a>
              <h1>
                Good data.
                <br />
                <span className="hero-orange">
                  Great things.
                  <svg
                    viewBox="0 0 490 15"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 10C120 2 336 1 486 6M48 14C184 5 323 5 411 9"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="hero-description">
                The tiny TypeScript validator with a big need for speed.
                <br className="desktop-break" /> Turn unknown data into absolute
                confidence.
                <br className="desktop-break" /> Zero dependencies. Zero
                second-guessing.
              </p>
              <div className="hero-buttons">
                <Link className="button button-dark" href="/docs">
                  Start building <ArrowUpRight size={18} />
                </Link>
                <Link className="button button-outline" href="#playground">
                  <Terminal size={17} />
                  Take it for a spin
                </Link>
              </div>
              <InstallCommand />
              <div className="hero-small-print">
                <span>
                  <Check size={13} /> TypeScript first
                </span>
                <span>
                  <Check size={13} /> Zod friendly
                </span>
                <span>
                  <Check size={13} /> MIT licensed
                </span>
              </div>
            </div>
            <ValidationCore />
          </div>
          <div className="container hero-bottom">
            <span>LESS FRICTION. MORE FLOW.</span>
            <span className="scroll-note">
              A little scroll goes a long way <span>↓</span>
            </span>
          </div>
        </section>
        <section className="stats-strip" aria-label="VLD at a glance">
          <div className="container stats-grid">
            <div className="stats-intro">
              <span className="asterisk">✳</span>
              <span>
                Light on your bundle.
                <br />
                <strong>Heavy on the good stuff.</strong>
              </span>
            </div>
            <div className="stat">
              <strong>
                3.03<span>×</span>
              </strong>
              <div>
                faster than Zod<small>Published drop-in benchmark</small>
              </div>
            </div>
            <div className="stat">
              <strong>0</strong>
              <div>
                runtime dependencies<small>No extra baggage</small>
              </div>
            </div>
            <div className="stat">
              <strong>
                27<span>+</span>
              </strong>
              <div>
                languages<small>Clarity, everywhere</small>
              </div>
            </div>
          </div>
        </section>
        <Features />
        <section className="flow-band" aria-label="From unknown to understood">
          <div className="flow-track" aria-hidden="true">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                unknown <ArrowRight /> validated <Check /> typed <Braces />{" "}
                trusted <span className="flow-star">✳</span>
              </span>
            ))}
          </div>
          <p>Life’s complicated. Your validation doesn’t have to be.</p>
        </section>
        <Playground />
        <Benchmarks />
        <section className="cta-section">
          <div className="container">
            <Reveal className="cta-content">
              <span className="section-eyebrow">
                YOUR NEXT GREAT THING STARTS HERE.
              </span>
              <h2>
                Less <span className="cta-unknown">unknown.</span>
                <br />
                More{" "}
                <span className="orange-text">
                  let’s go
                  <svg viewBox="0 0 350 18" aria-hidden="true">
                    <path
                      d="M2 14Q175-2 348 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                  .
                </span>
              </h2>
              <p>
                One install. A familiar API. A little more confidence in every
                line.
              </p>
              <div className="cta-buttons">
                <Link href="/docs" className="button button-orange">
                  Get started <ArrowUpRight size={18} />
                </Link>
                <a
                  href={repository}
                  className="button button-outline"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={17} />
                  Star on GitHub
                </a>
              </div>
              <span
                className="cta-decoration decoration-left"
                aria-hidden="true"
              >
                {"{ }"}
              </span>
              <span
                className="cta-decoration decoration-right"
                aria-hidden="true"
              >
                ✳
              </span>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
