const display = document.getElementById('display');
const subDisplay = document.getElementById('sub-display');
const notes = document.getElementById('notes');
const copyBtn = document.getElementById('copyBtn');
const themeToggle = document.getElementById('themeToggle');

let expr = '';

function updateDisplay() {
  display.value = expr || '';
  subDisplay.textContent = expr ? expr : '';
}

function append(char) {
  if (char === '.' && expr.slice(-1) === '.') return;
  expr += char;
  updateDisplay();
}

function clearAll() {
  expr = '';
  updateDisplay();
  notes.textContent = 'Cleared';
}

function backspace() {
  expr = expr.slice(0, -1);
  updateDisplay();
}

function safeEvaluate(input) {
  try {
    if (!/^[0-9+\-*/().\s]+$/.test(input)) throw new Error('Invalid');
    return Function('return ' + input)();
  } catch {
    throw new Error('Invalid expression');
  }
}

function compute() {
  if (!expr) return;
  try {
    const result = safeEvaluate(expr);
    expr = String(result);
    notes.textContent = 'Success';
    updateDisplay();
  } catch {
    display.value = 'Error';
    expr = '';
    notes.textContent = 'Error';
  }
}

document.querySelectorAll('.key').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.getAttribute('data-value');
    if (v === 'C') return clearAll();
    if (v === 'back') return backspace();
    if (v === '=') return compute();
    append(v);
  });
});

window.addEventListener('keydown', e => {
  const allowed = '0123456789+-*/().';
  if (allowed.includes(e.key)) append(e.key);
  if (e.key === 'Enter') compute();
  if (e.key === 'Backspace') backspace();
  if (e.key === 'Escape') clearAll();
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(display.value || '');
    notes.textContent = 'Copied';
  } catch {
    notes.textContent = 'Copy failed';
  }
});

themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  if (cur === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = 'Dark';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light';
  }
});

updateDisplay();
