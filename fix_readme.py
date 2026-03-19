import re
with open('README.md', 'r') as f: text = f.read()

text = re.sub(r'1\. Open.*?Firefox\)\.', '1. Start a local web server (e.g., `python -m http.server` or `npx serve`).\n2. Open the given local URL (e.g. `http://localhost:8000`) in a modern browser (Chrome, Edge, Firefox).', text)

with open('README.md', 'w') as f: f.write(text)
