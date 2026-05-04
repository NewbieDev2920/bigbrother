from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from src.domain.models import ChatRequest

def create_app(audit_chat_service, dania_service, target_pdf_path: str):
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Pointing to the Vanilla JS frontend
    dist_dir = os.path.abspath(os.path.join(current_dir, '..', '..', '..', 'dania', 'vanilla'))
    
    if not os.path.exists(dist_dir):
        os.makedirs(dist_dir, exist_ok=True)

    app = Flask(__name__, 
                static_folder=dist_dir, 
                static_url_path='/')
    CORS(app)
    
    @app.route("/")
    def index():
        return send_from_directory(dist_dir, "index.html")

    # Serve other assets if needed (though static_url_path='/' handles most)
    @app.route('/<path:path>')
    def serve_static(path):
        if path != "" and os.path.exists(os.path.join(dist_dir, path)):
            return send_from_directory(dist_dir, path)
        else:
            return send_from_directory(dist_dir, 'index.html')

    @app.route("/pdf")
    def get_pdf():
        directory = os.path.dirname(target_pdf_path)
        filename = os.path.basename(target_pdf_path)
        return send_from_directory(directory, filename, mimetype='application/pdf')

    @app.route("/chat", methods=["POST"])
    def chat():
        # Support both form-data (for files) and JSON
        session_id = request.form.get("session_id") or request.json.get("session_id") if request.is_json else request.form.get("session_id")
        user_message = request.form.get("message") or (request.json.get("message") if request.is_json else None)
        uploaded_file = request.files.get("file")
        
        if not user_message and not uploaded_file:
            return jsonify({"error": "No message or file provided"}), 400
            
        file_path = None
        if uploaded_file and uploaded_file.filename != '':
            uploaded_file.save(target_pdf_path)
            file_path = target_pdf_path

        chat_request = ChatRequest(message=user_message, file_path=file_path, session_id=session_id)

        try:
            response = audit_chat_service.process_chat(chat_request)
            return jsonify(response.model_dump())
        except Exception as e:
            import traceback
            traceback.print_exc()
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                return jsonify({"error": "Límite de cuota excedido en la IA (Gemini). Por favor, espera un minuto o verifica tu API Key."}), 429
            return jsonify({"error": f"Error en la auditoría: {error_msg}"}), 500

    @app.route("/dania/score/<nit>", methods=["GET"])
    def get_score(nit):
        try:
            result = dania_service.score(nit)
            return jsonify(result)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route("/dania/batch-score", methods=["POST"])
    def batch_score():
        data = request.json
        nits = data.get("nits", [])
        results = []
        for nit in nits:
            try:
                results.append(dania_service.score(nit))
            except:
                results.append({"nit": nit, "error": "Failed to score"})
        return jsonify(results)

    return app
