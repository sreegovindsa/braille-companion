# Termux Setup Guide

This guide explains how to set up a Linux environment on Android using Termux. This environment is used to run the Python backend and AI engine.

---

## 1. Install Termux

Do **not** install Termux from the Play Store (it is outdated).

Install from F-Droid:

https://f-droid.org/packages/com.termux/

Steps:

1. Download the APK from the link above
2. Enable "Install unknown apps" if prompted
3. Install and open Termux

---

## 2. Initial Setup

Run the following commands one by one:

```bash
pkg update -y
pkg upgrade -y
pkg install -y git wget curl cmake make clang python
```

Verify Python:

```bash
python --version
```

Install required Python packages:

```bash
pip install flask requests
```

---

## 3. Enable Storage Access

```bash
termux-setup-storage
```

Grant permission when prompted.

This allows access to the Downloads folder for transferring files.

---

## 4. Prevent Termux from Stopping

Android may kill background apps.

Do the following:

* Go to **Settings → Battery → Termux**
* Set to **Unrestricted / No restrictions**
* Disable battery optimization for Termux

In Termux, run:

```bash
termux-wake-lock
```

---

## 5. Using Multiple Sessions

You will need multiple terminals:

* Session 1 → AI engine (llama.cpp)
* Session 2 → Python server

To open a new session:

* Swipe from left → tap "New Session"

To switch:

* Swipe from left → select session

---

## 6. Common Issues

**Command not found**

```bash
pkg install <package-name>
```

**Update stuck**

```bash
pkg update --fix-missing
```

**Python not found**

```bash
pkg install python
```

**pip not found**

```bash
pkg install python-pip
```

---

## Result

After completing this setup:

* Linux environment is ready
* Python is installed
* Required tools are available

Proceed to the next step: installing the AI engine.
