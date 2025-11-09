#!/usr/bin/env python3
"""Fix encoding issues in CSV files - replace � with proper characters"""

import sys

def fix_encoding(filepath):
    """Read CSV and fix encoding issues"""
    
    # Try different encodings
    content = None
    for encoding in ['utf-8', 'windows-1252', 'latin-1', 'iso-8859-1']:
        try:
            with open(filepath, 'r', encoding=encoding) as f:
                content = f.read()
            print(f"  Successfully read with {encoding} encoding")
            break
        except UnicodeDecodeError:
            continue
    
    if content is None:
        raise Exception("Could not decode file with any known encoding")
    
    # Replace problematic characters from Windows-1252 encoding
    replacements = {
        '\x92': "'",  # Right single quotation mark (Windows-1252)
        '\x93': '"',  # Left double quotation mark
        '\x94': '"',  # Right double quotation mark
        '\x91': "'",  # Left single quotation mark
        '\x96': '—',  # Em dash
        '\x97': '—',  # Em dash (alternate)
        '\x85': '...',  # Ellipsis
        '�': "'",  # Replacement character
        '"': '"',  # Curly quotes
        '"': '"',
        ''': "'",  # Curly apostrophes
        ''': "'",
        '–': '-',  # En dash
        '—': '-',  # Em dash
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # Write back as UTF-8
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Fixed encoding in {filepath}")

if __name__ == '__main__':
    files = [
        'public/data/categoriesandactionainav.csv',
        'data/csv-imports/categoriesandactionainav.csv'
    ]
    
    for filepath in files:
        try:
            fix_encoding(filepath)
        except FileNotFoundError:
            print(f"✗ File not found: {filepath}")
        except Exception as e:
            print(f"✗ Error fixing {filepath}: {e}")

