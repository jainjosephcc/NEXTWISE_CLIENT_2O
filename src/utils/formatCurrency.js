// src/utils/formatCurrency.js
export function formatCurrencyWithSymbol(value) {
    if (value === null || value === undefined) {
      // Handling null or undefined by returning $ 0.00 or any other placeholder you prefer
      return '$ -';  // or return '$ 0.00'; if you want to treat null/undefined as 0
    }
    
    const number = parseFloat(value);
    // Ensuring NaN (not a number) falls back to 0.00 if the input is non-numeric
    if (isNaN(number)) {
      return '$ 0.00';
    }
    
    return `$ ${number.toFixed(2)}`;
  }
  

  // Function to format datetime as "28 Apr 2024, 10:10 PM"
  function formatFullDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Function to format time as "10:10 PM"
function formatTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function formatLargeNumber(value) {
  if (value === null || value === undefined) {
    return '$ -';
  }

  const number = parseFloat(value);
  if (isNaN(number)) {
    return '$ 0.00';
  }

  if (number >= 1000) {
    return `$ ${(number / 1000).toFixed(0)}K`;
  }

  return `$ ${number.toFixed(2)}`;
}

function formatToTwoDecimalPlaces(value) {
    if (value === null || value === undefined) {
        return '-';
    }

    const number = parseFloat(value);
    if (isNaN(number)) {
        return '0.00';
    }

    return `${number.toFixed(2)}`;
}
