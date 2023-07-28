// Grab button elements from the DOM
document.getElementById('generate-btn').addEventListener('click', generatePassword);
document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

// Function to generate a random character from a given string
function randomCharacter(characters) {
    return characters[Math.floor(Math.random() * characters.length)];
}

// Function to generate a single segment of the password
function generatePasswordSegment(includeNumbers) {
    let firstCharacter = randomCharacter('ABCDEFGHJKMNPQRSTUVWXYZ'); // Removed confusing letters
    let secondCharacter = randomCharacter('aeiou');
    let thirdCharacter = randomCharacter('bcdfghjkmnpqrstvwxyz'); // Ensuring the third character is not a vowel
    let fourthCharacter;
    if (includeNumbers) {
        fourthCharacter = [2, 4, 6, 8][Math.floor(Math.random() * 4)].toString(); // Even number when numbers are enabled
    } else {
        fourthCharacter = randomCharacter('bcdfghjkmnpqrstvwxyz');
    }
    return firstCharacter + secondCharacter + thirdCharacter + fourthCharacter;
}

// Function to generate the full password
function generatePassword() {
    let numSegments = document.querySelector('input[name="num-segments"]:checked').value;
    let specialCharacters = document.getElementById('special-characters').checked;
    let includeNumbers = document.getElementById('include-numbers').checked;
    let password = '';
    for (let i = 0; i < numSegments; i++) {
        password += generatePasswordSegment(includeNumbers);
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

// Function to copy the generated password to the clipboard
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
    });
}
