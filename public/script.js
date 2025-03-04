/**********************************************
 * GLOBAL STATE
 **********************************************/
let isDarkMode = false;
let currentBackground = "morning"; // auto, morning, midday, sunset, night
let userPoints = 0;
let currentConversationCount = 0;
let sentenceWords = [];
let campaignProgress = 0; // 0 to 10 for Emperor's Palace
let isTigerSpeaking = false;
let flashcards = {}; // Stores all flashcard data
let isAutoPauseEnabled = false;

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
  initFlashcards();
  initAnkiImport();
});

/**********************************************
 * CHATBOT (PRACTICE TAB) - UPDATED WITH AUTO-PAUSE & SUBTITLES
 **********************************************/
function initChatbot() {
  const chatWindow = document.getElementById("chatWindow");
  const chatInput = document.getElementById("chatInput");
  const chatSendBtn = document.getElementById("chatSendBtn");
  const chatSubtitles = document.getElementById("chatSubtitles");
  const autoPauseCheckbox = document.getElementById("autoPauseCheckbox");

  chatSendBtn.addEventListener("click", sendChatMessage);
  autoPauseCheckbox.addEventListener("change", () => {
    isAutoPauseEnabled = autoPauseCheckbox.checked;
  });

  function sendChatMessage() {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;
    addChatMessage(userMsg, "user");
    chatInput.value = "";

    setTimeout(() => {
      const botReply = generateBotReply(userMsg);
      addChatMessage(botReply, "bot");

      chatSubtitles.innerText = botReply;
      chatSubtitles.style.display = "block";

      if (isAutoPauseEnabled) {
        chatSendBtn.disabled = true; // Pause until user continues
      } else {
        setTimeout(() => (chatSubtitles.style.display = "none"), 3000);
      }
    }, 500);
  }

  function addChatMessage(msg, sender) {
    const div = document.createElement("div");
    div.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");
    div.textContent = msg;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function generateBotReply(input) {
    return "你好！这是一个示例回复。";
  }
}

/**********************************************
 * FLASHCARD SYSTEM - ADDED SRS & SYNCING
 **********************************************/
function initFlashcards() {
  const flashcardContainer = document.getElementById("flashcardContainer");
  const flashcardWord = document.getElementById("flashcardWord");
  const flashcardExample = document.getElementById("flashcardExample");
  const editFlashcard = document.getElementById("editFlashcard");

  editFlashcard.addEventListener("click", () => {
    const newExample = prompt("Edit example sentence:", flashcardExample.textContent);
    if (newExample) {
      flashcards[flashcardWord.textContent].example = newExample;
      flashcardExample.textContent = newExample;
    }
  });
}

/**********************************************
 * HOVER FEATURE EXPANDED TO FLASHCARD DECKS
 **********************************************/
document.querySelectorAll(".word-bubble").forEach((wordBubble) => {
  let hoverTimeout;
  wordBubble.addEventListener("mouseenter", () => {
    hoverTimeout = setTimeout(() => {
      showHoverFlashcard(wordBubble.textContent);
    }, 500); // 0.5s delay to prevent accidental pop-ups
  });

  wordBubble.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimeout);
    hideHoverFlashcard();
  });
});

function showHoverFlashcard(word) {
  const flashcardContainer = document.getElementById("flashcardContainer");
  flashcardContainer.style.display = "block";
  document.getElementById("flashcardWord").textContent = word;
  document.getElementById("flashcardExample").textContent = flashcards[word]?.example || "No example available.";
}

function hideHoverFlashcard() {
  document.getElementById("flashcardContainer").style.display = "none";
}

/**********************************************
 * ANKI IMPORT SYSTEM
 **********************************************/
function initAnkiImport() {
  const importFile = document.getElementById("importFile");
  const importFlashcardsBtn = document.getElementById("importFlashcardsBtn");

  importFlashcardsBtn.addEventListener("click", () => {
    const file = importFile.files[0];
    if (!file) return alert("Please select a file to import.");

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const importedData = JSON.parse(event.target.result);
        Object.assign(flashcards, importedData);
        alert("Flashcards imported successfully!");
      } catch (error) {
        alert("Error importing flashcards. Please use a valid format.");
      }
    };

    reader.readAsText(file);
  });
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
  if (userPoints >= 50) {
    alert("New backgrounds unlocked!");
  }
}

/**********************************************
 * CONVERSATION MILESTONES
 **********************************************/
function checkConversationMilestones() {
  const milestones = [5, 10, 15, 20, 25, 50, 75, 100, 125, 150, 500];
  if (milestones.includes(currentConversationCount)) {
    alert("Milestone achieved!");
  }
}
