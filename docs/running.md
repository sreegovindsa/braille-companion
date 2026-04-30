# Running the System

This explains how to start and use the complete Braille AI system.

---

## Overview

You must run three components:

1. AI Engine (llama.cpp)
2. Python Server (backend)
3. Web App (frontend)

They must be started in this order.

---

## Step 1 — Start AI Engine

In Termux (Session 1):

```bash id="q2m7xp"
cd ~/llama.cpp
./build/bin/llama-server \
-m models/phi-2.Q4_K_M.gguf \
--port 8080 \
--ctx-size 512 \
-n 50 \
--temp 0.1 \
--host 0.0.0.0
```

Wait until:

```text id="z9k3dn"
llama server listening at http://0.0.0.0:8080
```

---

## Step 2 — Start Python Server

In Termux (Session 2):

```bash id="n4p8rw"
cd ~/braille_server
python server.py
```

You should see:

```text id="m7c1tl"
Running on http://0.0.0.0:5000
```

---

## Step 3 — Serve Web App

Option A — Using Python server (recommended):

```bash id="x1v6ks"
cd ~/storage/downloads
python -m http.server 8000
```

Open browser:

```text id="t3q8hz"
http://localhost:8000
```

---

## Step 4 — Using from PC (Same Wi-Fi)

Find phone IP:

```bash id="w6d9pf"
ip addr show wlan0 | grep "inet "
```

Open in PC browser:

```text id="c4n7yl"
http://YOUR_PHONE_IP:8000
```

Update `app.js` if needed:

```text id="g2v5sx"
http://YOUR_PHONE_IP:5000/ask
```

---

## System Behavior

* Simple word → instant Braille output
* Question → AI processing (5–15 seconds)
* Then → Braille spelling sequence

---

## Health Check

Open in browser:

```text id="y8k2mc"
http://localhost:5000
```

Expected:

```text id="l6p3xa"
{"status": "Braille AI server running"}
```

---

## Stop System

In each Termux session:

```bash id="u9c1zr"
Ctrl + C
```

---

## Notes

* Keep phone plugged in
* Close other apps (RAM usage ~4GB)
* Allow Termux background execution
* Restart services after phone reboot

---

## Result

* Full system running
* Web app connected to local AI
* Ready for daily use
