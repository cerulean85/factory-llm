import os
import re
import pandas as pd

md_file = r"c:\workspace\titan_was\docs\DB_SCHEMA.md"
excel_file = r"c:\workspace\titan_was\docs\DB_SCHEMA.xlsx"

with open(md_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Skip things before the first "## "
parts = re.split(r'\n## ', '\n' + content)
if len(parts) > 1:
    sections = parts[1:]
else:
    sections = [content]

with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
    for section in sections:
        lines = section.strip().split('\n')
        if not lines:
            continue
        
        title = lines[0].strip()
        # Clean title for sheet name (remove invalid characters)
        sheet_name = re.sub(r'[\\/*?:\[\]]', '', title).strip()[:31]
        
        # Find all lines that look like table rows
        table_lines = [line.strip() for line in lines if line.strip().startswith('|') and line.strip().endswith('|')]
        
        if table_lines:
            # Drop the separator row like |---|---|
            if len(table_lines) > 1 and re.match(r'^\|[\s\-\|]+\|$', table_lines[1]):
                header_row = table_lines[0]
                data_rows = table_lines[2:]
            else:
                header_row = table_lines[0]
                data_rows = table_lines[1:]
                
            def split_row(r):
                # Remove leading and trailing '|' and split by '|', then strip spaces
                return [col.strip() for col in r.strip('|').split('|')]
                
            columns = split_row(header_row)
            data = [split_row(row) for row in data_rows]
            
            # Ensure all rows have the same number of columns as the header
            valid_data = []
            for row in data:
                if len(row) < len(columns):
                    row.extend([''] * (len(columns) - len(row)))
                elif len(row) > len(columns):
                    row = row[:len(columns)]
                valid_data.append(row)
            
            df = pd.DataFrame(valid_data, columns=columns)
            df.to_excel(writer, sheet_name=sheet_name, index=False)

print(f"Successfully created {excel_file}")
