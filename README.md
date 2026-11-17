<div align="center">

<h1>📄 PDF-TOOL-APP</h1>

<p><strong>A full-stack, production-ready PDF processing suite</strong><br/>
Built with <strong>FastAPI</strong> · <strong>React + Vite</strong> · <strong>PyMuPDF</strong> · <strong>PyPDF2</strong></p>

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [UI Screenshots](#-ui-screenshots)
- [Contributing](#-contributing)

---

## 🧾 About the Project

**PDF-TOOL-APP** is a comprehensive web application that provides 15+ PDF processing tools — inspired by industry leaders like iLovePDF. Users can upload PDFs, perform operations like merge, split, compress, rotate, watermark, convert, and lock/unlock — all through a clean, responsive UI backed by a robust Python API.

> 🔗 Repository: [github.com/SHIVANGIPANDEY89533/PDF-TOOL-APP](https://github.com/SHIVANGIPANDEY89533/PDF-TOOL-APP)

---

## ✨ Features

| Category | Tools |
|---|---|
| 🔀 **Organize** | Merge PDFs, Split PDFs, Re-Organize Pages |
| 🔒 **Security** | Lock PDF (Encrypt), Unlock PDF (Decrypt) |
| ✏️ **Edit** | Add Text, Add Watermark, Add Page Numbers, Rotate PDF |
| 🗜️ **Optimize** | Compress PDF, Repair PDF |
| 🔄 **Convert → PDF** | Word → PDF, Excel → PDF, PPT → PDF, Image → PDF |
| 🔄 **Convert from PDF** | PDF → Word, PDF → Excel, PDF → PPT, PDF → Image |
| 🔍 **Utilities** | Extract Text, PDF Preview |

---

## 🏛️ Architecture

### High-Level Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                   React + Vite (Port 5173)                       │
│          Tailwind CSS │ Axios │ React Router DOM                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTP / REST (FormData + JSON)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                         │
│               FastAPI Application (Port 8001)                    │
│          CORS Middleware │ File Upload │ Background Tasks         │
│                    /api/v1/* endpoints                           │
└──────────┬────────────────────────┬────────────────────────────-┘
           │                        │
           ▼                        ▼
┌──────────────────┐    ┌──────────────────────────────────────────┐
│   PDF ENGINE     │    │          PROCESSING OPERATIONS            │
│                  │    │                                           │
│  PyMuPDF (fitz)  │    │  compress_pdf()    rotate_pdf()          │
│  PyPDF2          │    │  add_watermark()   add_page_numbers()     │
│  pdf2docx        │    │  add_text_to_pdf() repair_pdf()          │
│  reportlab       │    │  convert_pdf_to_images()                 │
│  Pillow          │    │  convert_images_to_pdf()                 │
│  openpyxl        │    │  convert_excel_to_pdf()                  │
└──────────────────┘    └──────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                               │
│                                                                  │
│   📁 Temp File Storage          🗄️ PostgreSQL (optional)         │
│   ├── uploads/                  │   - Job metadata               │
│   ├── merged_pdfs/              │   - User sessions              │
│   ├── split_pdfs/               │   - Processing history         │
│   ├── pdf_to_word/              └────────────────────            │
│   ├── word_to_pdf/                                               │
│   └── locked_pdfs/             ☁️  Cloud Storage (optional)      │
│                                 │   - AWS S3 (boto3)             │
│   ⏱️ Auto-deleted after 10 min  │   - Persistent file hosting    │
└─────────────────────────────────────────────────────────────────┘
```

### Request Lifecycle

```
User Uploads PDF
      │
      ▼
React Component (e.g., MergeInterface.jsx)
      │  axios.post('/api/v1/mergePDF', formData)
      ▼
FastAPI Router → /api/v1/mergePDF
      │
      ├── Validate files (size, type)
      ├── Save to temp directory (uuid-named)
      ├── Run PDF Engine Operation (PyPDF2 / PyMuPDF)
      ├── Write output file
      ├── Schedule background deletion (10 min)
      └── Return FileResponse (direct download blob)
            │
            ▼
      Browser auto-downloads processed PDF
```

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | UI framework with hooks |
| **Vite 5** | Fast dev server & bundler |
| **Tailwind CSS 3** | Utility-first styling |
| **Axios** | HTTP client for API calls |
| **React Router DOM** | Client-side routing |

### Backend

| Technology | Purpose |
|---|---|
| **FastAPI** | Async Python web framework |
| **Uvicorn** | ASGI server |
| **PyMuPDF (fitz)** | PDF rendering, text extraction, preview |
| **PyPDF2** | PDF merge, split, encrypt, decrypt |
| **pdf2docx** | PDF → Word conversion |
| **reportlab** | PDF generation, canvas drawing |
| **python-docx** | Word document processing |
| **openpyxl** | Excel file handling |
| **Pillow** | Image processing |
| **boto3** | AWS S3 cloud storage integration |
| **psycopg2 / SQLAlchemy** | PostgreSQL database ORM |
| **python-dotenv** | Environment variable management |

---

## 📡 API Endpoints

**Base URL:** `http://127.0.0.1:8001/api/v1`

> All file upload endpoints accept `multipart/form-data`. Processed files are returned as direct binary downloads and auto-deleted from the server after 10 minutes.

### 🔀 Organize

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/mergePDF` | Merge 2–4 PDF files into one | `files[]` (PDF array) | `application/pdf` |
| `POST` | `/splitPDF` | Split PDF into individual page files | `file` (PDF) | `application/zip` |
| `POST` | `/split-pdf-ranges` | Split PDF by custom page ranges | `file` (PDF), `ranges` (JSON) | `application/zip` |
| `POST` | `/reorganize-pdfs-download` | Reorder pages across multiple PDFs | `files[]`, `order` (JSON) | `application/pdf` |

### 🔒 Security

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/lock-pdf` | Encrypt PDF with a password | `file` (PDF), `password` (str) | `application/pdf` |
| `POST` | `/unlock-pdf` | Remove password from encrypted PDF | `file` (PDF), `password` (str) | `application/pdf` |

### ✏️ Edit

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/edit/add-text` | Overlay custom text on PDF pages | `file`, `text`, `font_size`, `x_pos`, `y_pos` | `application/pdf` |
| `POST` | `/edit/watermark` | Add diagonal watermark text | `file`, `text`, `font_size`, `color` | `application/pdf` |
| `POST` | `/edit/page-numbers` | Add page numbers to footer/header | `file`, `position`, `start_number`, `font_size`, `color` | `application/pdf` |
| `POST` | `/edit/rotate` | Rotate pages by 90/180/270 degrees | `file`, `rotation`, `pages` | `application/pdf` |

### 🗜️ Optimize

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/compress/pdf` | Reduce PDF file size | `file` (PDF) | `application/pdf` |
| `POST` | `/repair/pdf` | Fix corrupted or malformed PDFs | `file` (PDF) | `application/pdf` |

### 🔄 Convert → PDF

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/convert/word-to-pdf-download` | Convert `.docx` to PDF | `file` (.docx) | `application/pdf` |
| `POST` | `/convert/excel-to-pdf` | Convert `.xlsx` to PDF | `file` (.xlsx) | `application/pdf` |
| `POST` | `/convert/pptx-to-pdf` | Convert `.pptx` to PDF | `file` (.pptx) | `application/pdf` |
| `POST` | `/convert/image-to-pdf` | Convert images to PDF | `files[]` (images) | `application/pdf` |

### 🔄 Convert from PDF

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/convert/pdf-to-word-download` | Convert PDF to `.docx` | `file` (PDF) | `.docx` |
| `POST` | `/convert/pdf-to-excel` | Convert PDF to `.xlsx` | `file` (PDF) | `.xlsx` |
| `POST` | `/convert/pdf-to-pptx` | Convert PDF to `.pptx` | `file` (PDF) | `.pptx` |
| `POST` | `/convert/pdf-to-image` | Convert PDF pages to images (ZIP) | `file` (PDF) | `application/zip` |

### 🔍 Utilities

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/upload-pdf-preview` | Generate thumbnail previews of pages | `file` (PDF) | JSON `{fileId, pages[]}` |
| `POST` | `/extract-text` | Extract all text content from PDF | `file` (PDF) | JSON `{pages[]}` |
| `GET` | `/download/{filename}` | Download a previously processed file | URL param `filename` | File |
| `GET` | `/welcome` | Health check endpoint | — | JSON `{message}` |

---

## 📁 Project Structure

```
PDF-TOOL-APP/
│
├── pdf-tools-backend/              # 🐍 FastAPI Backend
│   ├── main.py                     # App entry point, CORS, router registration
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Environment variables
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── jobs.py         # All API route handlers (20+ endpoints)
│   │   │
│   │   ├── processing/
│   │   │   └── operations.py       # Core PDF processing functions
│   │   │
│   │   ├── core/                   # App config & settings
│   │   ├── database/               # DB models & connection (PostgreSQL)
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   └── integrations/           # AWS S3, cloud storage
│   │
│   ├── uploads/                    # Temp uploaded files (auto-cleaned)
│   ├── merged_pdfs/                # Temp merged outputs
│   ├── split_pdfs/                 # Temp split outputs
│   ├── pdf_to_word/                # Temp conversion outputs
│   ├── word_to_pdf/                # Temp conversion outputs
│   └── locked_pdfs/                # Temp locked/unlocked outputs
│
└── pdf-tools-frontend/             # ⚛️ React + Vite Frontend
    └── PDF-Tools/
        ├── package.json
        ├── vite.config.js
        ├── .env                    # VITE_BASE_URL config
        │
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── pages/              # 30+ page components
            │   ├── MergeInterface.jsx
            │   ├── splitInterface.jsx
            │   ├── lockingInterface.jsx
            │   ├── Unlockinginterface.jsx
            │   ├── CompressPDF.jsx
            │   ├── RotatePDFInterface.jsx
            │   ├── WatermarkInterface.jsx
            │   ├── PageNumbersInterface.jsx
            │   ├── RepairPDFInterface.jsx
            │   ├── WordToPDF1.jsx
            │   ├── ImageToPDFInterface.jsx
            │   ├── PdfToImageInterface.jsx
            │   ├── EditPDFPage.jsx
            │   └── ...more
            ├── component/          # Shared UI components
            └── routes/             # React Router configuration
```

---

## 🚀 Local Setup

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**
- **Git**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/SHIVANGIPANDEY89533/PDF-TOOL-APP.git
cd PDF-TOOL-APP
```

---

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd pdf-tools-backend

# Create and activate a virtual environment
python -m venv env

# On Windows:
env\Scripts\activate

# On macOS/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Backend Environment

Create or edit `.env` in `pdf-tools-backend/`:

```env
# Backend Server
PORT=8001

# Database (optional — for metadata/history features)
DATABASE_URL=postgresql://user:password@localhost:5432/pdftools

# AWS S3 (optional — for cloud storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=us-east-1
```

#### Start the Backend Server

```bash
# From pdf-tools-backend/ directory
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

✅ Backend is now running at: `http://127.0.0.1:8001`  
📖 Swagger API Docs: `http://127.0.0.1:8001/docs`  
📖 ReDoc: `http://127.0.0.1:8001/redoc`

---

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend (open a new terminal)
cd pdf-tools-frontend/PDF-Tools

# Install dependencies
npm install
```

#### Configure Frontend Environment

Create or edit `.env` in `pdf-tools-frontend/PDF-Tools/`:

```env
VITE_BASE_URL=http://127.0.0.1:8001/api/v1
```

#### Start the Frontend Dev Server

```bash
npm run dev
```

✅ Frontend is now running at: `http://localhost:5173`

---

### 4️⃣ Verify Everything Works

| Service | URL | Status Check |
|---------|-----|--------------|
| Backend API | `http://127.0.0.1:8001` | Should return `{"message": "PDF Tools API running!"}` |
| Swagger Docs | `http://127.0.0.1:8001/docs` | Interactive API explorer |
| Frontend App | `http://localhost:5173` | Full PDF tool suite UI |

---

## 🔐 Environment Variables

### Backend (`pdf-tools-backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Optional | — | PostgreSQL connection string |
| `AWS_ACCESS_KEY_ID` | Optional | — | AWS S3 access key |
| `AWS_SECRET_ACCESS_KEY` | Optional | — | AWS S3 secret key |
| `AWS_BUCKET_NAME` | Optional | — | S3 bucket for file storage |
| `AWS_REGION` | Optional | `us-east-1` | AWS region |

### Frontend (`pdf-tools-frontend/PDF-Tools/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_BASE_URL` | ✅ Yes | `http://127.0.0.1:8001/api/v1` | Backend API base URL |

---

## 🖼️ UI Screenshots

> The app features a clean, light-blue themed interface with responsive design across all PDF tools.

### 🔀 Merge PDF — Interface
> Upload two or more PDFs side by side. Added files appear in the right panel list. Click **Merge** to combine and auto-download.

![Merge PDF UI](screenshots/merge-ui.png)

---

### ⚠️ Merge PDF — Network Error (Fixed)
> Error shown when backend is not running. Make sure FastAPI server is started on port `8001` before using the app.

![Merge Error](screenshots/merge-error.png)

---

### 🏠 App Logo
![PDF Tool Logo](screenshots/logo.png)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please ensure your code follows the existing style and that all endpoints are tested.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [SHIVANGI PANDEY](https://github.com/SHIVANGIPANDEY89533)**

⭐ Star this repo if you find it useful!

</div>
