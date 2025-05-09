let displayValue= "";
let currentOperation= null;
let firstOperand = null;

function appendNumber(number) {
    displayValue += number;
    updateDisplay();

}

function setOperation(operation) {
    if (currentOperation == null) {
        calculate();

    }
    firstOperand = parseFloat(displayValue);
    currentOperation = operation;
    displayValue = "";

}

function calculate() {
    if(currentOperation === null || displayValue === "") return;

    const secondOperand = parseFloat(displayValue);
    switch (currentOperation) {
        case '+':
            displayValue = (firstOperand + secondOperand).toString();
            break;
            case '-':
                displayValue = (firstOperand - secondOperand).toString();
                break;
                case '*':
                    displayValue = (firstOperand * secondOperand).toString();
                    break;
                    case '/':
                        displayValue = (firstOperand / secondOperand).toString();
                        break;                  
    }

    updateDisplay(); {
        currentOperation = null;
    }
}

function clearDisplay() {
    displayValue = "";
    currentOperation = null;
    firstOperand = null;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById("calc-display").value = displayValue;
}