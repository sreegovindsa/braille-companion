# Python Server Setup Guide

This step sets up the backend server that connects your web app to the local AI model.

---

## 1. Create Server Directory

```bash id="u3k2zp"
mkdir -p ~/braille_server
cd ~/braille_server
```

---

## 2. Add `server.py`

Place your `server.py` file inside this folder.

Options:

### Option A — Copy from Downloads

```bash id="y6m1qv"
cp ~/storage/downloads/server.py ~/braille_server/
```

### Option B — Create manually

```bash id="k1p9wt"
cat > server.py
```

Paste the full server code, then press:

```
Ctrl + D
```

---

## 3. Install Dependencies

```bash id="r2c8nm"
pip install flask requests
```

If CORS errors occur:

```bash id="b7n4zx"
pip install flask-cors
```

---

## 4. Start AI Engine (Required First)

In another Termux session:

```bash id="p9d2la"
cd ~/llama.cpp
./build/bin/llama-server \
-m models/phi-2.Q4_K_M.gguf \
--port 8080 \
--ctx-size 512 \
-n 50 \
--temp 0.1
```

Wait until:

```text id="c5k8dw"
llama server listening at http://0.0.0.0:8080
```

---

## 5. Start Python Server

```bash id="h4v7xz"
cd ~/braille_server
python server.py
```

You should see:

```text id="v2r9mf"
Running on http://0.0.0.0:5000
```

---

## 6. Test Server

In another session:

```bash id="n8q3lx"
curl http://localhost:5000/ask \
-X POST \
-H "Content-Type: application/json" \
-d '{"question": "when did india get freedom"}'
```

Expected:

```text id="f6k1bp"
{"answer": "1947"}
```

---

## 7. Common Issues

**Module not found**

```bash id="q7x1cs"
pip install flask requests
```

**Port already in use**

```bash id="d9m3wr"
pkill -f "python server.py"
```

**Connection refused**

* Ensure `llama-server` is running first

**Empty response**

* Wait 20–30 seconds after starting AI engine

---

## Result

* Python server running on port 5000
* Connected to local AI model
* Ready to receive requests from web app
