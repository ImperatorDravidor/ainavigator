# Data Directory

This directory contains all data files, source documents, and data science notebooks for the AI Navigator platform.

## 📁 Structure

```
data/
├── csv-imports/          # CSV files for database import
├── source-documents/     # Source PDFs and extracted content
├── notebooks/            # Jupyter notebooks for data analysis
└── README.md            # This file
```

## 📊 CSV Imports (`csv-imports/`)

Contains CSV files ready for import into Supabase database.

**Files**:
- `capability_demo_wide.csv` - Demo capability assessment data (wide format)
- `capability_real_wide.csv` - Real capability assessment data (wide format)
- `capability_deduped.csv` - Deduplicated capability data
- `categoriesandactionainav.csv` - Categories and actions metadata

**Documentation**:
- `csv_schema_definition.md` - CSV column definitions and data structure
- `data_model.md` - Data model explanation
- `DATA_TRANSFORMATION_GUIDE.md` - Guide for transforming and importing data
- `README.md` - CSV import instructions

**How to Import**:
```bash
# Import demo data
npm run import-demo-data

# Import capability data (Python)
python3 scripts/import_capability_wide.py
```

## 📄 Source Documents (`source-documents/`)

Original source materials and extracted content.

**Files**:
- PDF files - Original source documents
- `taboos_extracted.json` - Extracted taboo topics in JSON format
- `extracted_taboos_onepagers.md` - Markdown extraction of taboo content

## 📓 Notebooks (`notebooks/`)

Jupyter notebooks for data science analysis and synthetic data generation.

**Files**:
- `synthetic_benchmark/` - Synthetic benchmark data generation

## 🔄 Data Flow

1. **Source Documents** → Raw materials (PDFs, extracts)
2. **Processing** → Transform into CSV format
3. **CSV Imports** → Structured data ready for database
4. **Database** → Import via scripts to Supabase
5. **Application** → Query and display in platform

## 📝 Notes

- All CSV files should follow the schema defined in `csv-imports/csv_schema_definition.md`
- Do not commit sensitive or client-specific data
- Use `.gitignore` to exclude confidential files
- Keep demo/sample data for testing and development

## 🔗 Related

- **Import Scripts**: `/scripts/` - Python and TypeScript import utilities
- **Database Schema**: `/supabase/migrations/` - Database structure
- **Documentation**: `/docs/` - Platform documentation
