import re
import html

with open('UI Design Aligned.html', 'r', encoding='utf-8') as f:
    content = f.read()

# find all sections
sections = re.findall(r'<section class="dv-turn" id="([^"]+)">(.*?)</section>', content, re.DOTALL)
print(f"Total sections: {len(sections)}")

for sec_id, sec_body in sections:
    tname_match = re.search(r'<span class="dv-tname">(.*?)</span>', sec_body)
    tname = tname_match.group(1) if tname_match else ''
    print(f"\n=== Section [{sec_id}]: {tname} ===")
    
    # find screens
    screen_pattern = r'<div class="dv-opt" id="([^"]+)" data-screen-label="([^"]+)">(.*?)(?=<div class="dv-opt" id=|</section>|$)'
    screens = re.findall(screen_pattern, sec_body, re.DOTALL)
    for s_id, s_label, s_body in screens:
        olabel_match = re.search(r'<div class="dv-olabel">(.*?)</div>', s_body, re.DOTALL)
        olabel = re.sub(r'<[^<]+?>', ' ', olabel_match.group(1)).strip() if olabel_match else ''
        olabel = ' '.join(olabel.split())
        print(f"  Screen [{s_id}] ({s_label}): {olabel}")
