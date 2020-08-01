# List in which to store words read from words.txt file
words = []

# Open the words.txt file
with open('words.txt') as f:
  # Read each line of the file
    for line in f:
      # A word is on each line in the file so append it to the words list, but first remove the newline character from the right-hand end of it first
      words.append(line.rstrip())

# How many words are there to test?
print('Number of words to test is:', len(words))

# This function takes a word and compares the characters at each end of it, if they match the next set of characters are tested (the second one and the second to last one). This process is continued until a mismatch is found or the middle of the word is reached. If it is the word is a palindrome and True is returned
def is_palindrome(word):
  word_length = len(word)
  # The maximum index value is half the number of characters in the word
  # The // division operator results in integer division i.e. any decimal part is discarded
  # This will happen when the word contains an odd number of characters
  limit = word_length // 2
  index = 0
  while word[index] == word[-(1 + index)] and index < limit:    
    index += 1

  if index == limit:
    return True
  else:
    return False

print('Palindromes in UNIX words.txt file are...\n')
num_words = len(words)
for i in range(num_words):
  result = is_palindrome(words[i].lower())
  if result == True:
    print(words[i])