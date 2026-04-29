document.addEventListener("DOMContentLoaded", () => {


const GEMINI_API_KEY = "YOUR_KEY_HERE";


window.go = function(page){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page).classList.add('active');
};

let port, writer;

window.connectArduino = async function(){
  try{
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    writer = port.writable.getWriter();
    alert("Connected");
  }catch(e){
    console.error(e);
    alert("Connection failed");
  }
};

window.disconnectArduino = async function(){
  try{
    if(writer){ await writer.releaseLock(); writer = null; }
    if(port)  { await port.close();         port   = null; }
    alert("Disconnected");
  }catch(e){ console.error(e); }
};


let state = [0,0,0,0,0,0];


const dotContainer = document.getElementById('dots');
for(let i = 0; i < 6; i++){
  let d = document.createElement('div');
  d.className = 'dot';
  d.onclick = () => {
    unlockSpeech();
    state[i] = state[i] ? 0 : 1;
    d.classList.toggle('active');
  };
  dotContainer.appendChild(d);
}

window.resetDots = function(){
  state = [0,0,0,0,0,0];
  document.querySelectorAll('#dots .dot').forEach(d => d.classList.remove('active'));
};


window.sendToArduino = async function(bits = null){
  if(!writer){ alert("Connect first"); return; }
  let data = bits ? bits : state.join("");
  try{
    await writer.write(new TextEncoder().encode(data + "\n"));
  }catch(e){ console.error(e); }
};


let unlocked = false;

function unlockSpeech(){
  if(!unlocked){
    unlocked = true;
    speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  }
}

function speak(text){
  if(!unlocked) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  let voices = speechSynthesis.getVoices();
  if(voices.length > 0) u.voice = voices[0];
  u.rate = 0.9;
  speechSynthesis.speak(u);
}


const braille = {
  a:"100000", b:"110000", c:"100100", d:"100110", e:"100010",
  f:"110100", g:"110110", h:"110010", i:"010100", j:"010110",
  k:"101000", l:"111000", m:"101100", n:"101110", o:"101010",
  p:"111100", q:"111110", r:"111010", s:"011100", t:"011110",
  u:"101001", v:"111001", w:"010111", x:"101101", y:"101111", z:"101011",
  "0":"010110", "1":"100000", "2":"110000", "3":"100100", "4":"100110",
  "5":"100010", "6":"110100", "7":"110110", "8":"110010", "9":"010100"
};


const alphaDiv = document.getElementById('alphaList');
Object.keys(braille).filter(k => isNaN(k)).forEach(k => {
  let btn = document.createElement('button');
  btn.className = 'small-btn';
  btn.innerText = k.toUpperCase();
  btn.onclick      = () => { unlockSpeech(); speak(k); sendToArduino(braille[k]); };
  btn.onmouseenter = () => speak(k);
  alphaDiv.appendChild(btn);
});


const digitDiv = document.getElementById('digitList');
Object.keys(braille).filter(k => !isNaN(k)).forEach(k => {
  let btn = document.createElement('button');
  btn.className = 'small-btn';
  btn.innerText = k;
  btn.onclick      = () => { unlockSpeech(); speak(k); sendToArduino(braille[k]); };
  btn.onmouseenter = () => speak(k);
  digitDiv.appendChild(btn);
});


const aiDotContainer = document.getElementById('aiDots');
for(let i = 0; i < 6; i++){
  let d = document.createElement('div');
  d.className = 'dot';
  aiDotContainer.appendChild(d);
}

function setAIDots(bits){
  document.querySelectorAll('#aiDots .dot').forEach((d, i) => {
    d.classList.toggle('active', bits[i] === '1');
  });
}

function resetAIDots(){
  document.querySelectorAll('#aiDots .dot').forEach(d => d.classList.remove('active'));
}

let aiRunning  = false;
let aiStopFlag = false;

window.stopAISpell = function(){ aiStopFlag = true; };

async function spellOut(raw){
  const chars = raw.toLowerCase().split('').filter(c => braille[c]);

  const status  = document.getElementById('aiStatus');
  const queue   = document.getElementById('aiLetterQueue');
  const prog    = document.getElementById('aiProgress');
  const current = document.getElementById('aiCurrentLetter');
  const stopBtn = document.getElementById('aiStopBtn');

  if(!chars.length){
    status.textContent = "No braille-able characters found.";
    return;
  }

  aiRunning  = true;
  aiStopFlag = false;
  document.getElementById('aiBtn').disabled    = true;
  document.getElementById('voiceBtn').disabled = true;
  stopBtn.style.display = 'block';
  prog.style.width      = '0%';
  current.textContent   = '';

  queue.innerHTML = '';
  chars.forEach((c, i) => {
    const badge = document.createElement('span');
    badge.id          = 'aibadge' + i;
    badge.textContent = c.toUpperCase();
    badge.style.cssText = badgeStyle('idle');
    queue.appendChild(badge);
  });

  const word = chars.join('').toUpperCase();
  status.textContent = `Spelling "${word}" — one character every 10 seconds…`;
  unlockSpeech();

  for(let i = 0; i < chars.length; i++){
    if(aiStopFlag) break;

    const c    = chars[i];
    const bits = braille[c];

    if(i > 0) setBadgeStyle(i - 1, 'done');
    setBadgeStyle(i, 'active');

    setAIDots(bits);
    current.textContent = c.toUpperCase();
    speak(c);
    if(writer) await sendToArduino(bits);

    prog.style.width = ((i + 1) / chars.length * 100) + '%';

    if(i < chars.length - 1){
      for(let t = 10; t > 0; t--){
        if(aiStopFlag) break;
        status.textContent = `"${c.toUpperCase()}" (${i+1}/${chars.length}) — next in ${t}s`;
        await sleep(1000);
      }
    }
  }

  if(!aiStopFlag){
    setBadgeStyle(chars.length - 1, 'done');
    status.textContent = `Done! Spelled "${word}".`;
    speak("Done");
  } else {
    status.textContent = "Stopped.";
  }

  await sleep(1500);
  resetAIDots();
  current.textContent = '';
  prog.style.width    = '0%';

  aiRunning = aiStopFlag = false;
  document.getElementById('aiBtn').disabled    = false;
  document.getElementById('voiceBtn').disabled = false;
  stopBtn.style.display = 'none';
}


window.handleAISpell = async function(){
  if(aiRunning) return;
  const input = document.getElementById('aiWordInput').value.trim();
  if(!input) return;
  processInput(input);
};

document.getElementById('aiWordInput').addEventListener('keydown', e => {
  if(e.key === 'Enter') handleAISpell();
});

async function processInput(input){
  const questionWords = /^(what|when|where|who|why|how|which|is|are|was|were|did|do|does|can|could|tell)/i;
  const isQuestion = input.trim().endsWith('?')
    || questionWords.test(input.trim())
    || input.trim().split(/\s+/).length > 3;

  if(isQuestion){
    await askGeminiAndSpell(input);
  } else {
    hideAIBoxes();
    await spellOut(input);
  }
}


async function askGeminiAndSpell(question){
  const status      = document.getElementById('aiStatus');
  const replyBox    = document.getElementById('aiReplyBox');
  const replyText   = document.getElementById('aiReplyText');
  const spellingOut = document.getElementById('aiSpellingOut');

  hideAIBoxes();
  status.textContent = "Asking AI…";

  const systemPrompt = `You are a Braille instructor assistant.
The user (often a blind learner) asks a question or says a word.
Your job: respond with the SHORTEST possible answer to be spelled out in Braille on a physical device.

Rules:
- If the user says a single word like "apple", return exactly that word.
- If the user asks a factual question (e.g. "when did India get freedom"), return ONLY the key answer token — a number, a name, or a short word. E.g. "1947", "Gandhi", "Delhi".
- Never return a full sentence.
- Never add punctuation, articles, or explanations.
- Return ONLY the answer token, nothing else.`;

  try{
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: question }] }]
        })
      }
    );

    if(!res.ok){
      const err = await res.json();
      throw new Error(err.error?.message || "API error " + res.status);
    }

    const data   = await res.json();
    const answer = data.candidates[0].content.parts[0].text.trim();

    if(!answer){ status.textContent = "AI returned an empty answer."; return; }

    replyBox.style.display  = 'block';
    replyText.textContent   = answer;
    spellingOut.textContent = answer.toUpperCase().split('').join(' · ');
    status.textContent      = '';

    speak(answer);
    await sleep(1500);
    await spellOut(answer);

  }catch(e){
    console.error(e);
    status.textContent = "AI request failed: " + e.message;
  }
}

let recognizing = false;
let recognition;

window.startVoice = function(){
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){
    alert("Speech recognition is not supported in this browser. Please use Chrome.");
    return;
  }

  if(recognizing){ recognition.stop(); return; }

  unlockSpeech();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang            = 'en-US';
  recognition.interimResults  = true;
  recognition.maxAlternatives = 1;

  const voiceBtn   = document.getElementById('voiceBtn');
  const status     = document.getElementById('aiStatus');
  const transcript = document.getElementById('transcriptText');
  const tbox       = document.getElementById('transcriptBox');

  voiceBtn.style.background = '#ef4444';
  voiceBtn.innerHTML        = '🔴 &nbsp;Listening…';
  status.textContent        = 'Listening — speak now…';
  recognizing               = true;

  recognition.onresult = (e) => {
    let interim = '', final = '';
    for(let i = e.resultIndex; i < e.results.length; i++){
      const t = e.results[i][0].transcript;
      if(e.results[i].isFinal) final += t;
      else interim += t;
    }
    tbox.style.display     = 'block';
    transcript.textContent = final || interim;
  };

  recognition.onerror = (e) => {
    status.textContent = "Mic error: " + e.error;
    resetVoiceBtn();
    recognizing = false;
  };

  recognition.onend = async () => {
    recognizing = false;
    resetVoiceBtn();
    const heard = document.getElementById('transcriptText').textContent.trim();
    if(heard){
      document.getElementById('aiWordInput').value = heard;
      await processInput(heard);
    }
  };

  recognition.start();
};

function resetVoiceBtn(){
  const voiceBtn = document.getElementById('voiceBtn');
  voiceBtn.style.background = '';
  voiceBtn.innerHTML        = '🎤 &nbsp;Speak';
}


function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

function hideAIBoxes(){
  document.getElementById('transcriptBox').style.display = 'none';
  document.getElementById('aiReplyBox').style.display    = 'none';
}

function badgeStyle(state){
  const base = 'padding:4px 10px;border-radius:8px;font-size:13px;font-weight:500;transition:all 0.3s;';
  if(state === 'active') return base + 'background:#6366f1;color:white;border:1px solid #6366f1;';
  if(state === 'done')   return base + 'background:#1e293b;color:#475569;border:1px solid #334155;text-decoration:line-through;';
  return base + 'background:#334155;color:#94a3b8;border:1px solid #475569;';
}

function setBadgeStyle(i, state){
  const b = document.getElementById('aibadge' + i);
  if(b) b.style.cssText = badgeStyle(state);
}

}); // end DOMContentLoaded
