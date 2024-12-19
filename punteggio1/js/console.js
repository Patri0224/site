// Funzione per aggiungere testo al div
function appendToDiv(message, type = "log") {
    const logElement = document.createElement("div");
    logElement.textContent = `[${type.toUpperCase()}] ${message}`;
    logElement.style.color = type === "error" ? "red" : "lightgray";
    consoleDiv.appendChild(logElement);
}

// Sovrascrive console.log
console.log = function (...args) {
    originalLog.apply(console, args); // Mantiene il comportamento originale
    appendToDiv(args.join(" "), "log"); // Aggiunge al div
};

// Sovrascrive console.error
console.error = function (...args) {
    originalError.apply(console, args); // Mantiene il comportamento originale
    appendToDiv(args.join(" "), "error"); // Aggiunge al div
};