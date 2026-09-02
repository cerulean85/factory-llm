import re
import sys

# Set stdout encoding
sys.stdout.reconfigure(encoding='utf-8')

with open('UI Design Aligned.html', 'r', encoding='utf-8') as f:
    content = f.read()

# find sections
sections = re.findall(r'<section class="dv-turn" id="([^"]+)">(.*?)</section>', content, re.DOTALL)

for sec_id, sec_body in sections:
    tname_match = re.search(r'<span class="dv-tname">(.*?)</span>', sec_body)
    tname = tname_match.group(1) if tname_match else ''
    tid_match = re.search(r'<a class="dv-tid"[^>]*>(.*?)</a>', sec_body)
    tid = tid_match.group(1) if tid_match else ''
    print(f"\n=======================================================")
    print(f"SECTION [{sec_id}] ({tid}): {tname}")
    print(f"=======================================================")
    
    screen_pattern = r'<div class="dv-opt" id="([^"]+)" data-screen-label="([^"]+)">(.*?)(?=<div class="dv-opt" id=|</section>|$)'
    screens = re.findall(screen_pattern, sec_body, re.DOTALL)
    for s_id, s_label, s_body in screens:
        olabel_match = re.search(r'<div class="dv-olabel">(.*?)</div>', s_body, re.DOTALL)
        olabel = re.sub(r'<[^<]+?>', ' ', olabel_match.group(1)).strip() if olabel_match else ''
        olabel = ' '.join(olabel.split())
        
        # Bottom notes
        bottom_notes = re.findall(r'<div style="width:1280px;[^"]*">(.*?)</div>', s_body, re.DOTALL)
        notes_text = []
        for bn in bottom_notes:
            clean_bn = re.sub(r'<[^<]+?>', ' ', bn).strip()
            clean_bn = ' '.join(clean_bn.split())
            if clean_bn:
                notes_text.append(clean_bn)
        
        print(f"\n--- SCREEN: [{s_id}] {s_label} ---")
        print(f"  Title/Meta: {olabel}")
        print(f"  Notes: {' | '.join(notes_text)}")
