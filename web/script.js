// Include api for currency change
const api = "https://api.exchangerate-api.com/v4/latest/USD";

// Selecting different controls
let search = document.querySelector(".searchBox");
let convert = document.querySelector(".convert");
let fromCurrency = document.querySelector(".from");
let toCurrency = document.querySelector(".to");
let finalValue = document.querySelector(".finalValue");
let finalAmount = document.getElementById("finalAmount");

let resultFrom;
let resultTo;
let searchValue;

// Event when currency is changed
fromCurrency.addEventListener('change', (event) => {
    resultFrom = event.target.value;
});

// Event when currency is changed
toCurrency.addEventListener('change', (event) => {
    resultTo = event.target.value;
});

search.addEventListener('input', updateValue);

// Function for updating value
function updateValue(e) {
    searchValue = e.target.value;
}

// When user clicks, it calls function getResults 
convert.addEventListener("click", getResults);

// Function getResults
function getResults() {
    fetch(api)
        .then(response => response.json())
        .then(currency => displayResults(currency))
        .then(saveToHistory); // Save the conversion to history
}

// Display results after conversion
function displayResults(currency) {
    let fromRate = currency.rates[resultFrom];
    let toRate = currency.rates[resultTo];
    let convertedAmount = ((toRate / fromRate) * searchValue).toFixed(2);
    finalValue.innerHTML = `Converted Amount: ${resultTo} ${convertedAmount}`;
    finalAmount.style.display = "block";

    return {
        from: resultFrom,
        to: resultTo,
        amount: searchValue,
        convertedAmount: convertedAmount,
        date: new Date().toLocaleString()
    };
}

// Save conversion to local storage
function saveToHistory(conversion) {
    let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
    history.push(conversion);
    localStorage.setItem("conversionHistory", JSON.stringify(history));

    // Reload the page or update the history display
    fetchAndDisplayHistory();
}

