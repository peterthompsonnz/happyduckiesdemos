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

function test() {
  // Clear result div
  result.innerText = "";
  let number = document.getElementById("input").value;
  // At this stage number is a string/text. Test to see if it is a representation of a number. If it is not display an error message in the result div and return/exit this function
  if (isNaN(number)) {
    result.innerText = "Please Enter A Number - Letters are not supported.";
    return;
  }
  // Convert number to an integer using the parseInt function. Exit the function if 1 or 0 has been entered
  number = parseInt(number, 10);
  if (number === 1 || number === 0) {
    result.innerText = "1 or 0 not supported";
    return;
  }

  // Use an array to store the number sequence in as it can be easily converted into a string for display purposes
  const sequence = [];
  // Add the initial number to the array
  sequence.push(number);

  while (number !== 1) {     
    if (isEven(number)) {
      number = number / 2;           
    } else {
      number = number * 3;
      result.innerText = number;
      number = number + 1;           
    } 
    // Add number to the array
    sequence.push(number);     
  }
  // While loop has ended so update the text in the result div. The array toString method will converted the array contents into a string of values separated by commas
  result.innerText = sequence.toString();
}