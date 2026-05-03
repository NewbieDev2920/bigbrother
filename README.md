# Dania — Auditor of Public Procurement Documents

Dania is a tool for detecting corruption signals in Colombian public procurement contracts using a 5-layer AI model.

The project has two parts:
- **`/` (root)** — Python backend: document processing, OCR, and LLM analysis.
- **`/dania`** — React frontend: web interface for visualizing analysis results and dashboards.

---

## Python Backend

The backend processes PDF contracts, extracts text via OCR, and runs them through a Gemini LLM for analysis.

### System dependencies (Windows)
1. [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki)
2. [Poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases/) (required by pdf2image)

### Python modules
```
pytesseract
pdf2image
python-dotenv
google-genai
flask
```
Install with:
```bash
pip install -r requirements.txt
```

### Configuration
1. Open `config.json` and set `POPPLER_PATH` to your local Poppler `bin/` folder.
2. Create a `.env` file in the root with:
   ```
   GEMINI_API_KEY=your_key_here
   ```
   Get a free key at https://ai.google.dev/gemini-api/docs

### Running the backend
With the Python virtual environment activated, run from the **root directory**:
```bash
python src/app.py
```

---

## React Frontend (`/dania`)

The frontend is a single-page application built with React 18, TypeScript, Vite, and Tailwind CSS. It displays project risk analysis, interactive dashboards, a PDF viewer, and an AI chat interface.

### Requirements
- [Node.js 18+](https://nodejs.org/)

### Setup
```bash
cd dania
npm install
```

### Environment variables
Copy the example file and fill in the values:
```bash
cp .env.example .env.local
```

`.env.local` contents:
```
# Set to false to connect to the real Python backend instead of mock data
VITE_USE_MOCK_AI=true

# URL of the Python backend (only needed when VITE_USE_MOCK_AI=false)
VITE_API_URL=http://localhost:5000

# Optional: API key sent in X-Dania-Key header to the backend
VITE_DANIA_KEY=
```

### Running the frontend (development)
```bash
cd dania
npm run dev
```
Then open http://localhost:5173 in your browser.

### Building for production
```bash
cd dania
npm run build
```
Output goes to `dania/dist/`. Serve it with any static file server or deploy to Vercel/Netlify.

### Connecting frontend to backend
1. Start the Python backend: `python src/app.py` (runs on port 5000 by default)
2. In `dania/.env.local`, set:
   ```
   VITE_USE_MOCK_AI=false
   VITE_API_URL=http://localhost:5000
   ```
3. Run `npm run dev` — the frontend will call the real backend instead of mock data.

---

## Project structure

```
bigbrother/
├── src/                        # Python backend
│   ├── application/            # Business logic & ports
│   ├── domain/                 # Domain models
│   └── infrastructure/         # Adapters (Gemini, SQLite, OCR, Flask server)
├── main.py
├── config.json
├── requirements.txt
│
└── dania/                      # React frontend
    ├── src/
    │   ├── routes/             # Page components (Home, Project, Dashboard, History)
    │   ├── components/         # Reusable UI components & charts
    │   ├── services/ai/        # AI adapter (mock + real)
    │   ├── store/              # Zustand state stores
    │   ├── types/              # TypeScript type definitions
    │   └── data/               # Mock data for development
    ├── public/
    ├── package.json
    └── vite.config.ts
```
