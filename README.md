# bigbrother
Auditor of public procurement documents. The program is designed for windows.

## Dependencies.
### Windows programs
1. Tesseract
2. Poppler (For pdf2image)
### Python modules
1. pytesseract
2. pdf2image
3. dotenv
4. google-genai
5. flask

## Use instruction
* Add the corresponding path for `POPPLER_PATH`. This variable can be found at `config.json`.
* Add the corresponding key for `GEMINI_API_KEY`. This enviroment variable must be added inside the `.env` file. For creating a key visit `https://ai.google.dev/gemini-api/docs`.
* Remember that for security reasons the `.env` file is not added in the repository, hence you must create your own file.
### Init
Once with all dependencies, and config instructions completed. With the python venv activated use the following command.
`llm_auditor>python src/app.py`. The app only works when initialized from the root directory. 

