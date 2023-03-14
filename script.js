const allCalcButtons = document.querySelectorAll(".button");
const layout = document.querySelector("#slider");

const operationScreen = document.querySelector("#operation");
const screen = document.querySelector("#result");

let a;
let b;
let operationInUse = "none";
let enteringNumbers = false;
let screenCleared;

layout.addEventListener("click", changeLayout);

const clear = document.querySelector("#clear");
clear.addEventListener("click", function() {
    a = b = undefined;
    operationInUse = "none";
    operationScreen.textContent = "";
    screen.textContent = "";
});

const backspace = document.querySelector("#backspace");
backspace.addEventListener("click", function() {
    let backspaced = screen.textContent.slice(0, -1);
    screen.textContent = `${backspaced}`;
});

const numbers = document.querySelectorAll(".number");
for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener("click", function() {
        if (operationInUse !== "none") {
            operationScreen.textContent = `${a} ${operationInUse}`;
        }
        if (!screenCleared) {
            screen.textContent = "";
            screenCleared = true;
        }

        screen.textContent += numbers[i].value
    });
}

const simpleOperations = document.querySelectorAll(".operation");
for (let i = 0; i < simpleOperations.length; i++) {
    simpleOperations[i].addEventListener("click", function() {
        if (chainOperations()) {
            equals.click();
        }

        operationInUse = simpleOperations[i].value;
        operationScreen.textContent = `${operationInUse}`;

        inCalculation = true;
        storeFirstNumber();
        b = undefined;
        screenCleared = false;
    });
}

const equals = document.querySelector("#equals");
equals.addEventListener("click", function() {
    storeSecondNumber();
    if (operationInUse !== "none") {
        operationScreen.textContent = `${a} ${operationInUse} ${b}`;
    }

    let answer = isFloat(a, b) ? calculateWithFloat(a, b) : calculate(a, b);
    if (hasManyDecimals(answer)) {
        answer = Math.round(answer * 100000) / 100000;
    }
    screen.textContent = `${answer}`;
});


function chainOperations() {
    return (a !== undefined && b === undefined && screen.textContent !== "");
}

function storeFirstNumber() {
    a = parseFloat(screen.textContent);
}

function storeSecondNumber() {
    b = parseFloat(screen.textContent);
}

function isFloat(a, b) {
    return (a % 1 !== 0 || b % 1 !== 0);
}

function hasManyDecimals(n) {
    return (n * 100000) % 1 !== 0;
}

function calculate(a, b) {
    return (operationInUse === "\u{000D7}") ? a * b
         : (operationInUse === "\u{000F7}") ? a / b
         : (operationInUse === "\u{0002B}") ? a + b
         : (operationInUse === "\u{02212}") ? a - b
         : parseFloat(screen.textContent);
}

function calculateWithFloat(a, b) {
    const CF = 1000000;
    return (operationInUse === "\u{000D7}") ? (a * CF) * (b * CF) / (CF ** 2)
         : (operationInUse === "\u{000F7}") ? (a * CF) / (b * CF)
         : (operationInUse === "\u{0002B}") ? ((a * CF) + (b * CF)) / CF
         : (operationInUse === "\u{02212}") ? (a * CF) - (b * CF) / CF
         : parseFloat(screen.textContent);
}

function changeLayout() {
    const extraButtons = document.querySelectorAll(".extra");
    extraButtons.forEach(extraButton => extraButton.classList.toggle("hidden"));

    allCalcButtons.forEach(button => {
        button.classList.toggle("basic");
        button.classList.toggle("extended");
    });

    toggleSlider();
}

function toggleSlider() {
    layout.classList.toggle("on");
    layout.firstChild.src = layout.classList.contains("on") ? "./images/ext-on.png" : "./images/ext-off.png";
}