document.getElementById('generate-btn').addEventListener('click', generatePassword);
document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

// This function generates a single password segment, which consists of a capital letter, a vowel, and two lowercase letters.
function generatePasswordSegment() {
    // Generate a random uppercase letter.
    let firstLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);

    // Randomly select a vowel.
    let vowel = 'aeiou'[Math.floor(Math.random() * 5)];

    // Generate two random lowercase letters.
    let thirdLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    let fourthLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 97);

    // Concatenate the letters to form the password segment.
    return firstLetter + vowel + thirdLetter + fourthLetter;
}

// This function generates a password, which may consist of multiple segments.
function generatePassword() {
    // Get the selected number of segments from the radio buttons.
    let numSegments = document.querySelector('input[name="num-segments"]:checked').value;

    // Determine whether to include special characters between segments.
    let specialCharacters = document.getElementById('special-characters').checked;

    // Initialize an empty string to hold the password.
    let password = '';

    // Generate the required number of password segments.
    for (let i = 0; i < numSegments; i++) {
        password += generatePasswordSegment();

        // If the specialCharacters checkbox is checked and we're not on the last segment, add a random special character to the password.
        if (specialCharacters && i < numSegments - 1) {
            password += '!@#$'[Math.floor(Math.random() * 4)];
        }
    }

    // Display the generated password on the webpage.
    let passwordDisplay = document.getElementById('password-display');
    passwordDisplay.innerText = password;

    // Add an animation to draw the user's attention to the new password.
    passwordDisplay.style.opacity = "0";
    setTimeout(function() {
        passwordDisplay.style.opacity = "1";
    }, 100);
}

// This function copies the generated password to the clipboard.
function copyToClipboard() {
    // Get the generated password from the webpage.
    let password = document.getElementById('password-display').innerText;
    
    // Use the Clipboard API to write the password to the clipboard.
    navigator.clipboard.writeText(password).then(function() {
        // Get the Copy to Clipboard button
        let copyButton = document.getElementById('copy-btn');
        // If the write operation is successful, change the button text to indicate success.
        copyButton.innerText = 'Copied!';
        
        // Reset the button text after 1.5 seconds.
        setTimeout(function() {
            copyButton.innerText = 'Copy to Clipboard';
        }, 1500);
        
        // Add a brief animation to make the transition more visually pleasing.
        copyButton.style.backgroundColor = "#28a745"; // Change the button color to green when copied
        setTimeout(function() {
            copyButton.style.backgroundColor = "#007bff"; // Reset the color after 1.5 seconds
        }, 1500);
    }, function(err) {
        // If the write operation fails, display an error message.
        console.error('Could not copy password: ', err);
    });
}
