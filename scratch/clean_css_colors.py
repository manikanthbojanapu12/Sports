import re

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace rgba(204, 255, 0, x) and rgba(173, 209, 0, x) with cyan or blue rgba
content = re.sub(r'rgba\(204,\s*255,\s*0,\s*([0-9\.]+)\)', r'rgba(0, 240, 255, \1)', content)
content = re.sub(r'rgba\(173,\s*209,\s*0,\s*([0-9\.]+)\)', r'rgba(0, 240, 255, \1)', content)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleaned up style.css color codes.")

