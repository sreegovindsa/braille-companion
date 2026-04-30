# AI-Powered Braille Companion

An assistive system that converts text, speech, and AI responses into physical Braille output using an Arduino-based device and a local AI backend.

---

## Features

* Manual Braille input and output
* Alphabet and digit learning interface
* AI-powered question answering
* Voice input support
* Physical Braille output via Arduino
* Fully offline AI using local model

---

## System Architecture

* **Frontend**: HTML, CSS, JavaScript
* **Hardware**: Arduino (servo-based Braille output)
* **Backend**: Python (Flask server)
* **AI Engine**: llama.cpp running Phi-2 model

---

## How It Works

1. User inputs text or speaks
2. App determines:

   * direct spelling OR
   * AI query
3. Python server processes request
4. Local AI model generates short response
5. Output is converted to Braille
6. Arduino renders physical dots

---

## Project Structure

```text id="r6q9vd"
.
├── index.html
├── style.css
├── app.js
├── braille_companion/
│   └── braille_companion.ino
├── braille_server/
│   └── server.py
├── docs/
│   ├── termux-setup.md
│   ├── llama-setup.md
│   ├── model-download.md
│   ├── python-server.md
│   └── running.md
```

---

## Setup

Follow the documentation in the `docs/` folder:

1. Termux setup
2. llama.cpp installation
3. Model download
4. Python server setup
5. Running the system

---

## Notes

* Model files are not included due to size
* Runs entirely offline after setup
* Requires ~4GB RAM for full system

---

## License

For academic and educational use.
