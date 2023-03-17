const allCalcButtons = document.querySelectorAll(".button");
const layout = document.querySelector("#slider");

const equation = document.querySelector("#equation");
const results = document.querySelector("#result");

let a;
let b;
let equationLength;
let operationInUse = "none";
let calculationRunning = false;
let answerGiven = false;
let specialOperation;

layout.addEventListener("click", changeLayout);

const clear = document.querySelector("#clear");
clear.addEventListener("click", function() {
    a = b = undefined;
    operationInUse = "none";
    equation.textContent = "";
    results.textContent = "";
    calculationRunning = false;
    answerGiven = false;
    dot.disabled = false;
});

const backspace = document.querySelector("#backspace");
backspace.addEventListener("click", function() {
    let backspaced = equation.textContent.slice(0, -1);
    equation.textContent = `${backspaced}`;

    if (!backspaced.includes(".")) {
        dot.disabled = false;
    }
});

const numbers = document.querySelectorAll(".number");
for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener("click", function() {
        if(answerGiven) {
            clear.click();
        }
        equation.textContent += numbers[i].value;
    });
}

const dot = document.querySelector("#dot");
dot.addEventListener("click", () => dot.disabled = true);

const simpleOperations = document.querySelectorAll(".operation");
for (let i = 0; i < simpleOperations.length; i++) {
    simpleOperations[i].addEventListener("click", function() {
        dot.disabled = false;

        if (!isFirstNumberPresent()) {
            return;
        }
        // chaining operations without pressing =
        else if (isFullEquation() && answerGiven === false) {
            equals.click();
            simpleOperations[i].click();
            return;     
        }
        // chaining operations after pressing =
        else if (answerGiven) {
            operationInUse = simpleOperations[i].value;
            chainOperation();
            return;
        }
        
        if (calculationRunning) {
            equation.textContent = equation.textContent.slice(0, -3);
        }

        operationInUse = simpleOperations[i].value;
        calculationRunning = true;
        equation.textContent += ` ${operationInUse} `;
        equationLength = equation.textContent.length;
    });
}

const specialOperations = document.querySelectorAll(".special");
for (let i = 0; i < specialOperations.length; i++) {
    specialOperations[i].addEventListener("click", function() {
        let a = equation.textContent;

        if (answerGiven) {
            a = results.textContent;
            equation.textContent = results.textContent;
        }

        doSpecialOperation(specialOperations[i].value, a);
    });
}

const posNeg = document.querySelector("#pos-neg");
posNeg.addEventListener("click", function() {
    if (answerGiven) {
        return;
    }
    else if (isEquationEmpty()) {
        results.textContent = "Please enter a number first";
        answerGiven = true;
    }
    else if (operationInUse === "none") {
        let number = parseFloat(equation.textContent)
        equation.textContent = (number < 0) ? `${Math.abs(number)}` : `${-Math.abs(number)}`;
    }
    else {
        let firstPart = equation.textContent.slice(0,equationLength);
        let number = parseFloat(equation.textContent.slice(equationLength))
        equation.textContent = (number < 0) ? `${firstPart} ${Math.abs(number)}` : `${firstPart} ${-Math.abs(number)}`;
    }
});

const equals = document.querySelector("#equals");
equals.addEventListener("click", function() {
    dot.disabled = false;

    // clicking = with answer showing does not increment
    if (answerGiven) {
        return;
    }

    // if user presses enters only a number and presses =
    if (operationInUse === "none") {
        results.textContent = `${parseFloat(equation.textContent)}`;
        answerGiven = true;
        calculationRunning = false;  
        return;
    }

    calculateAnswer();
});


function divideByZero() {
    return (operationInUse === "\u{000F7}" && b === 0);
}


function isEquationEmpty() {
    return (equation.textContent === "");
}

function isFullEquation() {
    let lastTwoCharacters = parseInt(equation.textContent.slice(-2));
    if (includesOperation() && typeof lastTwoCharacters == "number" && !isNaN(lastTwoCharacters)) {
        return true;
    }
    return false;
}

function includesOperation() {
    const operators = ["^", "\u{02212}", "\u{000D7}", "\u{000F7}", "\u{0002B}"];
    return operators.some(operator => equation.textContent.includes(operator));
}

function isFirstNumberPresent() {
    if (isEquationEmpty() && operationInUse === "\u{02212}") {
        results.textContent = "Please use the +/- button";
        answerGiven = true;
        return false;
    }
    else if (isEquationEmpty()) {
        results.textContent = "Please enter a number first";
        answerGiven = true;
        return false;
    }
    return true;
}

function chainOperation() {
    let firstNumber = parseFloat(results.textContent);
    if (firstNumber > 9999999999) {
        firstNumber = toScientificNotation(firstNumber);
    }
    equation.textContent = `${firstNumber} ${operationInUse} `;
    results.textContent = "";
    
    answerGiven = false;
    calculationRunning = true;
    equationLength = equation.textContent.length;
}

function isFloat(a, b = 0) {
    return (a % 1 !== 0 || b % 1 !== 0);
}

function hasTooManyDecimals(n) {
    return (n * 10000) % 1 !== 0;
}

function toScientificNotation(n) {
    let numberOfDigits = Math.round(n).toString().length;
    let N = parseInt(numberOfDigits) - 10;
    let tenDigitNumber = Math.round(n / (10 ** N));
    let shortNumber = Math.round(tenDigitNumber / (10 ** 5)) / 10000;
    return `${shortNumber}e+${numberOfDigits - 1}`;
}

function calculate(a, b) {
    return (operationInUse === "\u{000D7}") ? a * b
         : (operationInUse === "\u{000F7}") ? a / b
         : (operationInUse === "\u{0002B}") ? a + b
         : (operationInUse === "\u{02212}") ? a - b
         : (operationInUse === "^") ? a ** b
         : parseFloat(results.textContent);
}

function calculateWithFloat(a, b) {
    const CF = 1000000;
    return (operationInUse === "\u{000D7}") ? (a * CF) * (b * CF) / (CF ** 2)
         : (operationInUse === "\u{000F7}") ? (a * CF) / (b * CF)
         : (operationInUse === "\u{0002B}") ? ((a * CF) + (b * CF)) / CF
         : (operationInUse === "\u{02212}") ? ((a * CF) - (b * CF)) / CF
         : (operationInUse === "^") ? a ** b
         : parseFloat(results.textContent);
}

function calculateAnswer() {
    a = parseFloat(equation.textContent);
    b = parseFloat(equation.textContent.slice(equationLength));

    let answer = isFloat(a, b) ? calculateWithFloat(a, b) : calculate(a, b);

    showAnswer(answer);
}

function showAnswer(answer) {
    if (divideByZero()) {
        answer = showRandomError();
    }
    else if (hasTooManyDecimals(answer)) {
        answer = Math.round(answer * 10000) / 10000;
    }

    if (answer > 9999999999 && answer < 1e21) {
        answer = toScientificNotation(answer);
    }
    else if (answer >= 1e21) {
        answer = "Huge Number";
    }

    results.textContent = `${answer}`;

    answerGiven = true;
    calculationRunning = false;
}

function showRandomError() {
    let roll = Math.floor(Math.random() * 4);
    return roll === 0 ? "I refuse."
         : roll === 1 ? "Please no..."
         : roll === 2 ? "......no"
         : "KABOOM!";
}

function doSpecialOperation(operation, n) {
    switch (operation) {
        case "!":
            if(!isFirstNumberPresent()) {
                equation.textContent += "0";
            }

            equation.textContent += "!";
            if (isFloat(n) || n < 0) {
                results.textContent = "Math Error";
                break;
            }

            showAnswer(calculateFactorial(n));
            break;
        case "%":
            if(!isFirstNumberPresent()) {
                equation.textContent += "0";
            }

            equation.textContent += "%";
            showAnswer(n / 100);
            break;
        case "\u{0221A}":
            if(!isFirstNumberPresent()) {
                equation.textContent += "0";
            }

            equation.textContent = `\u{0221A}${equation.textContent}`;
            if (n === "-1") {
                results.textContent = `\u{1D456}`;
                break;
            }
            else if (n < 0) {
                results.textContent = `\u{1D456}\u{0221A}${Math.abs(n)}`;
                break;
            }
            showAnswer(Math.sqrt(n));
            break;
        case "\u03C0":
            if(!isFirstNumberPresent() || equation.textContent === "1") {
                equation.textContent = "";
                n = 1;
            }
            equation.textContent += "\u{1D70B}";
            showAnswer(n * Math.PI);
            break;
    }
}

function calculateFactorial(n) {
    let total = 1;
    for (let i = 2; i <= n; i++) {
        total *= i;
    }
    return total;
}

// Layout functions
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