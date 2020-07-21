const passwordOutput = document.querySelector('#password');
const passwordList = document.querySelector('#passwords-list');


const generateBtn = document.querySelector('input[type=submit]');
generateBtn.setAttribute('disabled', true);

const numberOfWords = document.querySelector('#numberOfWords');

// Array of words that will be used to build password
// phrase
let wordsArray = null;
const minNumWords = 1;
const maxNumWords = 4;

fetch('./words.txt')
  .then(resp => resp.text())
  .then(text => text.split('\n'))
  .then(array => {
    wordsArray = array;
    generateBtn.removeAttribute('disabled');
  })
  .catch(err => console.log(err));

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

generateBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  const numWords = parseInt(numberOfWords.value, 10);
  // Basic error checking...
  if (isNaN(numWords) ||
    numWords < minNumWords ||
    numWords > maxNumWords) {
    return null;
  }
  let passwordString = ``;
  for (let i = 0; i < numWords; i++) {
    let word = getRandomItem(wordsArray);
    passwordString += `${word} `;
  }
  passwordString = passwordString.trimEnd();
  passwordOutput.value = passwordString;
  const listItem = document.createElement('li');
  listItem.innerText = passwordString;
  passwordList.appendChild(listItem);
});



