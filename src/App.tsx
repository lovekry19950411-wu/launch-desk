import {
  CheckCircle2,
  ClipboardList,
  Mail,
  Languages,
  Loader2,
  Megaphone,
  MessageCircle,
  Moon,
  Send,
  ShieldAlert,
  Sparkles,
  Sun
} from "lucide-react";
import { CSSProperties, FormEvent, ReactNode, useMemo, useRef, useState } from "react";
import { WorldHumanGate } from "./WorldHumanGate";

type StreamEvent =
  | { type: "tool_progress"; name: string; message: string; payload?: unknown }
  | { type: "text_delta"; delta: string }
  | { type: "done"; traceId: string }
  | { type: "error"; message: string };

type Language = "zh" | "en";
type Theme = "light" | "dark";
type WorkflowStatus = "running" | "completed";
type StageStatus = "waiting" | "queued" | "initializing" | "running" | "validating" | "analyzing" | "streaming" | "finalized" | "completed";
type RiskLevel = "low" | "medium" | "high";

type WorkflowItem = {
  name: string;
  label: string;
  status: WorkflowStatus;
  summary: string;
  risks: string[];
  reasoning: string;
  payload?: unknown;
};

type RuntimeEvent = {
  time: string;
  source: string;
  state: "queued" | "initializing" | "running" | "validating" | "analyzing" | "streaming" | "finalized";
  message: string;
};

type QueuedUiEvent =
  | Extract<StreamEvent, { type: "tool_progress" }>
  | Extract<StreamEvent, { type: "text_delta" }>
  | Extract<StreamEvent, { type: "done" }>;

type NarrativeStage = {
  label: string;
  detail: string;
  status: StageStatus;
};

const examples = {
  zh: {
    productBrief:
      "我們要推出 Team Insights，一個給 SaaS 團隊使用的上市作戰儀表板。它會把產品摘要、上市日期、限制條件與既有素材整理成發布計畫、風險清單、負責人待辦與多通路公告文案。",
    audience: "AI 新創、SaaS 團隊、indie hacker、產品經理與 launch manager",
    launchDate: "2026-06-18",
    constraints: "第一版必須保持範圍很小，不做 auth、資料庫、billing、marketplace，也不能有加密貨幣投機感。",
    assets: "產品截圖、早期用戶回饋、草稿 release notes、Discord 社群公告草稿、簡短 demo flow"
  },
  en: {
    productBrief:
      "We are launching Team Insights, a launch operations dashboard for SaaS teams. It turns a product summary, launch date, constraints, and existing materials into a release plan, risk register, owner checklist, and channel-specific launch copy.",
    audience: "AI startups, SaaS teams, indie hackers, PMs, and launch managers",
    launchDate: "2026-06-18",
    constraints: "The first version must stay narrow. No auth, database, billing, marketplace, or crypto-like product feeling.",
    assets: "Product screenshots, early user feedback, draft release notes, Discord announcement draft, short demo flow"
  }
};

const copy = {
  zh: {
    kicker: "AI PM Toolchain API",
    tagline: "AI-native workflow engine for product launches",
    purpose:
      "Launch Desk 不是聊天機器人。它是一個專注在產品上市、發布規劃、風險分析與 PM 執行流程的 AI workflow infrastructure。前端只是展示層，真正的產品價值在可被 API 呼叫的 workflow engine。",
    productBrief: "產品摘要",
    audience: "目標受眾",
    launchDate: "上市日期",
    constraints: "限制條件",
    assets: "既有素材",
    submit: "執行 Launch Workflow",
    running: "AI workflow 執行中...",
    statuses: ["計畫", "風險", "負責人", "文案"],
    workflow: "AI Workflow Execution",
    readinessScore: "Launch readiness",
    overallRisk: "Overall risk",
    lowRisk: "低風險",
    mediumRisk: "中風險",
    highRisk: "高風險",
    runningStatus: "執行中",
    completedStatus: "完成",
    analysisSummary: "分析摘要",
    discoveredRisks: "發現的風險",
    reasoningSummary: "AI reasoning summary",
    completionStatus: "completion status",
    agentRun: "Workflow Run",
    generatedAssets: "Generated launch assets",
    ready: "等待輸入 launch brief",
    streaming: "AI agents are executing launch operations",
    placeholder:
      "送出 brief 後，這裡會產生上市準備分數、風險分析、發布計畫、負責人清單與多通路文案。Workflow panel 會同步顯示每個 AI tool 的執行狀態。",
    thinking: "等待第一個 workflow node",
    modelStream: "model stream",
    themeLight: "淺色模式",
    themeDark: "深色模式",
    noRisks: "目前未發現明確風險。",
    missionBrief: "MISSION BRIEF",
    commandBuffer: "Command input buffer",
    systemActivity: "System activity",
    activityIdle: "等待 workflow dispatch。",
    runtimeConsole: "Runtime event stream",
    runtimeIdle: "runtime idle / awaiting launch brief",
    chips: ["Launch workflows", "Risk analysis", "Release planning", "PM execution"],
    serviceEyebrow: "AI Prototype Studio",
    serviceTitle: "需要 AI 工作流 MVP 或 AI startup demo？",
    serviceBody: "目前可接 prototype / demo 製作。適合想把 AI workflow、agent runtime、MVP 產品概念快速做成可展示版本的 founder 或小團隊。",
    serviceX: "X / Twitter",
    serviceEmail: "Email",
    serviceDm: "DM open for prototype work",
    serviceEmailValue: "lovekry19950411@gmail.com"
  },
  en: {
    kicker: "AI PM Toolchain API",
    tagline: "AI-native workflow engine for product launches",
    purpose:
      "Launch Desk is not a generic chatbot. It is focused workflow infrastructure for product launches, release planning, risk analysis, and PM execution. The dashboard is the showcase layer; the real product value is the API-callable workflow engine.",
    productBrief: "Product summary",
    audience: "Target audience",
    launchDate: "Launch date",
    constraints: "Constraints",
    assets: "Existing materials",
    submit: "Run Launch Workflow",
    running: "AI workflow running...",
    statuses: ["Plan", "Risks", "Owners", "Copy"],
    workflow: "AI Workflow Execution",
    readinessScore: "Launch readiness",
    overallRisk: "Overall risk",
    lowRisk: "Low risk",
    mediumRisk: "Medium risk",
    highRisk: "High risk",
    runningStatus: "Running",
    completedStatus: "Complete",
    analysisSummary: "Analysis summary",
    discoveredRisks: "Discovered risks",
    reasoningSummary: "AI reasoning summary",
    completionStatus: "completion status",
    agentRun: "Workflow Run",
    generatedAssets: "Generated launch assets",
    ready: "Waiting for launch brief",
    streaming: "AI agents are executing launch operations",
    placeholder:
      "Submit the brief to generate readiness score, risk analysis, release plan, owner checklist, and channel copy. The workflow panel will show each AI tool execution state in parallel.",
    thinking: "Waiting for first workflow node",
    modelStream: "model stream",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    noRisks: "No explicit risks found yet.",
    missionBrief: "MISSION BRIEF",
    commandBuffer: "Command input buffer",
    systemActivity: "System activity",
    activityIdle: "Waiting for workflow dispatch.",
    runtimeConsole: "Runtime event stream",
    runtimeIdle: "runtime idle / awaiting launch brief",
    chips: ["Launch workflows", "Risk analysis", "Release planning", "PM execution"],
    serviceEyebrow: "AI Prototype Studio",
    serviceTitle: "Need an AI workflow MVP or startup demo?",
    serviceBody: "Available for prototype work. I help founders and small teams turn AI workflow, agent runtime, and MVP product ideas into polished demos people can actually understand.",
    serviceX: "X / Twitter",
    serviceEmail: "Email",
    serviceDm: "DM open for prototype work",
    serviceEmailValue: "lovekry19950411@gmail.com"
  }
};

export function App() {
  const [language, setLanguage] = useState<Language>("zh");
  const [theme, setTheme] = useState<Theme>("dark");
  const [form, setForm] = useState(examples.zh);
  const [output, setOutput] = useState("");
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const runtimeQueue = useRef<QueuedUiEvent[]>([]);
  const runtimeTimer = useRef<number | null>(null);
  const runStartedAt = useRef<Date | null>(null);

  const t = copy[language];
  const toolEvents = useMemo(() => events.filter((event) => event.type === "tool_progress"), [events]);
  const workflowItems = useMemo(() => buildWorkflowItems(toolEvents, language), [toolEvents, language]);
  const narrativeStages = useMemo(() => buildNarrativeStages(workflowItems, events.length > 0, isRunning, output.length > 0, language), [workflowItems, events.length, isRunning, output.length, language]);
  const runtimeEvents = useMemo(() => buildRuntimeEvents(toolEvents, output.length > 0, language, runStartedAt.current), [toolEvents, output.length, language]);
  const readiness = getReadiness(toolEvents);
  const riskLevel = getRiskLevel(readiness?.score);
  const trace = [...events].reverse().find((event): event is Extract<StreamEvent, { type: "done" }> => event.type === "done");

  function switchLanguage(next: Language) {
    setLanguage(next);
    setForm(examples[next]);
    setOutput("");
    setEvents([]);
    setError("");
  }

  function enqueueRuntimeEvent(payload: QueuedUiEvent) {
    runtimeQueue.current.push(payload);
    scheduleRuntimeFlush();
  }

  function scheduleRuntimeFlush() {
    if (runtimeTimer.current) return;

    runtimeTimer.current = window.setTimeout(() => {
      runtimeTimer.current = null;
      const next = runtimeQueue.current.shift();
      if (!next) return;

      if (next.type === "text_delta") {
        setOutput((current) => current + next.delta);
      } else {
        setEvents((current) => [...current, next]);
        if (next.type === "done") setIsRunning(false);
      }

      if (runtimeQueue.current.length > 0) {
        const delay = next.type === "tool_progress" ? 520 : next.type === "done" ? 360 : 48;
        runtimeTimer.current = window.setTimeout(() => {
          runtimeTimer.current = null;
          scheduleRuntimeFlush();
        }, delay);
      }
    }, 260);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setOutput("");
    setEvents([]);
    setError("");
    setIsRunning(true);
    runStartedAt.current = new Date();
    runtimeQueue.current = [];
    if (runtimeTimer.current) {
      window.clearTimeout(runtimeTimer.current);
      runtimeTimer.current = null;
    }
    setEvents([{ type: "tool_progress", name: "launchdesk.runtime", message: "Runtime queued" }]);
    scheduleRuntimeFlush();

    if (import.meta.env.VITE_RUNTIME_MODE === "mock") {
      enqueueMockRuntime();
      return;
    }

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.body) throw new Error("No response stream returned.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          const line = chunk.split("\n").find((item) => item.startsWith("data: "));
          if (!line) continue;
          const payload = JSON.parse(line.slice(6)) as StreamEvent;
          if (payload.type === "tool_progress" || payload.type === "text_delta" || payload.type === "done") {
            enqueueRuntimeEvent(payload);
          }
          if (payload.type === "error") setError(payload.message);
        }
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown request failure");
    } finally {
      enqueueRuntimeEvent({ type: "done", traceId: "local-runtime-finalized" });
    }
  }

  function enqueueMockRuntime() {
    const mockToolEvents: QueuedUiEvent[] = [
      { type: "tool_progress", name: "extract_tasks_from_brief", message: "Tool started" },
      {
        type: "tool_progress",
        name: "extract_tasks_from_brief",
        message: "Tool completed",
        payload: {
          launchDate: form.launchDate,
          prioritizedTasks: [
            { id: "T1", priority: "P0", task: "Confirm launch scope and no-go criteria" },
            { id: "T2", priority: "P0", task: "Prepare rollout timeline" },
            { id: "T3", priority: "P1", task: "Draft release communications" },
            { id: "T4", priority: "P1", task: "Assign launch owners" },
            { id: "T5", priority: "P2", task: "Schedule launch-day monitoring" }
          ]
        }
      },
      { type: "tool_progress", name: "check_launch_readiness", message: "Tool started" },
      {
        type: "tool_progress",
        name: "check_launch_readiness",
        message: "Tool completed",
        payload: {
          readiness: "Likely ready",
          score: 82,
          topRisks: [
            "Launch promise may drift without crisp no-go criteria",
            "Support readiness may lag release engineering",
            "Monitoring ownership needs a launch-day fallback"
          ]
        }
      },
      { type: "tool_progress", name: "generate_owner_checklist", message: "Tool started" },
      {
        type: "tool_progress",
        name: "generate_owner_checklist",
        message: "Tool completed",
        payload: [
          { owner: "Engineering", checklist: [{ item: "Freeze release candidate" }] },
          { owner: "Product", checklist: [{ item: "Approve launch scope" }] },
          { owner: "Marketing", checklist: [{ item: "Publish launch copy" }] }
        ]
      },
      { type: "tool_progress", name: "draft_channel_copy", message: "Tool started" },
      {
        type: "tool_progress",
        name: "draft_channel_copy",
        message: "Tool completed",
        payload: [
          { channel: "email", draft: "Introducing the launch workflow operating system." },
          { channel: "social", draft: "Launch readiness: 82%." }
        ]
      }
    ];

    const finalText = language === "zh"
      ? "## Launch readiness: 82%\n\n系統已完成模擬 runtime：風險引擎、發布規劃、負責人分派與 release assets 均已 finalized。\n\n### 主要建議\n- 鎖定 P0 launch scope 與 no-go criteria\n- 指派 launch-day monitoring owner\n- 將 release notes、社群公告與 email copy 對齊同一個 launch promise\n"
      : "## Launch readiness: 82%\n\nThe simulated runtime finalized risk analysis, release planning, owner assignment, and release assets.\n\n### Recommended actions\n- Lock P0 launch scope and no-go criteria\n- Assign a launch-day monitoring owner\n- Align release notes, community announcement, and email copy around one launch promise\n";

    mockToolEvents.forEach((event) => enqueueRuntimeEvent(event));
    finalText.match(/.{1,36}/gs)?.forEach((chunk) => enqueueRuntimeEvent({ type: "text_delta", delta: chunk }));
    enqueueRuntimeEvent({ type: "done", traceId: "mock-runtime-finalized" });
  }

  return (
    <main className={`shell ${theme}`} lang={language === "zh" ? "zh-Hant" : "en"}>
      <div className="ambientGrid" aria-hidden="true" />
      <section className="workspace">
        <aside className="panel inputPanel">
          <div className="topBar">
            <div className="brand">
              <div className="brandMark"><Sparkles size={20} /></div>
              <div>
                <span className="kicker">{t.kicker}</span>
                <h1>Launch Desk</h1>
                <p>{t.tagline}</p>
              </div>
            </div>
            <div className="toggles" aria-label="Display controls">
              <button type="button" className={language === "zh" ? "toggle active" : "toggle"} onClick={() => switchLanguage("zh")} title="繁體中文">
                <Languages size={16} /> 中
              </button>
              <button type="button" className={language === "en" ? "toggle active" : "toggle"} onClick={() => switchLanguage("en")} title="English">
                EN
              </button>
              <button type="button" className="toggle iconOnly" onClick={() => setTheme(theme === "light" ? "dark" : "light")} title={theme === "light" ? t.themeDark : t.themeLight}>
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          </div>

          <div className="purpose">{t.purpose}</div>
          <div className="pillRow">
            {t.chips.map((chip) => <span key={chip}>{chip}</span>)}
          </div>

          <WorldHumanGate />

          <form onSubmit={submit} className="form">
            <div className="missionHeader">
              <span>{t.missionBrief}</span>
              <strong>{t.commandBuffer}</strong>
            </div>
            <label>
              <span>{t.productBrief}</span>
              <textarea value={form.productBrief} onChange={(event) => setForm({ ...form, productBrief: event.target.value })} rows={7} />
            </label>
            <div className="row">
              <label>
                <span>{t.audience}</span>
                <input value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} />
              </label>
              <label>
                <span>{t.launchDate}</span>
                <input type="date" value={form.launchDate} onChange={(event) => setForm({ ...form, launchDate: event.target.value })} />
              </label>
            </div>
            <label>
              <span>{t.constraints}</span>
              <textarea value={form.constraints} onChange={(event) => setForm({ ...form, constraints: event.target.value })} rows={4} />
            </label>
            <label>
              <span>{t.assets}</span>
              <textarea value={form.assets} onChange={(event) => setForm({ ...form, assets: event.target.value })} rows={3} />
            </label>
            <button disabled={isRunning} className="primary">
              {isRunning ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
              {isRunning ? t.running : t.submit}
            </button>
          </form>
        </aside>

        <section className="outputArea">
          <div className="statusGrid">
            <Status icon={<ClipboardList />} label={t.statuses[0]} active={output.length > 0} />
            <Status icon={<ShieldAlert />} label={t.statuses[1]} active={toolEvents.length > 0} />
            <Status icon={<CheckCircle2 />} label={t.statuses[2]} active={toolEvents.length > 1} />
            <Status icon={<Megaphone />} label={t.statuses[3]} active={toolEvents.length > 2} />
          </div>

          <div className="panel streamPanel">
            <div className="panelHeader">
              <div>
                <h2>{t.agentRun}</h2>
                <p>{trace ? `Trace ${trace.traceId}` : isRunning ? t.streaming : t.ready}</p>
              </div>
              <div className={isRunning ? "liveBadge active" : "liveBadge"}>
                <span />
                {isRunning ? "orchestrating" : "standby"}
              </div>
            </div>

            {error && <div className="error">{error}</div>}

            <div className={isRunning ? "workflowPanel active" : "workflowPanel"}>
              <div className="workflowTitle">
                <span>{t.workflow}</span>
                <div className="workflowMeta">
                  <div className="orchestratorDots" aria-hidden="true"><i /><i /><i /></div>
                  <small>{workflowItems.filter((item) => item.status === "completed").length}/{workflowItems.length || 4}</small>
                </div>
              </div>
              <div className="flowStack" aria-label="Launch workflow structure">
                {narrativeStages.map((stage, index) => (
                  <div className={`flowStep ${stage.status}`} key={stage.label}>
                    <span className="flowIndex">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{stage.label}</strong>
                      <p>{stage.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="runtimeConsole">
                <div className="runtimeTitle">
                  <span>{t.runtimeConsole}</span>
                  <small>{runtimeEvents.length ? "streaming" : "idle"}</small>
                </div>
                <div className="runtimeFeed">
                  {runtimeEvents.length === 0 ? (
                    <div className="runtimeLine queued">
                      <time>--:--:--</time>
                      <strong>launchdesk.runtime</strong>
                      <em>queued</em>
                      <span>{t.runtimeIdle}</span>
                    </div>
                  ) : runtimeEvents.map((event, index) => (
                    <div className={`runtimeLine ${event.state}`} key={`${event.time}-${event.source}-${index}`}>
                      <time>{event.time}</time>
                      <strong>{event.source}</strong>
                      <em>{event.state}</em>
                      <span>{event.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {workflowItems.length === 0 && (
                <div className="workflowCard compact runtimeWaiting">
                  {isRunning ? <Loader2 className="spin" size={16} /> : <span className="dot idle" />}
                  <span>{isRunning ? t.thinking : t.ready}</span>
                </div>
              )}
              {workflowItems.map((item, index) => {
                return (
                  <div className={`workflowCard runtimeNode ${item.status}`} key={item.name} style={{ "--delay": `${index * 90}ms` } as CSSProperties}>
                    <div className="workflowButton">
                      <span className="nodeIndex">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`dot ${item.status}`} />
                      <span className="workflowName">{item.label}</span>
                      <span className={`statusPill ${item.status}`}>{runtimeStateForTool(item.name, item.status)}</span>
                    </div>
                    <div className="runtimeNodeBody">
                      <div>
                        <span>{t.analysisSummary}</span>
                        <p>{item.summary}</p>
                      </div>
                      <div>
                        <span>{t.reasoningSummary}</span>
                        <p>{item.reasoning}</p>
                      </div>
                    </div>
                    <div className="nodeProgress" />
                  </div>
                );
              })}
            </div>

            <div className={isRunning ? "metricRow processing" : "metricRow"}>
              <div className="metric readinessEngine">
                <div className="scoreOrb" style={{ "--score": readiness ? readiness.score : 0 } as CSSProperties}>
                  <strong>{readiness ? readiness.score : "--"}</strong>
                  <span>%</span>
                </div>
                <div className="metricCopy">
                  <span>{t.readinessScore}</span>
                  <p>AI decision engine</p>
                </div>
              </div>
              <div className={`metric risk ${riskLevel}`}>
                <span>{t.overallRisk}</span>
                <strong>{riskLevel === "high" ? t.highRisk : riskLevel === "medium" ? t.mediumRisk : t.lowRisk}</strong>
              </div>
            </div>

            <div className="generatedHeader">
              <span>{t.generatedAssets}</span>
            </div>
            <article className="markdown">
              {output ? output : t.placeholder}
            </article>
          </div>
        </section>
      </section>

      <section className="serviceSection" aria-labelledby="service-title">
        <div className="serviceCopy">
          <span>{t.serviceEyebrow}</span>
          <h2 id="service-title">{t.serviceTitle}</h2>
          <p>{t.serviceBody}</p>
        </div>
        <div className="contactGrid" aria-label="Contact links">
          <a className="contactCard" href="https://x.com/G9Yeu21" target="_blank" rel="noreferrer">
            <MessageCircle size={17} />
            <span>{t.serviceX}</span>
            <strong>{t.serviceDm}</strong>
          </a>
          <a className="contactCard" href={`mailto:${t.serviceEmailValue}`}>
            <Mail size={17} />
            <span>{t.serviceEmail}</span>
            <strong>{t.serviceEmailValue}</strong>
          </a>
        </div>
      </section>
    </main>
  );
}

function Status({ icon, label, active }: { icon: ReactNode; label: string; active: boolean }) {
  return (
    <div className={active ? "status active" : "status"}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="infoBlock">
      <span>{title}</span>
      <p>{value}</p>
    </div>
  );
}

function buildWorkflowItems(events: Extract<StreamEvent, { type: "tool_progress" }>[], language: Language): WorkflowItem[] {
  const order = ["extract_tasks_from_brief", "check_launch_readiness", "generate_owner_checklist", "draft_channel_copy"];
  const labels = {
    zh: {
      extract_tasks_from_brief: "任務拆解",
      check_launch_readiness: "上市準備檢查",
      generate_owner_checklist: "負責人清單",
      draft_channel_copy: "通路文案草稿"
    },
    en: {
      extract_tasks_from_brief: "Task extraction",
      check_launch_readiness: "Launch readiness check",
      generate_owner_checklist: "Owner checklist",
      draft_channel_copy: "Channel copy drafts"
    }
  } as const;

  const latest = new Map<string, WorkflowItem>();
  for (const event of events) {
    const previous = latest.get(event.name);
    const completed = event.message.toLowerCase().includes("completed");
    latest.set(event.name, {
      name: event.name,
      label: labels[language][event.name as keyof typeof labels.zh] || event.name,
      status: completed ? "completed" : previous?.status || "running",
      payload: completed ? event.payload : previous?.payload,
      ...summarizeTool(event.name, completed ? event.payload : previous?.payload, language)
    });
  }

  return order.filter((name) => latest.has(name)).map((name) => latest.get(name)!);
}

function buildNarrativeStages(items: WorkflowItem[], hasRunStarted: boolean, isRunning: boolean, hasOutput: boolean, language: Language): NarrativeStage[] {
  const zh = language === "zh";
  const has = (name: string) => items.find((item) => item.name === name);
  const statusFor = (name: string): StageStatus => {
    const item = has(name);
    if (!item) return "waiting";
    return item.status === "completed" ? runtimeStateForTool(name, "completed") : runtimeStateForTool(name, "running");
  };

  return [
    {
      label: zh ? "Brief" : "Brief",
      detail: zh ? "任務輸入已送入 command buffer" : "Mission input enters the command buffer",
      status: hasRunStarted ? "finalized" : isRunning ? "queued" : "waiting"
    },
    {
      label: zh ? "Risk Engine" : "Risk Engine",
      detail: zh ? "掃描上市阻礙與 readiness rubric" : "Scans launch blockers and readiness rubric",
      status: statusFor("check_launch_readiness")
    },
    {
      label: zh ? "Launch Planner" : "Launch Planner",
      detail: zh ? "拆解優先任務與發布路徑" : "Extracts priority tasks and release path",
      status: statusFor("extract_tasks_from_brief")
    },
    {
      label: zh ? "Owner Assignment" : "Owner Assignment",
      detail: zh ? "將 workflow 映射到負責角色" : "Maps workflow work to accountable owners",
      status: statusFor("generate_owner_checklist")
    },
    {
      label: zh ? "Release Assets" : "Release Assets",
      detail: zh ? "產生通路文案與最終輸出" : "Generates channel copy and final assets",
      status: hasOutput ? "finalized" : statusFor("draft_channel_copy")
    }
  ];
}

function buildRuntimeEvents(events: Extract<StreamEvent, { type: "tool_progress" }>[], hasOutput: boolean, language: Language, startedAt: Date | null): RuntimeEvent[] {
  const zh = language === "zh";
  const runtime: RuntimeEvent[] = [];
  const base = startedAt ?? new Date();
  const timestamp = (offsetSeconds: number) => {
    const value = new Date(base.getTime() + offsetSeconds * 1000);
    return value.toLocaleTimeString("en-US", { hour12: false });
  };

  if (events.length > 0) {
    runtime.push({
      time: timestamp(0),
      source: "launchdesk.runtime",
      state: "queued",
      message: zh ? "brief received; dispatching launch workflow graph" : "brief received; dispatching launch workflow graph"
    });
    runtime.push({
      time: timestamp(1),
      source: "orchestration.kernel",
      state: "initializing",
      message: zh ? "agent graph initializing; runtime slots allocated" : "agent graph initializing; runtime slots allocated"
    });
  }

  events.filter((event) => event.name !== "launchdesk.runtime").forEach((event, index) => {
    const completed = event.message.toLowerCase().includes("completed");
    const source = runtimeSourceForTool(event.name);
    runtime.push({
      time: timestamp(2 + index * 2),
      source,
      state: completed ? runtimeStateForTool(event.name, "completed") as RuntimeEvent["state"] : runtimeStateForTool(event.name, "running") as RuntimeEvent["state"],
      message: runtimeMessageForEvent(event.name, completed, zh)
    });
  });
  if (hasOutput) {
    runtime.push({
      time: timestamp(3 + events.length * 2),
      source: "release-assets.stream",
      state: "finalized",
      message: zh ? "release assets streamed to command console" : "release assets streamed to command console"
    });
  }
  return runtime.slice(-10);
}

function runtimeSourceForTool(name: string) {
  if (name === "extract_tasks_from_brief") return "priority-extraction.agent";
  if (name === "check_launch_readiness") return "launch-risk-engine";
  if (name === "generate_owner_checklist") return "owner-assignment.agent";
  if (name === "draft_channel_copy") return "release-assets.agent";
  return "launchdesk.agent";
}

function runtimeStateForTool(name: string, status: WorkflowStatus): RuntimeEvent["state"] {
  if (status !== "completed") {
    if (name === "extract_tasks_from_brief") return "initializing";
    if (name === "check_launch_readiness") return "analyzing";
    if (name === "draft_channel_copy") return "streaming";
    return "running";
  }
  if (name === "check_launch_readiness") return "validating";
  return "finalized";
}

function runtimeMessageForEvent(name: string, completed: boolean, zh: boolean) {
  if (name === "extract_tasks_from_brief") return completed ? (zh ? "priority extraction completed; rollout tasks generated" : "priority extraction completed; rollout tasks generated") : "priority extraction running...";
  if (name === "check_launch_readiness") return completed ? (zh ? "risk engine validated launch readiness rubric" : "risk engine validated launch readiness rubric") : "launch-risk-engine initialized";
  if (name === "generate_owner_checklist") return completed ? (zh ? "owner assignment graph finalized" : "owner assignment graph finalized") : "owner assignment running...";
  if (name === "draft_channel_copy") return completed ? (zh ? "release assets finalized for channels" : "release assets finalized for channels") : "release asset stream opened...";
  return completed ? "agent finalized" : "agent running...";
}

function summarizeTool(name: string, payload: unknown, language: Language) {
  const zh = language === "zh";
  const fallback = {
    summary: zh ? "AI 正在分析這個 workflow node 的輸入與工具結果。" : "The AI is analyzing this workflow node and tool output.",
    risks: [] as string[],
    reasoning: zh
      ? "先把 launch brief 轉成結構化中間結果，再交給最終 release plan 整合。"
      : "The agent converts the launch brief into structured intermediate output before final release-plan synthesis."
  };

  if (!payload) return fallback;
  const value = payload as any;

  if (name === "extract_tasks_from_brief") {
    const tasks = Array.isArray(value.prioritizedTasks) ? value.prioritizedTasks : [];
    return {
      summary: zh ? `已拆出 ${tasks.length} 個優先任務，涵蓋 P0/P1/P2 發布工作。` : `Extracted ${tasks.length} prioritized launch tasks across P0/P1/P2 work.`,
      risks: tasks.length < 4 ? [zh ? "任務數偏少，可能代表 brief 還不夠完整。" : "Task count is low, which may mean the brief lacks detail."] : [],
      reasoning: zh
        ? "AI 先把模糊的產品摘要轉成可排程、可分派的 release work items。"
        : "The AI first turns the rough product summary into schedulable, assignable release work items."
    };
  }

  if (name === "check_launch_readiness") {
    return {
      summary: zh ? `上市準備分數 ${value.score ?? "--"}，狀態為 ${value.readiness ?? "未定"}。` : `Readiness score is ${value.score ?? "--"} with status ${value.readiness ?? "unknown"}.`,
      risks: Array.isArray(value.topRisks) ? value.topRisks : [],
      reasoning: zh
        ? "AI 依 scope、audience、timeline、assets、constraints 進行 rubric 檢查，分數越低代表越需要 launch review。"
        : "The AI checks scope, audience, timeline, assets, and constraints against a launch rubric; lower scores need deeper launch review."
    };
  }

  if (name === "generate_owner_checklist") {
    const owners = Array.isArray(value) ? value.map((item) => item.owner).filter(Boolean) : [];
    return {
      summary: zh
        ? `已產生 ${owners.length} 組負責人待辦：${owners.slice(0, 4).join("、")}${owners.length > 4 ? "..." : ""}`
        : `Generated owner checklists for ${owners.length} functions: ${owners.slice(0, 4).join(", ")}${owners.length > 4 ? "..." : ""}`,
      risks: owners.length < 3 ? [zh ? "負責人覆蓋不足，上市日可能缺少跨部門支援。" : "Owner coverage is thin; launch day support may be under-staffed."] : [],
      reasoning: zh
        ? "AI 把工作映射到工程、產品、支援、行銷等角色，讓 workflow 有明確責任邊界。"
        : "The AI maps work to functions such as engineering, product, support, and marketing so the workflow has accountable owners."
    };
  }

  if (name === "draft_channel_copy") {
    const drafts = Array.isArray(value) ? value : [];
    return {
      summary: zh ? `已產生 ${drafts.length} 種通路文案草稿。` : `Generated ${drafts.length} channel-specific copy drafts.`,
      risks: drafts.length < 3 ? [zh ? "文案通路覆蓋不足，可能錯過主要受眾接觸點。" : "Copy coverage is limited and may miss key audience touchpoints."] : [],
      reasoning: zh
        ? "AI 依 email、Slack、blog、social、in-app 等情境調整訊息密度與語氣。"
        : "The AI adapts message density and tone for email, Slack, blog, social, and in-app contexts."
    };
  }

  return fallback;
}

function getReadiness(events: Extract<StreamEvent, { type: "tool_progress" }>[]) {
  const event = [...events].reverse().find((item) => item.name === "check_launch_readiness" && item.message.toLowerCase().includes("completed"));
  const payload = event?.payload as { score?: number; readiness?: string } | undefined;
  return typeof payload?.score === "number" ? payload : undefined;
}

function getRiskLevel(score?: number): RiskLevel {
  if (typeof score !== "number") return "medium";
  if (score < 50) return "high";
  if (score < 75) return "medium";
  return "low";
}
