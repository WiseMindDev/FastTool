// --- DOM Elements ---
const textDisplay = document.getElementById("textDisplay");
const typingInput = document.getElementById("typingInput");
const timerSpan = document.getElementById("timer");
const wpmSpan = document.getElementById("wpm"); // Keeping for internal calculation/potential future display
const accuracySpan = document.getElementById("accuracy"); // Keeping for internal calculation/potential future display
const errorsSpan = document.getElementById("errors"); // Keeping for internal calculation/potential future display
const restartBtn = document.getElementById("restartBtn");
const englishBtn = document.getElementById("englishBtn");
const persianBtn = document.getElementById("persianBtn");
const durationButtons = document.querySelectorAll(".duration-button");
// const soundToggleBtn = document.getElementById("soundToggleBtn");
const messageBox = document.getElementById("messageBox");

// Results Modal Elements
const resultsModal = document.getElementById("resultsModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const retryTestBtn = document.getElementById("retryTestBtn");
const finalWpmSpan = document.getElementById("finalWpm");
const finalAccuracySpan = document.getElementById("finalAccuracy");
const finalErrorsSpan = document.getElementById("finalErrors");
const finalTimeSpan = document.getElementById("finalTime");

// --- Text Data for Different Languages ---
const texts = {
  english: [
    "The quick brown fox jumps over the lazy dog. This is a classic pangram often used for testing fonts and keyboards. It contains every letter of the English alphabet.",
    "Never underestimate the power of a good book. Reading can transport you to different worlds and expand your knowledge in countless ways. It's a journey for the mind.",
    "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, innovation continues to shape our future at an incredible pace.",
    "The sun always shines brightest after the rain. This idiom suggests that difficult times are often followed by better ones. Keep pushing through the challenges.",
    "Practice makes perfect, so keep on typing! Consistent effort and dedication are key to improving any skill, including your typing speed and accuracy. Stay focused.",
    "The early bird catches the worm, but the second mouse gets the cheese. This proverb highlights the benefits of being proactive, but also the value of cautious observation.",
    "Innovation distinguishes between a leader and a follower. To truly stand out, one must constantly seek new ideas and approaches, not just follow existing paths.",
    "The only way to do great work is to love what you do. Passion fuels perseverance and creativity, leading to exceptional results. Find joy in your endeavors.",
    "Life is what happens when you're busy making other plans. It's a reminder to live in the present moment and appreciate the unexpected twists and turns of life's journey.",
    "The future belongs to those who believe in the beauty of their dreams. Hold onto your aspirations and work tirelessly to make them a reality. Believe in yourself.",
    "A journey of a thousand miles begins with a single step. Every great achievement starts with a small, initial action. Don't be afraid to begin.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. Resilience is a powerful trait that helps us overcome adversity.",
    "The only true wisdom is in knowing you know nothing. This Socratic paradox emphasizes humility and the endless pursuit of knowledge. Always be open to learning.",
    "In the middle of difficulty lies opportunity. Challenges often present hidden chances for growth and innovation. Look for the silver lining.",
    "The mind is everything. What you think you become. Your thoughts shape your reality and influence your actions. Cultivate a positive mindset.",
  ],
  persian: [
    "سرعت تایپ خود را با این متن فارسی بسنجید. این متن شامل کلمات رایج و ساختار جملات معمول فارسی است تا تجربه واقعی‌تری از تایپ را ارائه دهد.",
    "دانش قدرت است، اطلاعات آزادی است، آموزش کلید پیشرفت است. با کسب دانش، می‌توانید افق‌های جدیدی را در زندگی خود بگشایید و به اهداف بزرگتری دست یابید.",
    "زندگی زیباست اگر زیبا ببینی. نگاه شما به دنیا می‌تواند تمام تجربیات شما را تغییر دهد. با دید مثبت، زیبایی‌ها را کشف کنید.",
    "هرگز از رویاهای خود دست نکشید. رویاها سوخت حرکت شما به سمت آینده هستند. با پشتکار و ایمان، به آن‌ها جامه عمل بپوشانید.",
    "تلاش و پشتکار، رمز موفقیت است. هیچ موفقیتی بدون زحمت و استمرار به دست نمی‌آید. به مسیر خود ادامه دهید.",
    "امید تنها چیزی است که از ترس قوی تر است. در تاریک‌ترین لحظات، امید می‌تواند چراغ راه شما باشد و شما را به سمت نور هدایت کند.",
    "کتاب بهترین دوست انسان است. با خواندن کتاب‌ها، می‌توانید از تجربیات دیگران بیاموزید و دیدگاه‌های جدیدی کسب کنید.",
    "صبر کلید گشایش است. در مواجهه با مشکلات، بردباری و شکیبایی می‌تواند به شما کمک کند تا بهترین راه‌حل‌ها را پیدا کنید.",
    "همیشه راهی برای رسیدن به اهداف وجود دارد. اگر یک در بسته شد، در دیگری باز خواهد شد. هرگز تسلیم نشوید.",
    "آینده از آن کسانی است که به زیبایی رویاهایشان ایمان دارند. با باور قلبی به توانایی‌های خود، می‌توانید آینده‌ای را که می‌خواهید بسازید.",
    "هرگز برای یادگیری دیر نیست. هر روز فرصتی جدید برای کسب دانش و مهارت‌های تازه است. از هر لحظه استفاده کنید.",
    "شادترین مردم لزوما بهترین چیزها را ندارند، بلکه از هر آنچه دارند بهترین استفاده را می‌کنند. شادی یک انتخاب است.",
    "آنچه امروز می‌کارید، فردا درو خواهید کرد. اعمال و تصمیمات امروز شما، آینده شما را شکل می‌دهند. مراقب انتخاب‌هایتان باشید.",
    "موفقیت مجموعه‌ای از تلاش‌های کوچک است که هر روز تکرار می‌شوند. استمرار و پایداری، شما را به مقصد می‌رساند.",
    "ذهن شما قوی‌ترین ابزار شماست. با افکار مثبت، می‌توانید هر مانعی را از سر راه بردارید و به هر چیزی که می‌خواهید دست یابید.",
  ],
};

// --- Global State Variables ---
let currentText = ""; // The text currently displayed for typing
let timer = 0; // Current time in seconds
let intervalId = null; // ID for the setInterval timer
let typedCharacters = 0; // Count of characters typed
let correctCharacters = 0; // Count of correctly typed characters
let errors = 0; // Count of errors
let testStarted = false; // Flag to indicate if the test has started
let currentLanguage = "english"; // Default language
let testDuration = 30; // Default test duration in seconds
let soundEnabled = true; // Sound toggle state

// --- Audio Elements ---
// Base64 encoded audio for short, subtle sounds.
const correctSound = new Audio(
  "data:audio/wav;base64,UklGRl9XAABXQVZFZm10IBAAAAABAAEARAEAASAAvwIAAAACABAAZGF0YVAA"
); // Placeholder, replace with actual sound if desired
const incorrectSound = new Audio(
  "data:audio/wav;base64,UklGRl9XAABXQVZFZm10IBAAAAABAAEARAEAASAAvwIAAAACABAAZGF0YVAA"
); // Placeholder, replace with actual sound if desired
// Removed the audible beep sound as per request.

correctSound.volume = 0.1;
incorrectSound.volume = 0.1;

// --- Utility Functions ---

// Function to show a temporary message
function showMessage(msg, duration = 3000) {
  messageBox.textContent = msg;
  messageBox.classList.remove("hidden");
  messageBox.classList.add("show");

  setTimeout(() => {
    messageBox.classList.remove("show");
    setTimeout(() => {
      messageBox.classList.add("hidden");
    }, 300); // Wait for fade-out transition
  }, duration);
}

// Function to get a random text based on the current language
function getRandomText() {
  const textsArray = texts[currentLanguage];
  const randomIndex = Math.floor(Math.random() * textsArray.length);
  return textsArray[randomIndex];
}

// Function to display the text in the text-display area with word highlighting
function displayText() {
  currentText = getRandomText();
  textDisplay.setAttribute(
    "dir",
    currentLanguage === "persian" ? "rtl" : "ltr"
  );
  textDisplay.innerHTML = ""; // Clear previous text

  currentText.split("").forEach((char, charIndex) => {
    const charSpan = document.createElement("span");
    charSpan.textContent = char;
    charSpan.dataset.charIndex = charIndex; // Store index for easier lookup
    textDisplay.appendChild(charSpan);
  });

  // Highlight the first character and first word
  highlightCurrentPosition(0);
}

// Function to highlight the current character and word
function highlightCurrentPosition(charIndex) {
  const allCharSpans = textDisplay.querySelectorAll("span");

  // Remove all existing highlights
  allCharSpans.forEach((span) => {
    span.classList.remove("current-char", "current-word-highlight");
  });

  if (charIndex < allCharSpans.length) {
    const currentCharSpan = allCharSpans[charIndex];
    currentCharSpan.classList.add("current-char");

    // Find the current word boundaries
    let wordStartIndex = charIndex;
    while (wordStartIndex > 0 && currentText[wordStartIndex - 1] !== " ") {
      wordStartIndex--;
    }

    let wordEndIndex = charIndex;
    while (
      wordEndIndex < currentText.length &&
      currentText[wordEndIndex] !== " "
    ) {
      wordEndIndex++;
    }

    // Apply highlight to the entire current word
    for (let i = wordStartIndex; i < wordEndIndex; i++) {
      if (allCharSpans[i]) {
        allCharSpans[i].classList.add("current-word-highlight");
      }
    }
  }
}

// Function to update the timer
function updateTimer() {
  timer++;
  timerSpan.textContent = timer < 10 ? `0${timer}` : timer; // Format to 00
  // No live WPM/Accuracy display as per new UI, only in modal
  // calculateResults(); // Still call to update internal variables

  if (timer >= testDuration) {
    endTest();
  }
}

// Function to calculate and display WPM and Accuracy (for modal)
function calculateResults() {
  const minutes = timer / 60;
  const wpm = minutes > 0 ? Math.round(correctCharacters / 5 / minutes) : 0;
  // wpmSpan.textContent = wpm; // Not displayed live

  const accuracy =
    typedCharacters > 0
      ? Math.round((correctCharacters / typedCharacters) * 100)
      : 100;
  // accuracySpan.textContent = accuracy; // Not displayed live
  // errorsSpan.textContent = errors; // Not displayed live
  return { wpm, accuracy, errors, time: timer };
}

// Function to end the test
function endTest() {
  clearInterval(intervalId); // Stop the timer
  typingInput.disabled = true; // Disable input
  testStarted = false;
  typingInput.value = ""; // Clear input on test end

  // Removed beep sound as per request.

  const results = calculateResults();

  // Display results in modal
  finalWpmSpan.textContent = results.wpm;
  finalAccuracySpan.textContent = results.accuracy;
  finalErrorsSpan.textContent = results.errors;
  finalTimeSpan.textContent = results.time;

  resultsModal.classList.add("show"); // Show the modal
}

// Function to reset the test
function resetTest() {
  clearInterval(intervalId);
  timer = 0;
  typedCharacters = 0;
  correctCharacters = 0;
  errors = 0;
  testStarted = false;

  typingInput.value = "";
  typingInput.disabled = false; // Ensure input is enabled on reset
  timerSpan.textContent = "00"; // Reset to 00
  // Reset spans for internal variables, not visible in new UI
  wpmSpan.textContent = "0";
  accuracySpan.textContent = "100";
  errorsSpan.textContent = "0";

  displayText();
  typingInput.focus();
  resultsModal.classList.remove("show"); // Hide modal if open
}

// --- Event Handlers ---

// Handle input from the typing area
function handleTypingInput(e) {
  if (!testStarted) {
    testStarted = true;
    intervalId = setInterval(updateTimer, 1000);
  }

  const typedText = typingInput.value;
  const allCharSpans = textDisplay.querySelectorAll("span");

  typedCharacters = typedText.length;
  correctCharacters = 0;
  errors = 0;

  allCharSpans.forEach((span, index) => {
    const originalChar = currentText[index];
    const typedChar = typedText[index];

    // Remove previous correct/incorrect classes
    span.classList.remove("correct", "incorrect");

    if (typedChar === undefined) {
      // Character not yet typed
      // No class needed, highlightCurrentPosition will handle 'current-char'
    } else if (typedChar === originalChar) {
      span.classList.add("correct");
      correctCharacters++;
      if (soundEnabled && e.data) {
        // Play sound only on new character input
        correctSound.currentTime = 0;
        correctSound.play();
      }
    } else {
      span.classList.add("incorrect");
      errors++;
      if (soundEnabled && e.data) {
        // Play sound only on new character input
        incorrectSound.currentTime = 0;
        incorrectSound.play();
      }
    }
  });

  // Highlight the next character to type
  highlightCurrentPosition(typedText.length);

  // Check if the test is finished by text length
  if (typedText.length === currentText.length) {
    endTest();
  }
}

// Handle language selection
function selectLanguage(lang) {
  currentLanguage = lang;
  englishBtn.classList.remove("active");
  persianBtn.classList.remove("active");
  document.getElementById(`${lang}Btn`).classList.add("active");
  showMessage(`Language set to ${lang === "english" ? "English" : "فارسی"}`);
  resetTest(); // Reset test with new language
}

// Handle duration selection
function selectDuration(duration) {
  testDuration = duration;
  durationButtons.forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`.duration-button[data-duration="${duration}"]`)
    .classList.add("active");
  showMessage(`Test duration set to ${duration} seconds.`);
  resetTest(); // Reset test with new duration
}

// Toggle sound
// function toggleSound() {
//   soundEnabled = !soundEnabled;
//   soundToggleBtn.querySelector("i").className = soundEnabled
//     ? "fas fa-volume-up"
//     : "fas fa-volume-mute";
//   showMessage(`Sound ${soundEnabled ? "enabled" : "disabled"}.`);
// }

// --- Initial Setup and Event Listeners ---

// Initial display of text and focus
window.addEventListener("load", () => {
  displayText();
  typingInput.focus();
  // Ensure typing input is enabled on load
  typingInput.disabled = false;
  // Set initial state for sound button icon
  // soundToggleBtn.querySelector("i").className = soundEnabled
  //   ? "fas fa-volume-up"
  //   : "fas fa-volume-mute";
});

// Event listeners for buttons
restartBtn.addEventListener("click", resetTest);
englishBtn.addEventListener("click", () => selectLanguage("english"));
persianBtn.addEventListener("click", () => selectLanguage("persian"));
// soundToggleBtn.addEventListener("click", toggleSound);

// Add event listeners for duration buttons
durationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectDuration(parseInt(button.dataset.duration));
  });
});

// Event listener for typing input
typingInput.addEventListener("input", handleTypingInput);

// Event listeners for modal buttons
closeModalBtn.addEventListener("click", () => {
  resultsModal.classList.remove("show");
});
retryTestBtn.addEventListener("click", resetTest);
