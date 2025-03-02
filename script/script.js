/**********************************************
 * GLOBAL STATE
 **********************************************/
let isDarkMode = false;
let currentBackground = "morning"; // can be auto, morning, midday, sunset, night
let userPoints = 0;
let currentConversationCount = 0;
let sentenceWords = [];
let campaignProgress = 0; // 0 to 10 for Emperor's Palace
let isTigerSpeaking = false;

/**********************************************
 * ON LOAD
 **********************************************/
window.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSettings();
  initSentenceBuilder();
  initChatbot();
  initCampaignMode();
  initTiger();
});

/**********************************************
 * TABS (LEARN, PRACTICE, JOURNEY)
 **********************************************/
function initTabs() {
  const learnTab = document.getElementById("learn-tab");
  const practiceTab = document.getElementById("practice-tab");
  const journeyTab = document.getElementById("journey-tab");

  const learnSection = document.getElementById("learn-section");
  const practiceSection = document.getElementById("practice-section");
  const journeySection = document.getElementById("journey-section");

  learnTab.addEventListener("click", () => {
    learnTab.classList.add("active");
    practiceTab.classList.remove("active");
    journeyTab.classList.remove("active");

    learnSection.classList.add("active-section");
    practiceSection.classList.remove("active-section");
    journeySection.classList.remove("active-section");
  });

  practiceTab.addEventListener("click", () => {
    practiceTab.classList.add("active");
    learnTab.classList.remove("active");
    journeyTab.classList.remove("active");

    practiceSection.classList.add("active-section");
    learnSection.classList.remove("active-section");
    journeySection.classList.remove("active-section");
  });

  journeyTab.addEventListener("click", () => {
    journeyTab.classList.add("active");
    learnTab.classList.remove("active");
    practiceTab.classList.remove("active");

    journeySection.classList.add("active-section");
    learnSection.classList.remove("active-section");
    practiceSection.classList.remove("active-section");
  });
}

/**********************************************
 * SETTINGS (LIGHT/DARK MODE, BACKGROUNDS, TIME OF DAY)
 **********************************************/
function initSettings() {
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const toggleThemeBtn = document.getElementById("toggleThemeBtn");
  const backgroundSelect = document.getElementById("backgroundSelect");
  const timeOfDaySelect = document.getElementById("timeOfDaySelect");

  // Show/hide modal
  settingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "block";
  });
  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "none";
  });

  // Dark/Light Mode Toggle
  toggleThemeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
  });

  // Populate Background Options
  const backgrounds = [
    "Temple Garden",
    "Misty Mountains",
    "Ancient Village",
    "Bamboo Forest",
    "City Nightscape",
  ];
  backgrounds.forEach((bg) => {
    const opt = document.createElement("option");
    opt.value = bg;
    opt.textContent = bg;
    backgroundSelect.appendChild(opt);
  });

  backgroundSelect.addEventListener("change", (e) => {
    currentBackground = e.target.value;
    // TODO: Update background logic if you have multiple backgrounds
  });

  // Time of Day (Auto, morning, midday, sunset, night)
  timeOfDaySelect.addEventListener("change", (e) => {
    currentBackground = e.target.value; // reusing same var for simplicity
    // TODO: Implement logic to change background based on time
  });
}

/**********************************************
 * SENTENCE BUILDER (LEARN TAB)
 **********************************************/
function initSentenceBuilder() {
  const sentenceInput = document.getElementById("sentenceInput");
  const addWordBtn = document.getElementById("addWordBtn");
  const wordBubbles = document.getElementById("wordBubbles");
  const submitSentenceBtn = document.getElementById("submitSentenceBtn");
  const feedback = document.getElementById("feedback");

  addWordBtn.addEventListener("click", () => {
    const word = sentenceInput.value.trim();
    if (!word) return;
    sentenceWords.push(word);
    renderWordBubbles();
    sentenceInput.value = "";
  });

  submitSentenceBtn.addEventListener("click", () => {
    // Placeholder for live correction logic
    const isCorrect = Math.random() > 0.3; // random placeholder
    if (isCorrect) {
      feedback.style.color = "green";
      feedback.textContent = "Great sentence!";
      // Award points based on "complexity" (placeholder)
      const complexityPoints = sentenceWords.length * 5;
      userPoints += complexityPoints;
      checkBackgroundUnlocks();
    } else {
      feedback.style.color = "red";
      feedback.textContent = "There's a mistake. Try adjusting your sentence.";
    }
    sentenceWords = [];
    renderWordBubbles();
  });

  function renderWordBubbles() {
    wordBubbles.innerHTML = "";
    sentenceWords.forEach((w, idx) => {
      const bubble = document.createElement("div");
      bubble.className = "word-bubble";
      bubble.textContent = w;
      bubble.addEventListener("click", () => {
        // remove word on click
        sentenceWords.splice(idx, 1);
        renderWordBubbles();
      });
      wordBubbles.appendChild(bubble);
    });
  }
}

/**********************************************
 * CHATBOT (PRACTICE TAB)
 **********************************************/
function initChatbot() {
  const chatWindow = document.getElementById("chatWindow");
  const chatInput = document.getElementById("chatInput");
  const chatSendBtn = document.getElementById("chatSendBtn");
  const voiceCheckbox = document.getElementById("voiceCheckbox");

  chatSendBtn.addEventListener("click", sendChatMessage);

  function sendChatMessage() {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;
    addChatMessage(userMsg, "user");
    chatInput.value = "";

    // Placeholder AI logic
    setTimeout(() => {
      const botReply = generateBotReply(userMsg);
      addChatMessage(botReply, "bot");
      // increment conversation count
      currentConversationCount++;
      checkConversationMilestones();
    }, 500);
  }

  function addChatMessage(msg, sender) {
    const div = document.createElement("div");
    div.classList.add("chat-message");
    div.classList.add(sender === "user" ? "user-message" : "bot-message");
    div.textContent = msg;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function generateBotReply(input) {
    // Very simple placeholder logic
    if (input.includes("你好")) {
      return "你好！有什么我能帮你的吗？";
    } else if (input.includes("谢谢")) {
      return "不客气！";
    } else {
      return "我正在学习中，能告诉我更多吗？";
    }
  }
}

/**********************************************
 * CAMPAIGN MODE (JOURNEY TAB)
 **********************************************/
function initCampaignMode() {
  const campaignStepsContainer = document.getElementById("campaignSteps");
  campaignStepsContainer.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const step = document.createElement("div");
    step.classList.add("campaign-step");
    step.textContent = i;
    if (i <= campaignProgress) {
      step.classList.add("completed");
    }
    campaignStepsContainer.appendChild(step);
  }
}

/**********************************************
 * TIGER ANIMATION & SPEECH
 **********************************************/
function initTiger() {
  const tigerContainer = document.getElementById("tigerContainer");
  const tigerSpeech = document.getElementById("tigerSpeech");
  const tigerImage = document.getElementById("tigerImage");

  // Show/hide speech bubble on click
  tigerImage.addEventListener("click", () => {
    if (tigerSpeech.style.display === "none" || tigerSpeech.style.display === "") {
      tigerSpeech.style.display = "block";
      tigerSpeech.textContent = getRandomTigerPhrase();
    } else {
      tigerSpeech.style.display = "none";
    }
  });
}

function getRandomTigerPhrase() {
  const phrases = [
    "你好，我是你的中文导师！",
    "点击单词泡泡来修改句子哦！",
    "加油！你的中文越来越好啦！",
    "试试语音功能吧，更有趣！",
    "别忘了检查设置里的新背景哦！",
  ];
  const idx = Math.floor(Math.random() * phrases.length);
  return phrases[idx];
}

/**********************************************
 * POINTS SYSTEM & BACKGROUND UNLOCKS
 **********************************************/
function checkBackgroundUnlocks() {
  // For every 50 conversations or certain points, we can unlock new backgrounds
  // This is just placeholder logic
  if (userPoints >= 50) {
    // unlock new backgrounds
  }
}

/**********************************************
 * CONVERSATION MILESTONES
 **********************************************/
function checkConversationMilestones() {
  // For every 5 conversations up to 25, then every 25 after that
  const milestones = [5, 10, 15, 20, 25, 50, 75, 100, 125, 150, 500];
  if (milestones.includes(currentConversationCount)) {
    // maybe show a tiger celebration?
    // or unlock backgrounds
  }
}
