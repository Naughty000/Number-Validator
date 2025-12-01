const operators = {
    jazz: {
        name: "Jazz",
        ranges: ["0300", "0301", "0302", "0303", "0304", "0305", "0306", "0307", "0308", "0309"],
        color: "operator-jazz"
    },
    telenor: {
        name: "Telenor",
        ranges: ["0340", "0341", "0342", "0343", "0344", "0345", "0346", "0347", "0348", "0349"],
        color: "operator-telenor"
    },
    ufone: {
        name: "Ufone",
        ranges: ["0330", "0331", "0332", "0333", "0334", "0335", "0336", "0337", "0338", "0339"],
        color: "operator-ufone"
    },
    zong: {
        name: "Zong",
        ranges: ["0310", "0311", "0312", "0313", "0314", "0315", "0316", "0317", "0318", "0319"],
        color: "operator-zong"
    },
    warid: {
        name: "Warid (now Jazz)",
        ranges: ["0320", "0321", "0322", "0323", "0324", "0325", "0327"],
        color: "operator-warid"
    }
};

let validationHistory = JSON.parse(localStorage.getItem('validationHistory')) || [];

const numberInput = document.getElementById('number');
const checkBtn = document.getElementById('check_btn');
const clearBtn = document.getElementById('clear_btn');
const resultsContainer = document.getElementById('space');
const initialSpace = document.getElementById('initial-space');
const statusLight = document.getElementById('statusLight');
const statusText = document.getElementById('statusText');
const pasteBtn = document.getElementById('pasteBtn');
const historyList = document.getElementById('historyList');

document.addEventListener('DOMContentLoaded', function() {
    loadValidationHistory();
    setupEventListeners();
    console.log("Application initialized");
});

function setupEventListeners() {
    checkBtn.addEventListener('click', validateNumber);
    clearBtn.addEventListener('click', clearInput);
    pasteBtn.addEventListener('click', pasteFromClipboard);
    numberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateNumber();
        }
    });
    
    numberInput.addEventListener('input', function() {
        const number = this.value.trim();
        if (number.length > 0) {
            updateStatus('typing', 'Checking format...');
        } else {
            updateStatus('ready', 'Ready to validate');
        }
    });
}

function updateStatus(type, message) {
    statusText.textContent = message;
    
    switch(type) {
        case 'ready':
            statusLight.style.backgroundColor = '#e9c46a';
            break;
        case 'typing':
            statusLight.style.backgroundColor = '#f4a261';
            break;
        case 'valid':
            statusLight.style.backgroundColor = '#2a9d8f';
            break;
        case 'invalid':
            statusLight.style.backgroundColor = '#e63946';
            break;
    }
}

function validateNumber() {
    const input = numberInput.value.trim();
    console.log("Validating:", input);
    
    if (!input) {
        showError('Please enter a phone number');
        return;
    }
    
    const cleanedNumber = cleanNumber(input);
    console.log("Cleaned number:", cleanedNumber);
    
    if (!isValidPakistaniNumber(cleanedNumber)) {
        showError('Invalid Pakistani number format');
        return;
    }
    
    const prefix = extractPrefix(cleanedNumber);
    console.log("Extracted prefix:", prefix);
    
    const operatorInfo = identifyOperator(prefix);
    console.log("Identified operator:", operatorInfo);
    
    const formattedNumber = formatNumber(cleanedNumber);
    
    displayResults(formattedNumber, operatorInfo, prefix);
    addToHistory(formattedNumber, operatorInfo);
    updateStatus('valid', 'Valid Pakistani Number');
}

function cleanNumber(number) {
    return number.replace(/\s+/g, '').replace(/[-()]/g, '');
}

function isValidPakistaniNumber(number) {
    const patterns = [
        /^0?3[0-6][0-9]{8}$/,
        /^\+920?3[0-6][0-9]{8}$/,
        /^923[0-6][0-9]{8}$/,
        /^00923[0-6][0-9]{8}$/
    ];
    
    const isValid = patterns.some(pattern => pattern.test(number));
    console.log("Validation result:", isValid);
    return isValid;
}

function extractPrefix(number) {
    let cleanNum = number;
    console.log("Extracting prefix from:", cleanNum);
    
    if (cleanNum.startsWith('+92')) {
        cleanNum = cleanNum.substring(3);
        console.log("Removed +92, remaining:", cleanNum);
    } else if (cleanNum.startsWith('92')) {
        cleanNum = cleanNum.substring(2);
        console.log("Removed 92, remaining:", cleanNum);
    } else if (cleanNum.startsWith('0092')) {
        cleanNum = cleanNum.substring(4);
        console.log("Removed 0092, remaining:", cleanNum);
    }
    
    
    
    const prefix = cleanNum.substring(0, 4);
    console.log("Final prefix:", prefix);
    return prefix;
}

function identifyOperator(prefix) {
    console.log("Identifying operator for prefix:", prefix);
    
    for (const [operatorKey, operatorData] of Object.entries(operators)) {
        console.log(`Checking ${operatorData.name}:`, operatorData.ranges);
        
        if (operatorData.ranges.includes(prefix)) {
            console.log("✓ Found operator:", operatorData.name);
            return operatorData;
        }
    }
    
    console.log("✗ No operator found for prefix:", prefix);
    
    return {
        name: "Unknown Operator",
        color: "operator-unknown"
    };
}

function formatNumber(number) {
    let cleanNum = number;
    
    if (cleanNum.startsWith('+92')) {
        cleanNum = cleanNum.substring(3);
    } else if (cleanNum.startsWith('92')) {
        cleanNum = cleanNum.substring(2);
    } else if (cleanNum.startsWith('0092')) {
        cleanNum = cleanNum.substring(4);
    }
    
    return `+92 ${cleanNum.substring(0, 3)} ${cleanNum.substring(3)}`;
}

function displayResults(number, operator, prefix) {
    console.log("Displaying results:", { number, operator, prefix });
    
    initialSpace.style.display = 'none';
    
    const resultsHTML = `
        <div class="result-item">
            <div class="result-title">
                <i class="fas fa-mobile-alt"></i>
                Phone Number:
                <span class="result-value">${number}</span>
            </div>
        </div>
        <div class="result-item">
            <div class="result-title">
                <i class="fas fa-sim-card"></i>
                Network Operator:
                <span class="operator-badge ${operator.color}">${operator.name}</span>
            </div>
        </div>
        <div class="result-item">
            <div class="result-title">
                <i class="fas fa-hashtag"></i>
                Number Prefix:
                <span class="result-value">${prefix}</span>
            </div>
        </div>
        <div class="result-item">
            <div class="result-title">
                <i class="fas fa-check-circle"></i>
                Validation Status:
                <span class="result-value" style="color: #2a9d8f;">Valid Pakistani Number</span>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = resultsHTML;
}

function showError(message) {
    initialSpace.style.display = 'none';
    
    const errorHTML = `
        <div class="result-item">
            <div class="result-title">
                <i class="fas fa-exclamation-triangle"></i>
                Validation Error:
            </div>
            <div class="result-value" style="color: #e63946; background: rgba(230, 57, 70, 0.1);">
                ${message}
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = errorHTML;
    updateStatus('invalid', 'Invalid Number');
}

function clearInput() {
    numberInput.value = '';
    resultsContainer.innerHTML = '<div id="initial-space" class="initial-state"><i class="fas fa-search icon-large"></i><p class="initial-text">Enter a number to validate</p></div>';
    initialSpace.style.display = 'flex';
    updateStatus('ready', 'Ready to validate');
}

function pasteFromClipboard() {
    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText()
            .then(text => {
                numberInput.value = text;
                numberInput.focus();
                updateStatus('typing', 'Pasted from clipboard');
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
                showError('Cannot access clipboard. Please paste manually.');
            });
    } else {
        showError('Clipboard access not supported. Please paste manually.');
    }
}

function addToHistory(number, operator) {
    const historyItem = {
        number: number,
        operator: operator.name,
        operatorClass: operator.color,
        timestamp: new Date().toLocaleString()
    };
    
    validationHistory.unshift(historyItem);
    
    if (validationHistory.length > 10) {
        validationHistory = validationHistory.slice(0, 10);
    }
    
    localStorage.setItem('validationHistory', JSON.stringify(validationHistory));
    loadValidationHistory();
}

function loadValidationHistory() {
    if (validationHistory.length === 0) {
        historyList.innerHTML = '<div class="history-item"><span>No validation history yet</span></div>';
        return;
    }
    
    historyList.innerHTML = validationHistory.map(item => `
        <div class="history-item">
            <span class="history-number">${item.number}</span>
            <span class="history-operator ${item.operatorClass}">${item.operator}</span>
        </div>
    `).join('');
}



