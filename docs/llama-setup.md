# llama.cpp Setup Guide

This step installs the AI engine used to run the language model locally on your device.

---

## 1. Clone Repository

```bash
cd ~
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
```

---

## 2. Build the Project

Compile the source code:

```bash
cmake -B build
cmake --build build --config Release -j4
```

Notes:

* This step takes 20–40 minutes depending on device
* Keep phone charging and screen active

---

## 3. Verify Installation

```bash
ls build/bin/
```

You should see:

```text
llama-server
```

Test:

```bash
./build/bin/llama-server --help | head -20
```

---

## 4. Create Model Directory

```bash
mkdir -p ~/llama.cpp/models
```

---

## 5. Common Issues

**cmake not found**

```bash
pkg install cmake
```

**Compilation fails**

```bash
pkg reinstall clang
pkg install binutils
```

**Device overheating**

```bash
cmake --build build --config Release -j1
```

**No space left**

* Free at least ~500MB storage

---

## Result

* llama.cpp compiled successfully
* `llama-server` executable available
* ready to load model in next step
