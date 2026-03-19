import os
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace <style></style>
style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
style_match = style_pattern.search(html)
if style_match:
    with open('src/style.css', 'w', encoding='utf-8') as f:
        f.write(style_match.group(1).strip())
    html = style_pattern.sub('<link rel="stylesheet" href="src/style.css">', html, count=1)

# Replace <script></script> without src
script_pattern = re.compile(r'<script>((?!\b|src=).+?)</script>', re.DOTALL)
script_match = script_pattern.search(html)
if script_match:
    with open('src/main.js', 'w', encoding='utf-8') as f:
        f.write(script_match.group(1).strip())
    html = script_pattern.sub('<script src="src/main.js"></script>', html, count=1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Done!')