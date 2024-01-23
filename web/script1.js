let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let resetScreen = false;

const numberButtons = document.querySelectorAll('.number-button');
const operatorButtons = document.querySelectorAll('.operator-button');
const clearButton = document.getElementById('clear-button');
const deleteButton = document.getElementById('delete-button');
const operateButton = document.querySelector('.operate-button');
const currentScreen = document.querySelector('.screen-current');

window.addEventListener('keydown', keyboardInput);

currentScreen.textContent = '0';

numberButtons.forEach((button => 
    button.addEventListener('click', () => appendNumberToScreen(button.textContent)))
);

operatorButtons.forEach((button => 
    button.addEventListener('click', () => setOperator(button.textContent)))
);

clearButton.addEventListener('click', () => clearScreen());
deleteButton.addEventListener('click', deleteNumber);

function deleteNumber() {
    currentScreen.textContent = currentScreen.textContent.slice(0,-1)
    if(currentScreen.textContent == ''){
        currentScreen.textContent = '0';
    }
}

operateButton.addEventListener('click', evaluate);

function appendNumberToScreen(number) {
    if(resetScreen || currentScreen.textContent == '0') {
        currentScreen.textContent = '';
        resetScreen = false;
    }
    currentScreen.textContent += number;
}

function clearScreen() {
    currentScreen.textContent = '0';
    firstOperand = '';
    secondOperand = '';
    currentOperation = null;
    resetScreen = false;
}

function setOperator(operator) {
    if (currentOperation !== null) {
        // If an operation is already in progress, wait for the second operand
        return;
    }

    if (firstOperand === '') {
        // If there's no first operand, set it and store the operator for future evaluation
        firstOperand = currentScreen.textContent;
        currentOperation = operator;
    } else {
        // If there's a first operand, set the operator and evaluate the expression
        currentOperation = operator;
        evaluate();
    }

    resetScreen = true;
}

function evaluate() {
    if (currentOperation === null) return;
    if (currentOperation === "SQRT" || currentOperation === "X^2") {
        const result = operate(currentOperation, firstOperand, secondOperand);
        saveToHistory(result);
        currentScreen.textContent = result; // Update the screen with the result
        resetScreen = true;
        currentOperation = null;
        return;
    }
    secondOperand = currentScreen.textContent;
    const result = operate(currentOperation, firstOperand, secondOperand);
    saveToHistory(result);
    currentScreen.textContent = result; // Update the screen with the result

    // Update the expression and result in localStorage
    localStorage.setItem('expression', `${firstOperand} ${currentOperation} ${secondOperand}`);
    localStorage.setItem('result', result);

    resetScreen = true;
    currentOperation = null;
}

function keyboardInput(e) {
    if (e.key >= 0 && e.key <=9 || e.key === '.') appendNumberToScreen(e.key);
    if (e.key === '=' || e.key === 'Enter') evaluate()
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clearScreen();
    if (e.key === '/' || e.key === '+' || e.key === '-' || e.key === '*' || e.key === '^' || e.key === 'q') 
        setOperator(convertOperator(e.key));
}

function convertOperator(operator) {
    if (operator === '/') return '/';
    if (operator === '+') return '+';
    if (operator === '-') return '-';
    if (operator === '*') return 'x';
    // if (operator === '^') return 'X^';
    // if (operator === 'q') return 'SQRT';
}

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    result = 0;

    try {
        switch (operator) {
            case '/':
                if (b === 0) {
                    throw new Error("Cannot divide by zero");
                } else {
                    result = divide(a, b);
                }
                break;
            case '÷':
                if (b === 0) {
                    throw new Error("Cannot divide by zero");
                } else {
                    result = divide(a, b);
                }
                break;
            case 'x':
                result = multiply(a, b);
                break;
            case '+':
                result = add(a, b);
                break;
            case '-':
                result = subtract(a, b);
                break;
            case 'X^':
                result = power(a, b);
                break;
            case 'SQRT':
                result = squareRoot(a);
                break;
            case 'X^2':
                result = squareNumber(a);
                break;
            case '%':
                result = modulo(a, b);
                break;
            default:
                throw new Error("Invalid operator");
        }

        if (result == null || isNaN(result)) {
            throw new Error("Invalid expression");
        } else {
            result = parseFloat(result.toFixed(2));
            localStorage.setItem('expression', `${a} ${operator} ${b} = ${result}`);
            localStorage.setItem('result', result);
            return result;
        }
    } catch (error) {
        // Handle the error and display a message
        showError(error.message);
        addToHistory(`${a} ${operator} ${b}`, error.message); // Pass the error message to addToHistory
        return null; // Return null to indicate an error
    }
}

function showError(message) {
    // Display the error message on the screen or handle it as needed
    alert(message); // For simplicity, using alert to display the error message
}

function add(num1, num2){
    return num1 + num2;
}

function subtract(num1, num2){
    return num1 - num2;
}

function multiply(num1, num2){
    return num1 * num2;
}

function divide(num1, num2){
    return num1 / num2;
}

function modulo(num1, num2) {
    return num1 % num2;
}

// Modify the function to populate the history table
function addToHistory(expression, result) {
    const historyList = document.getElementById('history-list');
    const newRow = historyList.insertRow();

    // Add cells to the row
    const cellNumber = newRow.insertCell(0);
    const cellExpression = newRow.insertCell(1);
    const cellResult = newRow.insertCell(2);

    // Set cell values
    cellNumber.textContent = entryNumber;
    cellExpression.textContent = expression;
    
    // Check if the result is an error message
    if (isNaN(result)) {
        cellResult.textContent = "Error: " + result; // Display error message
    } else {
        cellResult.textContent = result;
    }

    // Increment the entry number
    entryNumber++;
}

fetchAndDisplayHistory();

function fetchAndDisplayHistory() {
    let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

    // Display history in a table or another suitable format
    let historyTableBody = document.getElementById('history-list');
    historyTableBody.innerHTML = ''; // Clear existing content

    history.forEach((entry, index) => {
        let row = historyTableBody.insertRow(0);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);

        cell1.textContent = history.length - index;

        cell2.textContent = entry.expression;
        cell3.textContent = entry.result;
    });
}

// Add this event listener to the equals button
const equalsButton = document.querySelector('.operate-button');
equalsButton.addEventListener('click', () => {
    evaluateExpression();
    fetchAndDisplayHistory(); // Fetch and display history after evaluating an expression
});

// Modify the saveToHistory function to include calculator history
function saveToHistory(result) {
    let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];
    history.unshift({
        expression: `${firstOperand} ${currentOperation} ${secondOperand}`,
        result: result,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("calculatorHistory", JSON.stringify(history.slice(0, 10))); // Limit to the last 10 entries, adjust as needed

    // Fetch and display the updated history
    fetchAndDisplayHistory();
}

document.getElementById('reset-history-button').addEventListener('click', resetHistory);

// Function to reset the calculator history
function resetHistory() {
    const historyList = document.getElementById('history-list');
    // Clear the history list
    historyList.innerHTML = '';

    // Remove the stored calculator history from local storage
    localStorage.removeItem('calculatorHistory');
    
    // Reset the entry number
    entryNumber = 1;
}

let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
closeBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("open");
  menuBtnChange();//calling the function(optional)
});
searchBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the search iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});
// following are the code to change sidebar button(optional)
function menuBtnChange() {
 if(sidebar.classList.contains("open")){
   closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
 }else {
   closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
 }
}

let entryNumber = 1;

// Function to add entries to the calculator history
function addToHistory(expression, result) {
const historyTable = document.getElementById('history-table');
const historyList = document.getElementById('history-list');

// Create a new row
const newRow = historyList.insertRow();

// Add cells to the row
const cellNumber = newRow.insertCell(0);
const cellExpression = newRow.insertCell(1);
const cellResult = newRow.insertCell(2);

// Set cell values
cellNumber.textContent = entryNumber;
cellExpression.textContent = expression;
cellResult.textContent = result;

// Increment the entry number
entryNumber++;
}

// Function to evaluate the calculator expression
function evaluateExpression() {
    const expression = document.querySelector('.screen-current').textContent;
  
    try {
      const result = eval(expression);
      addToHistory(expression, result); // Move this line here
      return result;
    } catch (error) {
      console.error('Error evaluating expression:', error);
    }
  }
  


