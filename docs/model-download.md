# Model Download Guide (Phi-2)

This step downloads the AI model used for local inference.

---

## 1. Navigate to Models Folder

```bash id="y7q2pz"
cd ~/llama.cpp/models
```

---

## 2. Download Phi-2 Model

```bash id="z8w3rn"
wget -O phi-2.Q4_K_M.gguf \
"https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf"
```

Details:

* Size: ~1.6 GB
* Download time: 10–20 minutes (Wi-Fi recommended)

---

## 3. Verify Download

```bash id="k4z9lm"
ls -lh phi-2.Q4_K_M.gguf
```

Expected output:

```text id="9k3plx"
~1.6G file size
```

If file size is too small → download failed.

---

## 4. Test Model

```bash id="m8r2tj"
cd ~/llama.cpp
./build/bin/llama-cli \
-m models/phi-2.Q4_K_M.gguf \
-p "What year did India gain independence? Answer in one word:" \
-n 10 \
--temp 0
```

Expected output:

```text id="8f7lq1"
1947
```

---

## 5. Resume Download (if interrupted)

```bash id="t3k9zb"
wget -c -O phi-2.Q4_K_M.gguf \
"https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf"
```

---

## 6. Alternative Model (Smaller)

If storage or speed is limited:

```bash id="s9l2wd"
wget -O tinyllama.Q4_K_M.gguf \
"https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"
```

Note:

* Faster
* Less accurate

---

## Result

* Model file downloaded
* Verified working
* Ready for server integration
