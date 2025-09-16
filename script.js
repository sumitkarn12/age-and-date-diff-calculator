dayjs.extend(dayjs_plugin_advancedFormat);

// Get the HTML elements
const modeRadios = document.querySelectorAll('input[name="mode"]');
const ageModeDiv = document.getElementById('age-mode');
const differenceModeDiv = document.getElementById('difference-mode');

const dobInput = document.getElementById('dob-input');
const fromDateInput = document.getElementById('from-date-input');
const toDateInput = document.getElementById('to-date-input');

const resultBox = document.getElementById('result-box');
const resultMessage = document.getElementById('result-message');
const resultText = document.getElementById('result-text');

const yearsSpan = document.getElementById('years-span');
const yearsText = document.getElementById('years-text');
const monthsSpan = document.getElementById('months-span');
const monthsText = document.getElementById('months-text');
const daysSpan = document.getElementById('days-span');
const daysText = document.getElementById('days-text');

// Initialize Flatpickr for the single date input (Age Mode)
flatpickr(dobInput, {
    dateFormat: "Y-m-d",
    maxDate: "today",
    onChange: function (selectedDates, dateStr) {
        if (dateStr) {
            calculateAge(dateStr);
        }
    }
});

// Initialize Flatpickr for the two date inputs (Difference Mode)
flatpickr(fromDateInput, {
    dateFormat: "Y-m-d",
    maxDate: "today",
    onChange: function (selectedDates, dateStr) {
        if (dateStr && toDateInput.value) {
            calculateDateDifference(dateStr, toDateInput.value);
        } else {
            hideResult();
        }
    }
});

flatpickr(toDateInput, {
    dateFormat: "Y-m-d",
    maxDate: "today",
    onChange: function (selectedDates, dateStr) {
        if (dateStr && fromDateInput.value) {
            calculateDateDifference(fromDateInput.value, dateStr);
        } else {
            hideResult();
        }
    }
});

// Function to update the UI based on the selected mode
function switchMode(mode) {
    if (mode === 'age') {
        ageModeDiv.style.display = 'block';
        differenceModeDiv.style.display = 'none';
        hideResult();
    } else {
        ageModeDiv.style.display = 'none';
        differenceModeDiv.style.display = 'block';
        hideResult();
    }
}

// Function to hide the result box
function hideResult() {
    resultBox.style.display = 'none';
}

// Main calculation function for Age Calculator mode
function calculateAge(dobString) {
    const birthDate = dayjs(dobString);
    const today = dayjs();

    if (birthDate.isAfter(today)) {
        displayError('Date of birth cannot be in the future.');
        return;
    }

    const years = today.diff(birthDate, 'year');
    const months = today.subtract(years, 'year').diff(birthDate, 'month');
    const days = today.subtract(years, 'year').subtract(months, 'month').diff(birthDate, 'day');

    displayResult('You are:', years, months, days);
}

// Main calculation function for Date Difference mode
function calculateDateDifference(fromStr, toStr) {
    const fromDate = dayjs(fromStr);
    const toDate = dayjs(toStr);

    if (fromDate.isAfter(toDate)) {
        displayError('The start date cannot be after the end date.');
        return;
    }

    const years = toDate.diff(fromDate, 'year');
    const months = toDate.subtract(years, 'year').diff(fromDate, 'month');
    const days = toDate.subtract(years, 'year').subtract(months, 'month').diff(fromDate, 'day');

    displayResult('The difference is:', years, months, days);
}

// Function to display the calculation result with improved grammar
function displayResult(message, years, months, days) {
    resultMessage.textContent = '';
    resultText.textContent = message;

    yearsSpan.textContent = years;
    monthsSpan.textContent = months;
    daysSpan.textContent = days;

    // Use a helper function to set the correct singular/plural text
    yearsText.textContent = years === 1 ? 'year' : 'years';
    monthsText.textContent = months === 1 ? 'month' : 'months';
    daysText.textContent = days === 1 ? 'day' : 'days';

    resultBox.style.display = 'block';
}

// Function to display an error message
function displayError(message) {
    resultMessage.textContent = message;
    resultBox.style.display = 'block';
    resultText.textContent = '';
    yearsSpan.textContent = 0;
    monthsSpan.textContent = 0;
    daysSpan.textContent = 0;
    yearsText.textContent = 'years';
    monthsText.textContent = 'months';
    daysText.textContent = 'days';
}

// Event listener for mode change
modeRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        switchMode(event.target.value);
    });
});