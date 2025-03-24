// Event Listener for Dark Mode Toggle
document.getElementById('theme-toggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    // Save preference to localStorage
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Check for saved dark mode preference
document.addEventListener('DOMContentLoaded', function() {
    // Apply dark mode if saved
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').checked = true;
    }

    // Set up advanced options toggle
    const advancedToggle = document.getElementById('advanced-toggle');
    const advancedOptions = document.getElementById('advanced-options');
    
    advancedToggle.addEventListener('click', function() {
        advancedOptions.classList.toggle('show');
        advancedToggle.textContent = advancedOptions.classList.contains('show') 
            ? 'Hide Advanced Options ▲' 
            : 'Show Advanced Options ▼';
    });

    // Add event listeners for password generation and copying
    document.getElementById('generate-btn').addEventListener('click', generatePassword);
    document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

    // Character sets for password generation
    const characterSets = {
        vowels: 'aeiou',
        consonants: 'bcdfghjkmnpqrstvwxyz', // excluding ambiguous l
        allLetters: 'abcdefghjkmnpqrstuvwxyz', // excluding ambiguous i,l
        upperLetters: 'ABCDEFGHJKMNPQRSTUVWXYZ', // excluding ambiguous I,L
        evenNumbers: '2468',
        oddNumbers: '13579',
        allNumbers: '123456789', // excluding ambiguous 0
        atHash: '@#',
        punctuation: '.,;:',
        brackets: '[{}]',
        allSpecial: '@#$%&*+=?!-_.,;:[{}]'
    };

    // Returns a modified character set excluding ambiguous characters if needed
    function getCharSet(set, excludeAmbiguous) {
        if (!excludeAmbiguous) {
            // Add back ambiguous characters for each set
            switch(set) {
                case characterSets.vowels:
                    return characterSets.vowels + 'i';
                case characterSets.consonants:
                    return characterSets.consonants + 'l';
                case characterSets.allLetters:
                    return characterSets.allLetters + 'il';
                case characterSets.upperLetters:
                    return characterSets.upperLetters + 'IL';
                case characterSets.allNumbers:
                    return characterSets.allNumbers + '0';
                default:
                    return set;
            }
        }
        return set;
    }

    // Get a random character from a character set
    function randomCharacter(characters) {
        return characters[Math.floor(Math.random() * characters.length)];
    }

    // Generate a single segment of the password
    function generatePasswordSegment(options) {
        let segment = '';
        const segmentLength = parseInt(options.segmentLength);
        const excludeAmbiguous = options.excludeAmbiguous;
        
        // Generate characters for the segment based on preferences
        for (let i = 0; i < segmentLength; i++) {
            if (i === 0 && options.capitalFirst) {
                // First character - uppercase if capitalFirst is true
                segment += randomCharacter(getCharSet(characterSets.upperLetters, excludeAmbiguous));
            } else if (i === 1 && options.vowelSecond) {
                // Second character - vowel if vowelSecond is true
                segment += randomCharacter(getCharSet(characterSets.vowels, excludeAmbiguous));
            } else if (i === 2 && options.consonantThird) {
                // Third character - consonant if consonantThird is true
                segment += randomCharacter(getCharSet(characterSets.consonants, excludeAmbiguous));
            } else if (i === segmentLength - 1 && options.includeNumbers) {
                // Last character - number if includeNumbers is true
                let numberSet;
                switch(options.numberType) {
                    case 'even':
                        numberSet = characterSets.evenNumbers;
                        break;
                    case 'odd':
                        numberSet = characterSets.oddNumbers;
                        break;
                    default:
                        numberSet = characterSets.allNumbers;
                }
                segment += randomCharacter(numberSet);
            } else {
                // Any other position - random lowercase letter
                segment += randomCharacter(getCharSet(characterSets.allLetters, excludeAmbiguous));
            }
        }
        
        return segment;
    }

    // Main password generation function
    function generatePassword() {
        // Get all the options from the form
        const options = {
            numSegments: parseInt(document.querySelector('input[name="num-segments"]:checked').value),
            specialCharacters: document.getElementById('special-characters').checked,
            includeNumbers: document.getElementById('include-numbers').checked,
            numberType: document.getElementById('number-type').value,
            specialCharsType: document.getElementById('special-chars-type').value,
            capitalFirst: document.getElementById('capital-first').checked,
            vowelSecond: document.getElementById('vowel-second').checked,
            consonantThird: document.getElementById('consonant-third').checked,
            excludeAmbiguous: document.getElementById('exclude-ambiguous').checked,
            segmentLength: document.getElementById('segment-length').value
        };
        
        let password = '';

        // Generate each segment
        for (let i = 0; i < options.numSegments; i++) {
            password += generatePasswordSegment(options);
            
            // Add special character between segments if enabled
            if (options.specialCharacters && i < options.numSegments - 1) {
                let specialSet;
                switch(options.specialCharsType) {
                    case 'at-hash':
                        specialSet = characterSets.atHash;
                        break;
                    case 'punctuation':
                        specialSet = characterSets.punctuation;
                        break;
                    case 'brackets':
                        specialSet = characterSets.brackets;
                        break;
                    default:
                        specialSet = characterSets.allSpecial;
                }
                password += randomCharacter(specialSet);
            }
        }

        // Display the password with a nice animation
        let passwordDisplay = document.getElementById('password-display');
        passwordDisplay.innerText = password;
        passwordDisplay.style.opacity = "0";
        setTimeout(function() {
            passwordDisplay.style.opacity = "1";
        }, 100);
    }

    // Copy password to clipboard
    function copyToClipboard() {
        let password = document.getElementById('password-display').innerText;
        
        // Don't copy the placeholder text
        if (password === 'Your password will be displayed here') {
            return;
        }
        
        navigator.clipboard.writeText(password).then(function() {
            let copyButton = document.getElementById('copy-btn');
            copyButton.innerText = 'Copied!';
            setTimeout(function() {
                copyButton.innerText = 'Copy to Clipboard';
            }, 1500);
            copyButton.style.backgroundColor = "#28a745";
            setTimeout(function() {
                copyButton.style.backgroundColor = "#2c3e50";
            }, 1500);
        }, function(err) {
            console.error('Could not copy password: ', err);
        });
    }

    // Generate a password when the page loads
    generatePassword();
});
