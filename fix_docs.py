with open('app/services/documents.py', 'r') as f:
    text = f.read()

text = text.replace('    # --------------------------------------------------------\n    # Hugging Face\n    # --------------------------------------------------------\n', '    return " ".join(parts)\n\n\ndef evidence_tokens(candidate) -> list[str]:\n    import re\n    text = evidence_text(candidate)\n    return [t.lower() for t in re.split(r"\\\\W+", text) if t]\n')

with open('app/services/documents.py', 'w') as f:
    f.write(text)
