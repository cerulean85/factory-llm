import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('UI Design Aligned.html', 'r', encoding='utf-8') as f:
    content = f.read()

screens = re.findall(r'<div class="dv-opt" id="([^"]+)" data-screen-label="([^"]+)">(.*?)(?=<div class="dv-opt" id=|</section>|$)', content, re.DOTALL)

for s_id, s_label, s_body in screens:
    print(f"==================================================")
    print(f"SCREEN {s_id}: {s_label}")
    print(f"==================================================")
    # Extract texts
    texts = re.findall(r'>([^<]+)<', s_body)
    cleaned = [t.strip() for t in texts if t.strip() and not t.strip().startswith('&')]
    print('\n'.join(cleaned[:30]))
    print(f"... Total text nodes: {len(cleaned)}")
