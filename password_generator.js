// Theme toggle functionality
document.getElementById('theme-toggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
});

// Segment selection logic
const segmentButtons = document.querySelectorAll('.segment-option');

segmentButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        segmentButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to the clicked button
        this.classList.add('active');
        
        // Store the selected number of segments
        const numSegments = this.getAttribute('data-segments');
        console.log(`Selected number of segments: ${numSegments}`);
    });
});

// Password generation logic
function generatePassword() {
    const numSegments = document.querySelector('.segment-option.active').getAttribute('data-segments');
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSpecialChars = document.getElementById('special-characters').checked;

    const segmentLength = 4; // You can adjust the segment length
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let characters = alphabet;
    if (includeNumbers) {
        characters += numbers;
    }

    let password = '';
    for (let i = 0; i < numSegments; i++) {
        let segment = '';
        for (let j = 0; j < segmentLength; j++) {
            segment += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        password += segment;
        if (includeSpecialChars && i < numSegments - 1) {
            password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        }
    }

    // Display the generated password
    document.getElementById('password-display').textContent = password;
}

// Event listener for the "Generate Password" button
document.getElementById('generate-btn').addEventListener('click', generatePassword);

// Copy to clipboard functionality
document.getElementById('copy-btn').addEventListener('click', function() {
    const passwordDisplay = document.getElementById('password-display').textContent;
    
    if (passwordDisplay) {
        // Copy password to clipboard
        navigator.clipboard.writeText(passwordDisplay).then(() => {
            // Show success message
            const successMessage = document.getElementById('copy-success');
            successMessage.classList.remove('hidden');
            successMessage.classList.add('visible');

            // Hide success message after 2 seconds
            setTimeout(() => {
                successMessage.classList.remove('visible');
                successMessage.classList.add('hidden');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy password: ', err);
        });
    }
});
