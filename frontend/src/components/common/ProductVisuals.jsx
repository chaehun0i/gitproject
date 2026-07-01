import "@styles/components/visuals.css";

const Node = ({ className = "", x, y }) => (
  <circle className={`visual-node ${className}`} cx={x} cy={y} r="7" />
);

const Panel = ({ children, className = "", height, width, x, y }) => (
  <g className={`visual-panel ${className}`}>
    <rect height={height} rx="18" width={width} x={x} y={y} />
    {children}
  </g>
);

export const ProductHeroVisual = ({ compact = false }) => (
  <svg className={compact ? "product-visual compact" : "product-visual"} viewBox="0 0 720 480" role="img" aria-label="AI Git 분석 워크스페이스 일러스트">
    <defs>
      <linearGradient id="visualGradient" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="65%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="visualSoft" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#EEF2FF" />
        <stop offset="100%" stopColor="#F5F3FF" />
      </linearGradient>
    </defs>
    <path className="visual-glow" d="M84 378C64 270 103 110 252 63c167-53 359-12 407 109 48 120-12 242-145 276-155 39-398 38-430-70Z" />
    <Panel x="155" y="80" width="360" height="260" className="main-panel">
      <rect className="visual-sidebar" x="155" y="80" width="58" height="260" rx="18" />
      <rect className="visual-line strong" x="238" y="120" width="170" height="12" rx="6" />
      <rect className="visual-line" x="238" y="152" width="238" height="10" rx="5" />
      <rect className="visual-line green" x="238" y="190" width="212" height="14" rx="7" />
      <rect className="visual-line red" x="238" y="226" width="190" height="14" rx="7" />
      <rect className="visual-line cyan" x="238" y="262" width="236" height="10" rx="5" />
      <rect className="visual-line violet" x="238" y="292" width="154" height="10" rx="5" />
    </Panel>
    <Panel x="468" y="55" width="190" height="126" className="floating-panel">
      <path className="visual-graph" d="M508 135 545 101l39 22 38-45" />
      <Node x="508" y="135" />
      <Node x="545" y="101" className="violet" />
      <Node x="584" y="123" className="cyan" />
      <Node x="622" y="78" className="violet" />
    </Panel>
    <Panel x="455" y="214" width="230" height="134" className="floating-panel">
      <rect className="visual-bar" x="492" y="295" width="18" height="30" rx="7" />
      <rect className="visual-bar violet" x="530" y="272" width="18" height="53" rx="7" />
      <rect className="visual-bar cyan" x="568" y="238" width="18" height="87" rx="7" />
      <rect className="visual-bar" x="606" y="259" width="18" height="66" rx="7" />
    </Panel>
    <Panel x="82" y="286" width="225" height="126" className="floating-panel">
      <rect className="visual-code dark" x="112" y="320" width="150" height="10" rx="5" />
      <rect className="visual-code cyan" x="112" y="346" width="112" height="10" rx="5" />
      <rect className="visual-code violet" x="112" y="372" width="136" height="10" rx="5" />
    </Panel>
    <path className="visual-flow" d="M205 360 C292 410 472 398 568 314" />
    <circle className="visual-ai" cx="410" cy="382" r="38" />
    <path className="visual-ai-mark" d="M399 382h22M410 371v22M394 366l32 32M426 366l-32 32" />
  </svg>
);

export const PipelineVisual = () => (
  <svg className="pipeline-visual" viewBox="0 0 520 240" role="img" aria-label="분석 파이프라인 일러스트">
    <defs>
      <linearGradient id="pipelineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="70%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <rect className="pipeline-bg" x="18" y="24" width="484" height="178" rx="24" />
    <path className="pipeline-line" d="M90 118H430" />
    {[90, 175, 260, 345, 430].map((x, index) => (
      <g key={x}>
        <circle className={index < 3 ? "pipeline-dot done" : index === 3 ? "pipeline-dot active" : "pipeline-dot"} cx={x} cy="118" r="22" />
        <rect className="pipeline-card" x={x - 42} y={index % 2 === 0 ? 52 : 154} width="84" height="34" rx="12" />
      </g>
    ))}
  </svg>
);

export const RepositoryEmptyVisual = () => (
  <svg className="empty-visual" viewBox="0 0 320 220" role="img" aria-label="새 저장소 연결 일러스트">
    <path className="empty-glow" d="M57 158C33 97 75 38 148 29c82-10 149 32 151 91 2 61-53 88-124 93-55 4-100-12-118-55Z" />
    <rect className="empty-folder" x="76" y="72" width="170" height="108" rx="18" />
    <path className="empty-tab" d="M76 90c0-12 10-22 22-22h40l18 22h90v24H76V90Z" />
    <circle className="empty-plus" cx="237" cy="160" r="23" />
    <path className="empty-plus-line" d="M237 149v22M226 160h22" />
    <path className="empty-branch" d="M112 140h50c24 0 24-34 48-34h18" />
    <Node x="112" y="140" />
    <Node x="162" y="140" className="violet" />
    <Node x="228" y="106" className="cyan" />
  </svg>
);

export const RuntimeVisual = () => (
  <svg className="runtime-visual" viewBox="0 0 420 220" role="img" aria-label="로컬 런타임 상태 일러스트">
    <rect className="runtime-bg" x="20" y="24" width="380" height="172" rx="26" />
    <rect className="runtime-terminal" x="58" y="62" width="178" height="108" rx="16" />
    <circle className="runtime-dot red" cx="82" cy="86" r="5" />
    <circle className="runtime-dot yellow" cx="100" cy="86" r="5" />
    <circle className="runtime-dot green" cx="118" cy="86" r="5" />
    <rect className="runtime-line" x="82" y="116" width="104" height="8" rx="4" />
    <rect className="runtime-line cyan" x="82" y="140" width="132" height="8" rx="4" />
    <g className="runtime-db">
      <ellipse cx="306" cy="84" rx="58" ry="22" />
      <path d="M248 84v62c0 12 26 22 58 22s58-10 58-22V84" />
      <ellipse cx="306" cy="146" rx="58" ry="22" />
    </g>
    <path className="runtime-link" d="M236 116h70" />
  </svg>
);

export const InsightVisual = () => (
  <svg className="insight-visual" viewBox="0 0 180 180" role="img" aria-label="AI 인사이트 일러스트">
    <circle className="insight-orbit" cx="90" cy="90" r="62" />
    <circle className="insight-core" cx="90" cy="90" r="38" />
    <path className="insight-spark" d="M90 54v72M54 90h72M65 65l50 50M115 65l-50 50" />
    <Node x="40" y="72" />
    <Node x="138" y="48" className="violet" />
    <Node x="132" y="136" className="cyan" />
  </svg>
);
