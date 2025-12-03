
// Shared text for prompt simulation
const SYSTEM_TEXT = [
  "You are a friendly LEGO-powered AI.",
  "Always explain things simply and safely.",
  "Use LEGO as a metaphor for tokens and attention."
].join("\n");

const DEVELOPER_TEXT = [
  "Keep the tone light and encouraging.",
  "Imagine you are teaching a curious 12-year-old.",
  "Avoid heavy math and scary jargon."
].join("\n");

const MEMORY_TEXT = [
  "User profile (example):",
  "- Name: Andreas",
  "- Likes clear, fun explanations",
  "- Enjoys LEGO analogies"
].join("\n");

const HISTORY_TEXT = [
  "User: How does an AI read a prompt?",
  "Assistant: It reads a big block of text with rules, memory, history, and your new message.",
  "User: Show me what that looks like.",
  "Assistant: Here's a mock-up."
].join("\n");

// ---- Helpers ----
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---- Level 1: Prompts ----
function updatePromptView() {
  const promptView = document.getElementById("promptView");
  const userInput = document.getElementById("userMessage");
  if (!promptView || !userInput) return;
  const msg = userInput.value.trim() || "Explain how you understand LEGO sentences.";
  const prompt =
    "SYSTEM:\n" + SYSTEM_TEXT + "\n\n" +
    "DEVELOPER:\n" + DEVELOPER_TEXT + "\n\n" +
    "MEMORY:\n" + MEMORY_TEXT + "\n\n" +
    "HISTORY:\n" + HISTORY_TEXT + "\n\n" +
    "USER:\n" + msg + "\n";
  promptView.textContent = prompt;
}

// ---- Level 2: Tokens ----
function buildTokens() {
  const input = document.getElementById("tokenInput");
  const container = document.getElementById("tokenBricks");
  if (!input || !container) return;
  container.innerHTML = "";
  const text = input.value.trim();
  if (!text) return;
  const words = text.split(/\s+/);
  words.forEach((word, i) => {
    const brick = document.createElement("div");
    brick.className = "brick";
    brick.innerHTML =
      '<span class="brick-index">' + (i + 1) + "</span>" +
      '<span class="brick-word">' + escapeHtml(word) + "</span>";
    container.appendChild(brick);
  });
}

// ---- Level 3: Attention ----
const attentionWords = ["Cats", "purr", "when", "they", "feel", "safe"];
const attentionMatrix = {
  "Cats": {"Cats": 1.0, "purr": 0.9, "when": 0.25, "they": 0.8, "feel": 0.4, "safe": 0.35},
  "purr": {"Cats": 0.9, "purr": 1.0, "when": 0.25, "they": 0.5, "feel": 0.3, "safe": 0.25},
  "when": {"Cats": 0.35, "purr": 0.6, "when": 1.0, "they": 0.55, "feel": 0.55, "safe": 0.4},
  "they": {"Cats": 0.8, "purr": 0.5, "when": 0.55, "they": 1.0, "feel": 0.7, "safe": 0.55},
  "feel": {"Cats": 0.3, "purr": 0.3, "when": 0.55, "they": 0.7, "feel": 1.0, "safe": 0.75},
  "safe": {"Cats": 0.25, "purr": 0.25, "when": 0.4, "they": 0.55, "feel": 0.75, "safe": 1.0}
};

function initAttentionBricks() {
  const container = document.getElementById("attentionBricks");
  if (!container) return;
  container.innerHTML = "";
  attentionWords.forEach(word => {
    const brick = document.createElement("div");
    brick.className = "attention-brick";
    brick.dataset.word = word;
    brick.innerHTML =
      "<div>" + word + "</div>" +
      '<span class="attention-score"></span>' +
      '<div class="attention-label">click</div>';
    brick.addEventListener("click", () => selectAttentionWord(word));
    container.appendChild(brick);
  });
  selectAttentionWord("Cats");
}

function selectAttentionWord(word) {
  const bricks = document.querySelectorAll(".attention-brick");
  const explanation = document.getElementById("attentionExplanation");
  if (!bricks.length) return;

  bricks.forEach(brick => {
    const w = brick.dataset.word;
    const scores = attentionMatrix[word] || {};
    const score = scores[w] || 0;

    brick.className = "attention-brick"; // reset
    if (w === word) {
      brick.classList.add("att-selected");
    }
    if (score >= 0.75) {
      brick.classList.add("att-high");
    } else if (score >= 0.45) {
      brick.classList.add("att-medium");
    } else if (score >= 0.2) {
      brick.classList.add("att-low");
    } else {
      brick.classList.add("att-none");
    }

    const scoreSpan = brick.querySelector(".attention-score");
    const label = brick.querySelector(".attention-label");
    if (w === word) {
      scoreSpan.textContent = "⬅ focus";
      label.textContent = "me";
    } else if (score > 0.7) {
      scoreSpan.textContent = "★ ★ ★";
      label.textContent = "very important";
    } else if (score > 0.4) {
      scoreSpan.textContent = "★ ★";
      label.textContent = "important";
    } else if (score > 0.2) {
      scoreSpan.textContent = "★";
      label.textContent = "a bit";
    } else {
      scoreSpan.textContent = "";
      label.textContent = "barely";
    }
  });

  if (explanation) {
    explanation.textContent =
      'When the AI thinks about "' + word +
      '", it listens most to the LEGO words that glow the strongest.';
  }
}

function setScenario(scenario) {
  // Optional hook for future: could show different text per question type
  const scenarioBox = document.getElementById("attentionScenario");
  if (!scenarioBox) return;
  if (scenario === "who") {
    scenarioBox.textContent =
      'Question: "Who is purring?" → The AI will focus most on "Cats" and "they".';
  } else if (scenario === "what") {
    scenarioBox.textContent =
      'Question: "What is happening?" → The AI will focus on "purr" and its friends.';
  } else if (scenario === "feeling") {
    scenarioBox.textContent =
      'Question: "How do they feel?" → The AI will focus on "feel" and "safe".';
  }
}

// ---- Level 4: Transformer steps ----
const transformerSteps = [
  {
    title: "Step 1 – LEGO pieces with secret stats (embeddings)",
    pill: "Sentence: “Cats purr loudly.”",
    body:
      "<p>Each word becomes a LEGO piece with hidden stats, like a card under the brick:</p>" +
      "<ul>" +
      "<li><strong>Cats</strong> – a living creature, the subject.</li>" +
      "<li><strong>purr</strong> – an action and a sound.</li>" +
      "<li><strong>loudly</strong> – tells us <em>how</em> they purr.</li>" +
      "</ul>" +
      "<p>The AI doesn’t see pictures, just these smart stats. Nothing magical, just numbers.</p>"
  },
  {
    title: "Step 2 – Attention: bricks looking around the pile",
    pill: "Who matters to me?",
    body:
      "<p>Now each LEGO word looks around and decides which friends matter most:</p>" +
      "<ul>" +
      "<li><strong>Cats</strong> listens mostly to <strong>purr</strong> and <strong>they</strong>.</li>" +
      "<li><strong>purr</strong> listens to <strong>cats</strong> and <strong>loudly</strong>.</li>" +
      "<li><strong>loudly</strong> listens to <strong>purr</strong>.</li>" +
      "</ul>" +
      "<p>This is attention. The AI is not deciding the future or spying on you. It is just deciding which <em>words</em> on the page belong together.</p>"
  },
  {
    title: "Step 3 – Mixing information: borrowing from friends",
    pill: "Combining meanings",
    body:
      "<p>Each brick now borrows information from the bricks it cares about:</p>" +
      "<ul>" +
      "<li><strong>Cats</strong> + a bit of <strong>purr</strong> → cats-that-are-purring.</li>" +
      "<li><strong>purr</strong> + cats + loudly → a loud purr done by cats.</li>" +
      "<li><strong>loudly</strong> + purr → the loudness of that purr.</li>" +
      "</ul>" +
      "<p>It’s like snapping extra tiles onto each LEGO piece so the meaning becomes clearer and clearer.</p>"
  },
  {
    title: "Step 4 – Understanding the sentence (for real)",
    pill: "A tiny LEGO brain",
    body:
      "<p>After attention and mixing, the model has a clear picture:</p>" +
      "<ul>" +
      "<li>Who is doing something? <strong>Cats.</strong></li>" +
      "<li>What are they doing? <strong>Purring.</strong></li>" +
      "<li>How? <strong>Loudly.</strong></li>" +
      "</ul>" +
      "<p>The AI is not alive or conscious. It just uses patterns in text to guess what makes sense next.</p>"
  }
];
let transformerStepIndex = 0;

function renderTransformerStep() {
  const titleEl = document.getElementById("stepTitle");
  const pillEl = document.getElementById("stepPill");
  const bodyEl = document.getElementById("stepBody");
  if (!titleEl || !pillEl || !bodyEl) return;
  const step = transformerSteps[transformerStepIndex];
  titleEl.textContent = step.title;
  pillEl.textContent = "Step " + (transformerStepIndex + 1) + " of " + transformerSteps.length;
  bodyEl.innerHTML = step.body;
}
function nextStep() {
  transformerStepIndex = (transformerStepIndex + 1) % transformerSteps.length;
  renderTransformerStep();
}
function prevStep() {
  transformerStepIndex = (transformerStepIndex - 1 + transformerSteps.length) % transformerSteps.length;
  renderTransformerStep();
}

// ---- Level 5: Quiz ----
const quizQuestions = [
  {
    sentenceEn: "Why do cats purr?",
    sentenceSv: "Varför spinner katter?",
    options: ["why", "do", "cats", "purr"],
    correct: ["cats", "purr"],
    explanationEn: "Great! The main meaning lives in “cats” and “purr”.",
    explanationSv: "Toppen! Huvudbetydelsen finns i ”katter” och ”spinner”."
  },
  {
    sentenceEn: "Dogs wag their tails when they are happy.",
    sentenceSv: "Hundar viftar på svansen när de är glada.",
    options: ["dogs", "wag", "their", "happy"],
    correct: ["dogs", "wag", "happy"],
    explanationEn: "Nice! Nouns and verbs like “dogs”, “wag” and “happy” carry a lot of meaning.",
    explanationSv: "Snyggt! Ord som ”hundar”, ”viftar” och ”glada” bär mycket av betydelsen."
  },
  {
    sentenceEn: "The robot sorts LEGO bricks by color.",
    sentenceSv: "Roboten sorterar LEGO-bitar efter färg.",
    options: ["robot", "sorts", "LEGO", "color"],
    correct: ["robot", "sorts", "LEGO", "color"],
    explanationEn: "Exactly. All these words are important to the main idea of the sentence.",
    explanationSv: "Precis. Alla de här orden är viktiga för meningen."
  }
];

let currentQuestionIndex = 0;
let selectedOptions = new Set();
let quizLanguage = "en";

function setQuizLanguage(lang) {
  quizLanguage = lang;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  const sentenceEl = document.getElementById("quizSentence");
  const optionsContainer = document.getElementById("quizOptions");
  const feedbackEl = document.getElementById("quizFeedback");
  const progressFill = document.getElementById("quizProgress");
  if (!sentenceEl || !optionsContainer || !feedbackEl || !progressFill) return;

  selectedOptions = new Set();
  feedbackEl.textContent = "";
  feedbackEl.className = "quiz-feedback";

  const total = quizQuestions.length;
  const progress = ((currentQuestionIndex) / total) * 100;
  progressFill.style.width = progress + "%";

  sentenceEl.textContent = quizLanguage === "en" ? q.sentenceEn : q.sentenceSv;

  optionsContainer.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "quiz-button";
    btn.textContent = opt;
    btn.addEventListener("click", () => toggleQuizOption(opt, btn));
    optionsContainer.appendChild(btn);
  });
}

function toggleQuizOption(option, button) {
  const q = quizQuestions[currentQuestionIndex];
  const feedbackEl = document.getElementById("quizFeedback");
  if (!q || !feedbackEl) return;

  if (selectedOptions.has(option)) {
    selectedOptions.delete(option);
    button.classList.remove("correct", "wrong");
  } else {
    selectedOptions.add(option);
  }

  const selectedArray = Array.from(selectedOptions).sort();
  const correctSorted = q.correct.slice().sort();

  if (selectedArray.length === 0) {
    feedbackEl.textContent = "";
    feedbackEl.className = "quiz-feedback";
    return;
  }

  const isCorrect =
    selectedArray.length === correctSorted.length &&
    selectedArray.every((v, i) => v === correctSorted[i]);

  if (isCorrect) {
    feedbackEl.textContent = quizLanguage === "en" ? q.explanationEn : q.explanationSv;
    feedbackEl.className = "quiz-feedback good";
  } else {
    feedbackEl.textContent =
      quizLanguage === "en"
        ? "Close! Try selecting only the words with the strongest meaning."
        : "Nästan! Försök välja bara de ord som bär mest betydelse.";
    feedbackEl.className = "quiz-feedback bad";
  }
}

function nextQuizQuestion() {
  currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
  renderQuizQuestion();
}

// ---- Init per page ----
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("promptView")) {
    updatePromptView();
    const userInput = document.getElementById("userMessage");
    if (userInput) userInput.addEventListener("input", updatePromptView);
  }
  if (document.getElementById("attentionBricks")) {
    initAttentionBricks();
    setScenario("who");
  }
  if (document.getElementById("stepTitle")) {
    renderTransformerStep();
  }
  if (document.getElementById("quizSentence")) {
    renderQuizQuestion();
  }
});
