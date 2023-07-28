// Attach event listeners to buttons
document.getElementById('generate-btn').addEventListener('click', generatePassword);
document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

// Function to generate a random character from a given string
function randomCharacter(str) {
    return str[Math.floor(Math.random() * str.length)];
}

// Function to generate a random password segment
function generatePasswordSegment(includeNumbers) {
    let firstLetter = randomCharacter('BCDEFGHJKMNPQRSTVWXYZ');  // Exclude confusing letters
    let vowel = randomCharacter('AEIOU');
    let thirdLetter = randomCharacter('bcdfghjkmnpqrstvwxyz');  // Exclude confusing letters and vowels
    let fourthCharacter;
    if (includeNumbers) {
        // Select a random even number from [2, 4, 6, 8]
        fourthCharacter = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
    } else {
        fourthCharacter = randomCharacter('bcdfghjkmnpqrstvwxyz');  // Exclude confusing letters
    }
    return firstLetter + vowel + thirdLetter + fourthCharacter;
}

// Function to generate a complete password
function generatePassword() {
    let numSegments = document.querySelector('input[name="num-segments"]:checked').value;
    let specialCharacters = document.getElementById('special-characters').checked;
    let includeNumbers = document.getElementById('include-numbers').checked;
    let password = '';
    for (let i = 0; i < numSegments; i++) {
        password += generatePasswordSegment(includeNumbers);  // Include 'includeNumbers' parameter
        if (specialCharacters && i < numSegments - 1) {
            password += '@#'[Math.floor(Math.random() * 2)];
        }
    }
    let passwordDisplay = document.getElementById('password-display');
    passwordDisplay.innerText = password;
    passwordDisplay.style.opacity = "0";
    setTimeout(function() {
        passwordDisplay.style.opacity = "1";
    }, 100);
}

function copyToClipboard() {
    let password = document.getElementById('password-display').innerText;
    navigator.clipboard.writeText(password).then(function() {
        let copyButton = document.getElementById('copy-btn');
        copyButton.innerText = 'Copied!';
        setTimeout(function() {
            copyButton.innerText = 'Copy to Clipboard';
        }, 1500);
        copyButton.style.backgroundColor = "#28a745";
        setTimeout(function() {
            copyButton.style.backgroundColor = "#007bff";
        }, 1500);
    }, function(err) {
        console.error('Could not copy password: ', err);
    });  // removed trailing comma here
}

