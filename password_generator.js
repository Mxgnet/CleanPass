document.getElementById('generate-btn').addEventListener('click', generatePassword);
document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

function generatePasswordSegment(includeNumbers) {
    let firstLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    let vowel = 'aeiou'[Math.floor(Math.random() * 5)];
    let thirdLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    let fourthLetter = includeNumbers ? Math.floor(Math.random() * 10).toString() : String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    return firstLetter + vowel + thirdLetter + fourthLetter;
}

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
