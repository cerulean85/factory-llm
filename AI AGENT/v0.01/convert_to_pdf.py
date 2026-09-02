import os, sys, json, subprocess, time

workspace_dir = r"c:\Users\hanwha\Desktop\PIRELLI\AI AGENT\v0.01"
md_path = os.path.join(workspace_dir, "concept.md")
html_path = os.path.join(workspace_dir, "concept_export.html")
pdf_path = os.path.join(workspace_dir, "CONCEPT.pdf")

with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

html_content = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>Factory Operation AI Agent - Product Concept Document</title>
<script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<style>
@page {
    size: A4;
    margin: 14mm 12mm 14mm 12mm;
}

body {
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    line-height: 1.55;
    font-size: 9.2pt;
    padding: 0;
    margin: 0;
    background-color: #ffffff;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

.header-banner {
    background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
    color: white;
    padding: 20px 24px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.header-banner h1 {
    color: #ffffff;
    border-bottom: 2px solid #38bdf8;
    padding-bottom: 8px;
    margin: 0 0 8px 0;
    font-size: 19pt;
    font-weight: 800;
}

.header-banner .subtitle {
    font-size: 11pt;
    color: #cbd5e1;
    margin-bottom: 10px;
    font-weight: 500;
}

.header-banner .meta-tags {
    display: flex;
    gap: 8px;
    font-size: 8.5pt;
}

.header-banner .meta-tag {
    background: rgba(255,255,255,0.15);
    padding: 3px 10px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.25);
    color: #f1f5f9;
}

h1 {
    font-size: 17pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 5px;
    margin-top: 22px;
    margin-bottom: 12px;
    page-break-after: avoid;
    break-after: avoid;
}

h2 {
    font-size: 13pt;
    font-weight: 700;
    color: #1e3a8a;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 18px;
    margin-bottom: 10px;
    page-break-after: avoid;
    break-after: avoid;
}

h3 {
    font-size: 10.8pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 14px;
    margin-bottom: 8px;
    page-break-after: avoid;
    break-after: avoid;
}

h4 {
    font-size: 9.8pt;
    font-weight: 600;
    color: #334155;
    margin-top: 12px;
    margin-bottom: 6px;
    page-break-after: avoid;
    break-after: avoid;
}

p, ul, ol {
    margin-top: 3px;
    margin-bottom: 6px;
}

ul, ol {
    padding-left: 18px;
}

li {
    margin-bottom: 3px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px 0;
    font-size: 8pt;
    line-height: 1.35;
}

tr {
    page-break-inside: avoid;
    break-inside: avoid;
}

th, td {
    border: 1px solid #cbd5e1;
    padding: 5px 7px;
    text-align: left;
    vertical-align: top;
}

th {
    background-color: #f1f5f9 !important;
    color: #0f172a;
    font-weight: 700;
    white-space: nowrap;
}

tr:nth-child(even) td {
    background-color: #f8fafc !important;
}

code {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 8pt;
    background-color: #f1f5f9;
    color: #0f766e;
    padding: 1px 4px;
    border-radius: 3px;
    border: 1px solid #e2e8f0;
}

pre {
    background-color: #0f172a !important;
    color: #f8fafc;
    padding: 8px 10px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 7.8pt;
    line-height: 1.3;
    page-break-inside: avoid;
    break-inside: avoid;
}

pre code {
    background-color: transparent !important;
    color: inherit;
    border: none;
    padding: 0;
}

blockquote {
    border-left: 3.5px solid #3b82f6;
    background-color: #eff6ff !important;
    padding: 6px 10px;
    margin: 8px 0;
    color: #1e40af;
    border-radius: 0 4px 4px 0;
}

hr {
    border: 0;
    height: 1px;
    background-color: #e2e8f0;
    margin: 14px 0;
}

.mermaid {
    text-align: center;
    margin: 10px 0;
    background-color: #f8fafc !important;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    page-break-inside: avoid;
    break-inside: avoid;
}

svg {
    max-width: 100% !important;
    height: auto !important;
}
</style>
</head>
<body>

<div class="header-banner">
    <h1>Factory Operation AI Agent</h1>
    <div class="subtitle">제품 컨셉 정의서 (Product Concept Document)</div>
    <div class="meta-tags">
        <span class="meta-tag">문서 버전: v0.02</span>
        <span class="meta-tag">개정 일자: 2026-08-20</span>
        <span class="meta-tag">분류: Smart Factory AX / Maintenance Support</span>
    </div>
</div>

<div id="content"></div>

<script>
const rawMd = """ + json.dumps(md_content) + """;

mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'loose',
    fontFamily: 'Noto Sans KR, sans-serif'
});

const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true
});

const defaultFence = md.renderer.rules.fence;
md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const info = token.info ? token.info.trim() : '';
    if (info === 'mermaid') {
        return '<div class="mermaid">' + token.content + '</div>';
    }
    return defaultFence(tokens, idx, options, env, self);
};

document.getElementById('content').innerHTML = md.render(rawMd);

async function initMermaid() {
    try {
        await mermaid.run();
    } catch (e) {
        console.error(e);
    }
}
initMermaid();
</script>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML created at: {html_path}")

browser_path = None
candidates = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
for c in candidates:
    if os.path.exists(c):
        browser_path = c
        break

if not browser_path:
    print("Browser not found.")
    sys.exit(1)

print(f"Using browser: {browser_path}")

cmd = [
    browser_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=6000",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Running command:", " ".join(cmd))
res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
time.sleep(1)

if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
    print(f"SUCCESS: PDF generated -> {pdf_path} ({os.path.getsize(pdf_path)} bytes)")
else:
    print("FAIL: PDF not created. Returncode:", res.returncode)
