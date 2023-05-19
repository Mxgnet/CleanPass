// Add an event listener to the "Generate Password" button. When clicked, it triggers the generatePassword function.
document.getElementById('generate-btn').addEventListener('click', generatePassword);

// Similarly, when the input for the number of segments changes, it also triggers the generatePassword function.
document.getElementById('num-segments').addEventListener('input', generatePassword);

// Add an event listener to the "Copy to Clipboard" button. When clicked, it triggers the copyToClipboard function.
document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

// This function generates a single password segment, consisting of a capital letter, a vowel, and two lowercase letters.
function generatePasswordSegment() {
    // Generate a random uppercase letter.
    let firstLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    
    // Randomly select a vowel.
    let vowel = 'aeiou'[Math.floor(Math.random() * 5)];

    // Generate two random lowercase letters.
    let rest = '';
    for (let i = 0; i < 2; i++) {
        rest += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    }
    // Return the concatenation of the uppercase letter, vowel, and two lowercase letters.
    return firstLetter + vowel + rest;
}

// This function generates the entire password, consisting of a specified number of segments and possibly including special characters.
function generatePassword() {
    // Get the number of segments from the input element.
    let numSegments = document.getElementById('num-segments').value;

    // Check if the user wants to include special characters.
    let specialCharacters = document.getElementById('special-characters').checked;

    // Validate the input: it should be a number between 1 and 3.
    if (numSegments < 1 || numSegments > 3) {
        alert("Number of segments should be between 1 and 3.");
        return;
    }
    // Initialize an empty string to build the password.
    let password = '';

    // Generate each segment.
    for (let i = 0; i < numSegments; i++) {
        password += generatePasswordSegment();

        // If special characters are to be included, add a random special character after each segment except the last one.
        if (specialCharacters && i < numSegments - 1) {
            password += '!@#$'[Math.floor(Math.random() * 4)];
        }
    }
    // Get the password display element
    let passwordDisplay = document.getElementById('password-display');
    // Display the generated password on the webpage.
    passwordDisplay.innerText = password;
    
    // Add a brief animation to make the transition more visually pleasing.
    passwordDisplay.style.opacity = "0";
    setTimeout(function() {
        passwordDisplay.style.opacity = "1";
    }, 100);
}

// This function copies the generated password to the clipboard.
function copyToClipboard() {
    // Get the generated password from the webpage.
    let password = document.getElementById('password-display').innerText;
    
    // Get the Copy to Clipboard button
    let copyButton = document.getElementById('copy-btn');

    // Use the Clipboard API to write the password to the clipboard.
    navigator.clipboard.writeText(password).then(function() {
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

    // Select the password text when the user clicks the "Copy to Clipboard" button.
    window.getSelection().selectAllChildren(document.getElementById('password-display'));
}

