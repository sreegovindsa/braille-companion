"""
Braille Instructor - Local AI Server
"""


from flask import Flask, request, jsonify
import requests
import re


app = Flask(__name__)


LLAMA_SERVER_URL = "http://localhost:8080"
FLASK_PORT       = 5000
SEARCH_ENABLED   = True


@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Braille AI server running", "model": "phi-2"})


@app.route("/ask", methods=["POST", "OPTIONS"])
def ask():
    if request.method == "OPTIONS":
        return jsonify({}), 200


    data     = request.get_json()
    question = data.get("question", "").strip()


    if not question:
        return jsonify({"answer": "", "error": "No question provided"})


    print(f"\n[QUESTION] {question}")


    needs_search   = is_realtime_question(question)
    search_context = ""


    if needs_search and SEARCH_ENABLED:
        search_context = search_duckduckgo(question)
        print(f"[SEARCH] {search_context[:100] if search_context else 'No results'}")


    answer = ask_phi2(question, search_context)
    print(f"[ANSWER] {answer}")


    return jsonify({"answer": answer})


def is_realtime_question(question):
    realtime_keywords = [
        "today", "now", "current", "latest", "recent",
        "this year", "2024", "2025", "2026",
        "price", "weather", "news", "score", "match",
        "who is the president", "who is the pm",
        "who won", "what happened"
    ]
    q = question.lower()
    return any(kw in q for kw in realtime_keywords)


def search_duckduckgo(query):
    try:
        url    = "https://api.duckduckgo.com/"
        params = {"q": query, "format": "json", "no_html": 1, "skip_disambig": 1}
        res    = requests.get(url, params=params, timeout=5)
        data   = res.json()


        if data.get("AbstractText"):
            return data["AbstractText"][:300]
        if data.get("Answer"):
            return str(data["Answer"])[:200]
        if data.get("RelatedTopics"):
            first = data["RelatedTopics"][0]
            if isinstance(first, dict) and first.get("Text"):
                return first["Text"][:200]
        return ""
    except Exception as e:
        print(f"[SEARCH ERROR] {e}")
        return ""


def ask_phi2(question, search_context=""):
    if search_context:
        user_message = f"Context: {search_context}\n\nQuestion: {question}"
    else:
        user_message = question


    prompt = f"""Below is a question. Reply with ONLY the answer - a single word or number. No sentences. No explanation.


Examples:
Q: who invented light bulb
A: Edison


Q: when did india get freedom
A: 1947


Q: what is another name of india
A: Bharat


Q: who is pm of india
A: Modi


Q: what is your name
A: Claude


Q: capital of france
A: Paris


Q: who is the father of the nation
A: Gandhi


Q: {user_message}
A:"""


    payload = {
        "prompt"     : prompt,
        "n_predict"  : 10,
        "temperature": 0.1,
        "stop"       : ["\n", "Q:", "Question:"],
        "stream"     : False
    }


    try:
        res  = requests.post(f"{LLAMA_SERVER_URL}/completion", json=payload, timeout=120)
        data = res.json()
        raw  = data.get("content", "").strip()
        return clean_answer(raw)
    except requests.exceptions.ConnectionError:
        return "ERROR: llama-server not running."
    except requests.exceptions.Timeout:
        return "ERROR: Model took too long."
    except Exception as e:
        print(f"[PHI2 ERROR] {e}")
        return ""


def clean_answer(raw):
    if not raw:
        return ""


    # First line only
    answer = raw.split("\n")[0].strip()


    # Remove known prefixes
    for p in ["Answer:", "A:", "Output:", "answer:", "Response:"]:
        if answer.lower().startswith(p.lower()):
            answer = answer[len(p):].strip()


    # Get first complete word or number
    match = re.match(r'^[\w]+', answer)
    return match.group(0) if match else ""


@app.route("/health", methods=["GET"])
def health():
    try:
        res      = requests.get(f"{LLAMA_SERVER_URL}/health", timeout=3)
        llama_ok = res.status_code == 200
    except:
        llama_ok = False


    return jsonify({
        "server"      : "running",
        "llama_server": "connected" if llama_ok else "not connected",
        "search"      : "enabled" if SEARCH_ENABLED else "disabled"
    })


if __name__ == "__main__":
    print("=" * 50)
    print("Braille AI Server starting...")
    print(f"Flask server   : http://localhost:{FLASK_PORT}")
    print(f"llama-server   : {LLAMA_SERVER_URL}")
    print(f"Internet search: {'ON' if SEARCH_ENABLED else 'OFF'}")
    print("=" * 50)
    print("Make sure llama-server is running first!")
    print("=" * 50)
    app.run(host="0.0.0.0", port=FLASK_PORT, debug=False)
