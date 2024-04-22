let titles = document.querySelectorAll('.hangman-word');

// Replace the text in each title with underscores
titles.forEach(title => {
    let word = title.textContent;
    let underscores = '';
    for (let i = 0; i < word.length; i++) {
        if (word[i] === ' ') {
            underscores += ' ';
        } else {
            underscores += '_';
        }
    }
    title.textContent = underscores;
    // store the original word in the title's data attribute
    title.dataset.word = word.toUpperCase();
});
let guessWordInput = document.getElementById('guess-word');
let hangmanWord = document.getElementById('hangman-word');
let word = hangmanWord.dataset.word;
guessWordInput.setAttribute('maxlength', word.length);

// Select all buttons
let buttons = document.querySelectorAll('.letter');

// Add event listener to each button
buttons.forEach(button => {
    button.addEventListener('click', function() {

        let letter = this.textContent;
        let found = false;

        // Check if the letter is in any of the words data attribute
        titles.forEach(title => {
            let word = title.dataset.word;
            let underscores = title.textContent;

            // If the letter is found, replace the underscore with the letter
            if (word.includes(letter)) {
                found = true;
                let newUnderscores = '';
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === letter) {
                        newUnderscores += letter;
                    } else {
                        newUnderscores += underscores[i];
                    }
                }
                title.textContent = newUnderscores;
            }
        });
        let guessesLeft = document.getElementById('guesses-left');
        // If the letter was found, turn the button green
        if (found) {
            this.style.backgroundColor = 'green';
            this.disabled = true;
        }
        // If the letter was not found, turn the button red
        else {
            this.style.backgroundColor = 'red';
            this.disabled = true;
            guessesLeft.textContent = parseInt(guessesLeft.textContent) - 1;
        }
         // Decrease the value of guesses-left
            // If the value of guesses-left is 0, display a message
            if (parseInt(guessesLeft.textContent) === 1) {
                // Disable all buttons
                buttons.forEach(button => {
                    button.disabled = true;
                });
            }
            
    });
});
// Select the input element for guessing the whole word
let guessInput = document.getElementById('guess-word');

// Select the submit button for guessing the whole word
let guessButton = document.getElementById('submit-guess');

// Add event listener to the submit button
guessButton.addEventListener('click', function() {
    let guessedWord = guessInput.value.toUpperCase();
    let correctGuess = false;

    // Check if the guessed word matches the hangman-word id
    let hangmanWord = document.getElementById('hangman-word');
    let word = hangmanWord.dataset.word;
    guessWordInput.setAttribute('maxlength', word.length);
    // If the guessed word matches, reveal the word and mark it as correct
    if (word.toUpperCase() === guessedWord.toUpperCase()) {
        hangmanWord.textContent = word;
        correctGuess = true;
    }
    let guessesLeft = document.getElementById('guesses-left');
    // If the guessed word is correct, fill the input field green and reveal all the words
    if (correctGuess) {
        guessInput.style.backgroundColor = 'green';
        titles.forEach(title => {
            title.textContent = title.dataset.word;
        });
    }
    else{
        guessesLeft.textContent = parseInt(guessesLeft.textContent) - 1;

    }
    if (parseInt(guessesLeft.textContent) === 1) {
        // Disable all buttons
        buttons.forEach(button => {
            button.disabled = true;
        });
    }
    if (parseInt(guessesLeft.textContent) === 0) {
    // Reveal the words
    titles.forEach(title => {
        title.textContent = title.dataset.word;
    });
}
    // Clear the input field
    guessInput.value = '';
});
