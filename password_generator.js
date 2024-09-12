// Dark/Light Mode Toggle
document.getElementById('theme-toggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
});

// Segment selection buttons logic (replaces the radio buttons functionality)
const segmentButtons = document.querySelectorAll('.segment-option');

// Loop through each button and listen for clicks
segmentButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove the 'active' class from all buttons
        segmentButtons.forEach(btn => btn.classList.remove('active'));

        // Add the 'active' class to the clicked button
        this.classList.add('active');
    });
});

// Password generation logic - This generates the password based on user input
function generatePassword() {
    // Get the selected number of segments (either 2 or 3)
    const numSegments = document.querySelector('.segment-option.active').getAttribute('data-segments');
    
    // Get whether to include numbers and special characters
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSpecialChars = document.getElementById('special-characters').checked;

    // Character sets
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let characters = alphabet;
    if (includeNumbers) {
        characters += numbers;
    }

    // Generate the password
    let password = '';
    for (let i = 0; i < numSegments; i++) {
        let segment = '';
        for (let j = 0; j < 4; j++) { // Assuming each segment is 4 characters long
            segment += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        password += segment;

        // Add a special character between segments if needed
        if (includeSpecialChars && i < numSegments - 1) {
            password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        }
    }

    // Display the generated password
    document.getElementById('password-display').textContent = password;
}

// Add event listener to "Generate Password" button
document.getElementById('generate-btn').addEventListener('click', generatePassword);

// Copy to clipboard logic
document.getElementById('copy-btn').addEventListener('click', function() {
    const passwordDisplay = document.getElementById('password-display').textContent;
    
    if (passwordDisplay) {
        // Use the Clipboard API to copy the text
        navigator.clipboard.writeText(passwordDisplay).then(() => {
            // Show a success message
            const successMessage = document.getElementById('copy-success');
            successMessage.classList.remove('hidden');
            successMessage.classList.add('visible');

            // Hide the message after 2 seconds
            setTimeout(() => {
                successMessage.classList.remove('visible');
                successMessage.classList.add('hidden');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy password: ', err);
        });
    }
});
