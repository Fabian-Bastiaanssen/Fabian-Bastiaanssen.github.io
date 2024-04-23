let titles = document.querySelectorAll('.hangman-word');
let totalguesses = document.getElementById('guesses-left').textContent;
let correctguesses = 0;
// Read the values from cookies
let cookies = document.cookie.split(';');
let beatPuzzle = false;
let totalGuessesUsed = 0;
let winStreaks = 0;
let lastBeatPuzzle = new Date();
let scoreArray = [];
let winArray = [];
cookies.forEach(cookie => {
    let [key, value] = cookie.trim().split('=');
    if (key === 'beatPuzzle') {
        beatPuzzle = value === 'true';
    } else if (key === 'winStreaks') {
        winStreaks = parseInt(value);
    } else if (key === 'lastBeatPuzzle') {
        lastBeatPuzzle = new Date(value);
    } else if (key === 'scoreArray') {
        scoreArray = value.split(',');
    } else if (key === 'winArray') {
        winArray = value.split(',');
    }
});

// Check if the user has already beaten the puzzle today
if (beatPuzzle & params.get('rowType') !== 'random') {
    // Display a message indicating that the user has already beaten the puzzle
    let resultBox = document.getElementById('winner-box');
    let resultMessage = document.getElementById('winner-subtitle');
    let resultTitle = document.getElementById('winner-title');
    resultBox.classList.remove('is-hidden');
    resultTitle.textContent = 'Already Beat the Puzzle';
    resultMessage.textContent = 'You have already beaten the puzzle today!';
    let guessButton = document.getElementById('submit-guess');
    guessButton.disabled = true;
    let buttons = document.querySelectorAll('.letter');
    buttons.forEach(button => {
        button.disabled = true;
    });
    titles.forEach(title => {
            title.textContent = title.dataset.word;
        });
    
}


// Replace the text in each title with underscores
titles.forEach(title => {
    let word = title.dataset.word;
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
function checkGameStatus() {
    let hangmanWord = document.getElementById('hangman-word');
    let word = hangmanWord.dataset.word;
    let guessesLeft = document.getElementById('guesses-left');
    let resultBox = document.getElementById('winner-box');
    let resultMessages = document.getElementById('winner-subtitle');

    let params = new URLSearchParams(window.location.search);
    let finalguesses = parseInt(correctguesses) + parseInt(totalguesses) - parseInt(guessesLeft.textContent);
    if (!hangmanWord.textContent.includes('_')) {
    beatPuzzle = true;}
    let today = new Date();
        
    let oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    if (today.getTime() - lastBeatPuzzle.getTime() <= oneDay && beatPuzzle && params.get('rowType') !== 'random') {
        winStreaks++;
        scoreArray.push(finalguesses);
        winArray.push(beatPuzzle);
    }
    else if (parseInt(guessesLeft.textContent) ===0 && params.get('rowType') !== 'random'){
        winStreaks = 0;
        scoreArray.push(finalguesses);
        winArray.push(beatPuzzle);
    }
    


    // count the amount of wins in the winArray and divide by the length of the array
    let winPercentage = winArray.filter(Boolean).length / winArray.length;
    // save the cookies
    saveCookies(winStreaks, totalGuessesUsed, beatPuzzle, today, scoreArray, winArray);
    if (beatPuzzle) {
    
        // All letters are revealed, user won
        resultBox.classList.remove('is-hidden');
        let resultMessage = document.getElementById('winner-subtitle');
        let resultTitle = document.getElementById('winner-title');
        guessButton.disabled = true;

        resultTitle.textContent = 'Congratulations!';
        resultMessage.innerHTML = `
        You won using only ${finalguesses} guess(es).
        Your win streak is ${winStreaks}.
        Your win percentage is ${winPercentage * 100}%.
        Find more about this strain at <a href="${resultMessages.dataset.address}" target="_blank">${resultMessages.dataset.address}</a>
        `;
    } else if (parseInt(guessesLeft.textContent) === 0){
        // No guesses left, user lost
        resultBox.classList.remove('is-hidden');
        guessButton.disabled = true;
        beatPuzzle = false;
        let resultMessage = document.getElementById('winner-subtitle');
        let resultTitle = document.getElementById('winner-title');
        resultTitle.textContent = 'Game Over!';
        resultMessage.innerHTML = `The strain was "${word}". Find more about this strain at <a href="${resultMessages.dataset.address}" target="_blank">${resultMessages.dataset.address}</a>. Better luck next time!`;
}}

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
            correctguesses++;
            checkGameStatus()
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
        correctguesses++;
        checkGameStatus();
        titles.forEach(title => {
            title.textContent = title.dataset.word;
        });
        guessButton.disabled = true;
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
    checkGameStatus();

    titles.forEach(title => {
        title.textContent = title.dataset.word;
    });

}
    // Clear the input field
    guessInput.value = '';
});
// make dismiss-box button work and dismiss the winner-box
let dismissButton = document.getElementById('dismiss-box');
dismissButton.addEventListener('click', function() {
    let resultBox = document.getElementById('winner-box');
    resultBox.classList.add('is-hidden');
});
// make all buttons with random-mode class work and set the rowType parameter to random, reload the page
let randomButtons = document.querySelectorAll('.random-mode');
randomButtons.forEach(button => {
    button.addEventListener('click', function() {
        let newUrl = new URL(window.location.href);
        newUrl.searchParams.set('rowType', 'random');
        window.location.href = newUrl.toString();

    });
});


function saveCookies(winStreaks, totalGuessesUsed, beatPuzzle, today, scoreArray, winArray) {


    // Save document.cookie with expiry set to forever
    let expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 10); // Set expiry date to 10 years from now
    document.cookie = `beatPuzzle=${beatPuzzle}; expires=${expiryDate.toUTCString()}`;
    document.cookie = `winStreaks=${winStreaks}; expires=${expiryDate.toUTCString()}`;
    document.cookie = `lastBeatPuzzle=${today}; expires=${expiryDate.toUTCString()}`;
    document.cookie = `scoreArray=${scoreArray}; expires=${expiryDate.toUTCString()}`;
    document.cookie = `winArray=${winArray}; expires=${expiryDate.toUTCString()}`;
}

function shareGameResult(beatPuzzle, correctGuesses, wrongGuesses, gameMode) {
    let gameResult = beatPuzzle ? 'You won!' : 'Sorry, you lost.';
    let totalGuesses = parseInt(correctGuesses) + parseInt(wrongGuesses);
    let siteUrl = window.location.href;

    let shareText = `Game Result: ${gameResult}\n` +
                    `Right Guesses: ${'🟩'.repeat(correctGuesses)}\n` +
                    `Wrong Guesses: ${'🟥'.repeat(wrongGuesses)}\n` +
                    `Total Guesses: ${totalGuesses}\n` +
                    `Game Mode: ${gameMode}\n` +
                    `Play the game: ${siteUrl}`;

    navigator.clipboard.writeText(shareText).then(function() {
        console.log('Copying to clipboard was successful!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

// Attach this function to the share button
let shareButton = document.querySelector('.share');
shareButton.addEventListener('click', function() {
    gameMode = params.get('rowType')
    let correctGuesses = correctguesses
    let guessesLeft = document.getElementById('guesses-left');
    let finalguesses = parseInt(correctguesses) + parseInt(totalguesses) - parseInt(guessesLeft.textContent);
    let wrongGuesses = finalguesses - correctguesses
    shareGameResult(beatPuzzle, correctGuesses, wrongGuesses, gameMode);
});
