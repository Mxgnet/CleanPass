// Adding an event listener for the 'click' event on the "Generate Password" button.
document.getElementById('generate-btn').addEventListener('click', generatePassword);

// Adding an event listener for the 'click' event on the "Copy to Clipboard" button.
document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

// A function that generates a single segment of the password.
function generatePasswordSegment(includeNumbers) {
    // Generating the first character of the segment, which is a random upper-case letter excluding 'I' and 'L'.
    let firstLetter = 'ABCDEFGHJKMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)];

    // Generating the second character of the segment, which is a random vowel.
    let vowel = 'AEIOU'[Math.floor(Math.random() * 5)];

    // Generating the third character of the segment, which is a random lower-case consonant excluding 'l'.
    let thirdLetter = 'bcdfghjkmnpqrstvwxyz'[Math.floor(Math.random() * 21)];

    // Generating the fourth character of the segment. If includeNumbers is true, it is a random even number (2,4,6,8),
    // otherwise it is a random lower-case letter excluding 'i' and 'l'.
    let fourthLetter = includeNumbers ? '2468'[Math.floor(Math.random() * 4)] : 'abcdefghjkmnpqrstuvwxyz'[Math.floor(Math.random() * 23)];

    // Returning the combined segment, converting the vowel to lower case.
    return firstLetter + vowel.toLowerCase() + thirdLetter + fourthLetter;
}

// A function that generates the whole password.
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

    // Grabbing the password display element.
    let passwordDisplay = document.getElementById('password-display');

    // Setting the text of the password display to the generated password.
    passwordDisplay.innerText = password;

    // Setting the opacity of the password display to 0 for an animation effect.
    passwordDisplay.style.opacity = "0";

    // After 100 milliseconds, set the opacity of the password display back to 1 to complete the animation effect.
    setTimeout(function() {
        passwordDisplay.style.opacity = "1";
    }, 100);
}

// A function that copies the currently displayed password to the clipboard.
function copyToClipboard() {
    // Grabbing the current password from the password display.
    let password = document.getElementById('password-display').innerText;

    // Using the Clipboard API to write the password to the clipboard.
    navigator.clipboard.writeText(password).then(function() {
        // If the write is successful, update the text of the copy button to indicate success.
        let copyButton = document.getElementById('copy-btn');
        copyButton.innerText = 'Copied!';

        // After 1.5 seconds, revert the copy button text back to its original state.
        setTimeout(function() {
            copyButton.innerText = 'Copy to Clipboard';
        }, 1500);

        // Changing the background color of the copy button to green to indicate success.
        copyButton.style.backgroundColor = "#28a745";

        // After 1.5 seconds, revert the copy button color back to its original state.
        setTimeout(function() {
            copyButton.style.backgroundColor = "#007bff";
        }, 1500);
    }, function(err) {
        // If there was an error writing to the clipboard, log the error message to the console.
        console.error('Could not copy password: ', err);
    });
}
