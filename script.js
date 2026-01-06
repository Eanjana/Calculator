const topOperand = document.querySelector(".top-operand");
const currentOperand = document.querySelector(".current-operand");
const calcWrap = document.querySelector(".calculator-wrap");
const historyPanel = document.getElementById("historyPanel");
const historyItems = document.getElementById("historyItems");
const theme = document.getElementById("themeToggle");
const historyToggle = document.getElementById("historyToggle");
const clearHistoryBtn = document.getElementById("clearHistory");
const numberButtons = document.querySelectorAll(".number-btn");

//scientific

document
  .querySelector(".sin-btn")
  .addEventListener("click", () => scientific("sin"));
document
  .querySelector(".cos-btn")
  .addEventListener("click", () => scientific("cos"));
document
  .querySelector(".tan-btn")
  .addEventListener("click", () => scientific("tan"));
document
  .querySelector(".sqrt-btn")
  .addEventListener("click", () => scientific("sqrt"));
document
  .querySelector(".log-btn")
  .addEventListener("click", () => scientific("log"));

//display - State Variables

let current = "";
let previous = "";
let operation = null;
let history = [];
let isDarkMode = false;

// Initialize
updateDisplay();

function updateDisplay() {
  currentOperand.textContent = current || "0";
}

function appendNumber(number) {
  if (number === "." && current.includes(".")) return;
  if (current.length >= 20) return;
  current = current + number;
  updateDisplay();
}

//number buttons

numberButtons.forEach((btn) => {
  btn.addEventListener("click", () => appendNumber(btn.textContent));
});

//operators

function setOperation(op) {
  if (current === "" && op === "-") {
    current = "-";
    updateDisplay();
    return;
  }

  topOperand.textContent += current + " " + op + " ";
  current = "";
  updateDisplay();
}

//equals button

document.getElementById("result-btn").addEventListener("click", calculate);

function calculate() {
  if (current === "" && topOperand.textContent === "") return;

  let expression = topOperand.textContent + current;

  try {
    let result = eval(expression);

    if (result !== Math.floor(result)) {
      result = Math.round(result * 1000000000) / 1000000000;
    }

    addToHistory(expression + " = " + result);

    topOperand.textContent = expression + " =";
    current = result.toString();
    previous = "";
    operation = null;
    updateDisplay();
  } catch {
    currentOperand.textContent = "Invalid Expression";
    current = "";
    previous = "";
    operation = null;
  }
}

// AC button

document.querySelector(".ac-btn").addEventListener("click", clear);

function clear() {
  current = "";
  previous = "";
  operation = null;
  topOperand.textContent = "";
  updateDisplay();
}

//backspace button

document.getElementById("backspace-btn").addEventListener("click", backspace);

function backspace() {
  current = current.slice(0, -1);
  updateDisplay();
}

//percentage

document.getElementById("mod-btn").addEventListener("click", () => {
  if (current === "") return;

  current = (parseFloat(current) / 100).toString();
  updateDisplay();
});

//brackets

document.querySelectorAll(".bracket").forEach((btn) => {
  btn.addEventListener("click", () => {
    current += btn.textContent;
    updateDisplay();
  });
});

//Scientific operations

function scientific(type) {
  if (current === "") return;

  let value = parseFloat(current);
  if (isNaN(value)) return;

  let originalValue = current;

  switch (type) {
    case "sin":
      value = Math.sin(value * Math.PI / 180);
      break;
    case "cos":
      value = Math.cos(value * Math.PI / 180);
      break;
    case "tan":
      value = Math.tan(value * Math.PI / 180);
      break;
    case "sqrt":
      if (value < 0) {
        currentOperand.textContent = "Invalid Input";
        current = "";
        return;
      }
      value = Math.sqrt(value);
      break;
    case "log":
      if (value <= 0) {
        currentOperand.textContent = "Invalid Input";
        current = "";
        return;
      }
      value = Math.log10(value);
      break;
  }
  // Handle decimal precision
  if (value !== Math.floor(value)) {
    value = Math.round(value * 1000000000) / 1000000000;
  }

  topOperand.textContent = `${type} (${originalValue})`;
  current = value.toString();
  updateDisplay();
}

// HISTORY FUNCTIONS
function addToHistory(entry) {
  history.unshift(entry); // Add to beginning
  if (history.length > 10) {
    history.pop(); // Keep only last 10
  }
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  historyItems.innerHTML =
    history.length === 0
      ? `<div class="no-history">No calculations yet</div>`
      : history.map((h) => `<div class="history-item">${h}</div>`).join("");
}

historyToggle.addEventListener("click", () => {
  historyPanel.classList.toggle("active");
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  updateHistoryDisplay();
});

//dark mode

theme.addEventListener("click", () => {
  isDarkMode = !isDarkMode;

  calcWrap.classList.toggle("dark");
  historyPanel.classList.toggle("dark");

  document.querySelectorAll(".btn-primary").forEach((btn) => {
    btn.classList.toggle("dark");
  });

  if (isDarkMode) {
    theme.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
  } else {
    theme.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
  }
});

//keyboard Support

document.addEventListener("keydown", (e) => {
  // Numbers
  if (e.key >= "0" && e.key <= "9") {
    appendNumber(e.key);
  }
  // Decimal
  else if (e.key === ".") {
    appendNumber(".");
  }
  // Operators
  else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    setOperation(e.key);
  }
  // Enter or Equals
  else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculate();
  }
  // Backspace
  else if (e.key === "Backspace") {
    e.preventDefault();
    backspace();
  }
  // Escape (Clear)
  else if (e.key === "Escape") {
    e.preventDefault();
    clear();
  }
  // Brackets
  else if (e.key === "(" || e.key === ")") {
    current = current + e.key;
    updateDisplay();
  }
});
