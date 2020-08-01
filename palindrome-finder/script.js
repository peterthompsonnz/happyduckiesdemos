fetch("./words.txt")
  .then((resp) => resp.text())
  .then((text) => {
    const array = text.split("\n");
    let content = "";
    array.forEach((word) => {
      const result = isPalindrome(word);
      if (result) {
        content += word + ", ";
      }
    });
    // Chop off last formatting characters ', '
    content = content.slice(0, content.length - 2);
    displayOnPage(content);
  })
  .catch((err) => console.log(err.message));

function isPalindrome(word) {
  word = word.toLowerCase();
  const word_length = word.length;
  // Remove any decimal part of division
  const limit = (word_length / 2) | 0;
  let index = 0;
  while (word[index] === word[word_length - 1 - index] && index < limit) {
    index += 1;
  }
  if (index === limit) {
    return true;
  }
  return false;
}

function displayOnPage(text) {
  document.querySelector("#container").innerText = text;
}
