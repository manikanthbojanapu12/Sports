import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for fname in html_files:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content

    # Replace class="text-dark" on headings and paragraphs
    new_content = re.sub(r'class="([^"]*)\btext-dark\b([^"]*)"', r'class="\1text-light\2"', new_content)
    new_content = re.sub(r'color:\s*var\(--text-dark\);?', 'color: #ffffff;', new_content)
    new_content = re.sub(r'fill="var\(--text-dark\)"', 'fill="#00f0ff"', new_content)

    # In player-dashboard.html, fix qr code container
    new_content = new_content.replace('background:#fff; padding:12px; border-radius:12px; color:#000;', 'background:rgba(15, 25, 45, 0.95); border: 1px solid rgba(0,240,255,0.3); padding:12px; border-radius:12px; color:#fff;')

    # Fix background: #ffffff in style tags if any left
    new_content = re.sub(r'background:\s*#ffffff;', 'background: var(--bg-card);', new_content)
    new_content = re.sub(r'background:\s*#fff;', 'background: var(--bg-card);', new_content)

    if new_content != content:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated text visibility and backgrounds in {fname}")
    else:
        print(f"No changes in {fname}")

