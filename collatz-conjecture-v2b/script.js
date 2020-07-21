// Get a reference to the element on the web page that displays the result of the calculation
const result = document.getElementById("result");

// Get a reference to the input type=button on the page
const testBtn = document.querySelector('input[type=button]');
// Add a click event handling function. It will be fired when the button is clicked
testBtn.addEventListener('click', test);

// Two utility functions
function isEven(n) {
  return n % 2 == 0;
}

function isOdd(n) {
  return n % 2 !== 0;
}

function arrayToString(array, separator) {
  let str = ``;
  array.forEach(item => {
    str += `${item}${separator}`;
  });
  // Remove last instance of the separator character(s)
  str = str.slice(0, str.length - separator.length);
  return str;
}

function test() {
  // Clear result div
  result.innerText = "";
  let number = document.getElementById("input").value;
  // At this stage number is a string/text. Test to see if it is a representation of a number. If it is not display an error message in the result div and return/exit this function
  if (isNaN(number)) {
    result.innerText = "Please enter a Number - letters are not supported.";
    return;
  }
  // Convert number to an integer using the parseInt function. Exit the function if a number less than or equal to 1 has been entered
  number = parseInt(number, 10);
  if (number <= 1) {
    result.innerText = "Numbers less than or equal to 1 are not supported";
    return;
  }

  // Delay in milliseconds between each computation round
  const delay = 100;
  // String to contain sequence of numbers
  let sequence = ``;
  const separator = ', ';
  // Add the initial number
  sequence += `${number}${separator}`;

  const id = setInterval(() => {
    if (isEven(number)) {
      number = number / 2;
    } else {
      number = number * 3;      
      number = number + 1;
    }    
    sequence += `${number}${separator}`;
    result.innerText = `Number sequence: ` + sequence;
    if (number == 1) {
      // Remove last separator
      result.innerText = `Number sequence: ` + sequence.slice(0, sequence.length - separator.length);
      clearInterval(id);
    }
  }, delay); 
}


