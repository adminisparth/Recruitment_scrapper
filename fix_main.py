with open('app/main.py', 'r') as f:
    text = f.read()

import re
text = re.sub(r' +try:\s+except Exception as e:\s+logger\.error\("Error while closing Hugging Face client\."\)\s+logger\.exception\(e\)', '', text)

with open('app/main.py', 'w') as f:
    f.write(text)
