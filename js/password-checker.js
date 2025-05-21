document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.querySelector('.toggle-password');
    const strengthProgress = document.getElementById('strength-progress');
    const strengthLabel = document.getElementById('strength-label');
    const lengthCheck = document.getElementById('length-check');
    const uppercaseCheck = document.getElementById('uppercase-check');
    const lowercaseCheck = document.getElementById('lowercase-check');
    const numberCheck = document.getElementById('number-check');
    const specialCheck = document.getElementById('special-check');
    const commonCheck = document.getElementById('common-check');
    const suggestionsList = document.getElementById('suggestions-list');
    
    // Password Generator Elements
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const generatedPasswordInput = document.getElementById('generated-password');
    const generateButton = document.getElementById('generate-password');
    const copyButton = document.getElementById('copy-password');
    
    // Common password patterns to check against
    const commonPatterns = [
        'password', '123456', 'qwerty', 'admin', 'welcome',
        'letmein', 'monkey', 'abc123', '111111', '12345678',
        'sunshine', 'princess', 'qwertyuiop', 'iloveyou', 'admin123',
        'football', '123123', 'dragon', '123qwe', 'baseball',
        'shadow', 'master', 'login', 'solo', 'starwars',
        'whatever', 'welcome1', 'superman', 'batman', 'trustno1',
        'qazwsx', 'michael', 'football1', 'jordan23', 'password1',
        'liverpool', 'computer', 'jessica', 'michelle', 'jennifer',
        'joshua', 'charlie', 'hunter', 'freedom', 'harley',
        'pepper', 'summer', 'corvette', 'ranger', 'hockey',
        'andrew', 'thomas', 'secret', 'asdfgh', 'ginger',
        'sophia', 'daniel', 'maggie', 'bailey', 'london',
        'william', 'martin', 'jasper', 'jackson', 'dallas',
        'austin', 'thunder', 'taylor', 'matrix', 'ashley',
        'robert', 'junior', 'banana', 'cookie', 'donald',
        'cheese', 'coffee', 'mickey', 'minnie', 'purple',
        'jordan', 'lakers', 'andrea', 'carlos', 'amanda',
        'boston', 'tigers', 'yankees', 'steelers', 'cowboys',
        'angels', 'flower', 'rabbit', 'wizard', 'godzilla',
        'ferrari', 'toyota', 'nissan', 'mercedes', 'porsche',
        'yamaha', 'guitar', 'violin', 'soccer', 'tennis',
        'hockey', 'killer', 'justin', 'hannah', 'lauren',
        'midnight', 'orange', 'silver', 'golden', 'shadow',
        'monster', 'spider', 'giraffe', 'penguin', 'dolphin'
    ];
    
    // Sequential patterns to check against
    const sequentialPatterns = [
        'abcdefghijklmnopqrstuvwxyz',
        'zyxwvutsrqponmlkjihgfedcba',
        '0123456789',
        '9876543210',
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm'
    ];
    
    // Toggle password visibility
    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const eyeIcon = this.querySelector('i');
        if (type === 'password') {
            eyeIcon.classList.remove('ph-eye-slash');
            eyeIcon.classList.add('ph-eye');
        } else {
            eyeIcon.classList.remove('ph-eye');
            eyeIcon.classList.add('ph-eye-slash');
        }
    });
    
    // Password strength checker
    passwordInput.addEventListener('input', checkPasswordStrength);
    
    function checkPasswordStrength() {
        const password = passwordInput.value;
        
        // Reset all checks
        resetChecks();
        
        if (!password) {
            updateStrengthMeter(0, 'Password Strength');
            suggestionsList.innerHTML = '<li>Enter a password to see suggestions</li>';
            return;
        }
        
        // Check criteria
        const hasLength = password.length >= 12;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        
        // Check for common patterns
        const hasCommonPattern = checkCommonPatterns(password);
        
        // Update visual indicators
        updateCheckItem(lengthCheck, hasLength);
        updateCheckItem(uppercaseCheck, hasUppercase);
        updateCheckItem(lowercaseCheck, hasLowercase);
        updateCheckItem(numberCheck, hasNumber);
        updateCheckItem(specialCheck, hasSpecial);
        updateCheckItem(commonCheck, !hasCommonPattern);
        
        // Calculate strength score (0-100)
        let strengthScore = calculateStrengthScore(
            password, 
            hasLength, 
            hasUppercase, 
            hasLowercase, 
            hasNumber, 
            hasSpecial, 
            hasCommonPattern
        );
        
        // Update strength meter
        updateStrengthMeter(strengthScore);
        
        // Generate suggestions
        generateSuggestions(
            password, 
            hasLength, 
            hasUppercase, 
            hasLowercase, 
            hasNumber, 
            hasSpecial, 
            hasCommonPattern
        );
    }
    
    function resetChecks() {
        const checks = [lengthCheck, uppercaseCheck, lowercaseCheck, numberCheck, specialCheck, commonCheck];
        checks.forEach(check => {
            check.classList.remove('passed', 'failed');
            const icon = check.querySelector('.check-icon i');
            icon.classList.remove('ph-check', 'ph-x');
            icon.classList.add('ph-x');
        });
    }
    
    function updateCheckItem(element, isPassed) {
        if (isPassed) {
            element.classList.add('passed');
            element.classList.remove('failed');
            const icon = element.querySelector('.check-icon i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-check');
        } else {
            element.classList.add('failed');
            element.classList.remove('passed');
            const icon = element.querySelector('.check-icon i');
            icon.classList.remove('ph-check');
            icon.classList.add('ph-x');
        }
    }
    
    function calculateStrengthScore(password, hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial, hasCommonPattern) {
        if (!password) return 0;
        
        let score = 0;
        
        // Base score from length (up to 40 points)
        const lengthScore = Math.min(40, password.length * 3);
        score += lengthScore;
        
        // Character variety (up to 40 points)
        if (hasUppercase) score += 10;
        if (hasLowercase) score += 10;
        if (hasNumber) score += 10;
        if (hasSpecial) score += 10;
        
        // Penalize for common patterns (up to -30 points)
        if (hasCommonPattern) score -= 30;
        
        // Bonus for length + variety (up to 20 points)
        if (hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial) {
            score += 20;
        }
        
        // Ensure score is between 0-100
        return Math.max(0, Math.min(100, score));
    }
    
    function updateStrengthMeter(score, label) {
        // Remove all classes
        strengthProgress.classList.remove('weak', 'fair', 'good', 'strong');
        
        // Set width based on score
        strengthProgress.style.width = `${score}%`;
        
        // Determine strength label and color
        let strengthText;
        if (score === 0) {
            strengthText = label || 'Password Strength';
        } else if (score < 30) {
            strengthText = 'Weak';
            strengthProgress.classList.add('weak');
        } else if (score < 60) {
            strengthText = 'Fair';
            strengthProgress.classList.add('fair');
        } else if (score < 80) {
            strengthText = 'Good';
            strengthProgress.classList.add('good');
        } else {
            strengthText = 'Strong';
            strengthProgress.classList.add('strong');
        }
        
        strengthLabel.textContent = strengthText;
    }
    
    function checkCommonPatterns(password) {
        const lowerPassword = password.toLowerCase();
        
        // Check against common passwords
        for (const pattern of commonPatterns) {
            if (lowerPassword.includes(pattern)) {
                return true;
            }
        }
        
        // Check for sequential characters
        for (const sequence of sequentialPatterns) {
            for (let i = 0; i < sequence.length - 2; i++) {
                const seq = sequence.substring(i, i + 3);
                if (lowerPassword.includes(seq)) {
                    return true;
                }
            }
        }
        
        // Check for repeated characters (3 or more)
        if (/(.)\1{2,}/.test(lowerPassword)) {
            return true;
        }
        
        // Check for keyboard patterns
        const keyboardPatterns = ['qwe', 'asd', 'zxc', 'wer', 'sdf', 'xcv', 'ert', 'dfg', 'cvb'];
        for (const pattern of keyboardPatterns) {
            if (lowerPassword.includes(pattern)) {
                return true;
            }
        }
        
        return false;
    }
    
    function generateSuggestions(password, hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial, hasCommonPattern) {
        const suggestions = [];
        
        if (!password) {
            suggestionsList.innerHTML = '<li>Enter a password to see suggestions</li>';
            return;
        }
        
        if (!hasLength) {
            suggestions.push('Make your password at least 12 characters long');
        }
        
        if (!hasUppercase) {
            suggestions.push('Add uppercase letters (A-Z)');
        }
        
        if (!hasLowercase) {
            suggestions.push('Add lowercase letters (a-z)');
        }
        
        if (!hasNumber) {
            suggestions.push('Add numbers (0-9)');
        }
        
        if (!hasSpecial) {
            suggestions.push('Add special characters (!, @, #, $, etc.)');
        }
        
        if (hasCommonPattern) {
            suggestions.push('Avoid common words, sequences, or patterns');
            suggestions.push('Avoid using personal information like names or birthdays');
            suggestions.push('Try using a passphrase with unrelated words');
        }
        
        if (password.length > 0 && password.length < 8) {
            suggestions.push('Your password is too short and easily crackable');
        }
        
        if (suggestions.length === 0) {
            suggestions.push('Your password meets all the security criteria!');
            
            if (password.length < 16) {
                suggestions.push('For even better security, consider making your password longer (16+ characters)');
            }
            
            suggestions.push('Remember to use different passwords for different accounts');
            suggestions.push('Consider using a password manager to store your passwords securely');
        }
        
        // Update suggestions list
        suggestionsList.innerHTML = suggestions.map(suggestion => `<li>${suggestion}</li>`).join('');
    }
    
    // Password Generator
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
    
    generateButton.addEventListener('click', generatePassword);
    
    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const useUppercase = includeUppercase.checked;
        const useLowercase = includeLowercase.checked;
        const useNumbers = includeNumbers.checked;
        const useSymbols = includeSymbols.checked;
        
        // Ensure at least one character type is selected
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            alert('Please select at least one character type');
            return;
        }
        
        // Define character sets
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_-+=<>?/[]{}|~';
        
        // Combine selected character sets
        let allChars = '';
        if (useUppercase) allChars += uppercaseChars;
        if (useLowercase) allChars += lowercaseChars;
        if (useNumbers) allChars += numberChars;
        if (useSymbols) allChars += symbolChars;
        
        // Generate password
        let password = '';
        
        // Ensure at least one character from each selected type
        if (useUppercase) password += getRandomChar(uppercaseChars);
        if (useLowercase) password += getRandomChar(lowercaseChars);
        if (useNumbers) password += getRandomChar(numberChars);
        if (useSymbols) password += getRandomChar(symbolChars);
        
        // Fill the rest of the password
        while (password.length < length) {
            password += getRandomChar(allChars);
        }
        
        // Shuffle the password to ensure randomness
        password = shuffleString(password);
        
        // Trim to exact length (in case we added too many characters)
        password = password.substring(0, length);
        
        // Display the generated password
        generatedPasswordInput.value = password;
        
        // Add animation to the generated password field
        generatedPasswordInput.classList.add('highlight');
        setTimeout(() => {
            generatedPasswordInput.classList.remove('highlight');
        }, 500);
    }
    
    function getRandomChar(charSet) {
        return charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    
    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }
    
    // Copy generated password
    copyButton.addEventListener('click', function() {
        const password = generatedPasswordInput.value;
        if (!password) return;
        // Try Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(password).then(() => {
                this.classList.add('copied');
                setTimeout(() => {
                    this.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                fallbackCopy(password, this);
            });
        } else {
            fallbackCopy(password, this);
        }
    });
    
    function fallbackCopy(text, btn) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            btn.classList.add('copied');
            setTimeout(() => {
                btn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            alert('Failed to copy password to clipboard');
        }
        document.body.removeChild(textarea);
    }
    // Generate a password on page load
    generatePassword();
    
    // Mobile menu functionality (from tool-dashboard.js)
    const userProfile = document.querySelector('.user-profile');
    
    userProfile.addEventListener('click', function() {
        const mobileDropdown = document.querySelector('.mobile-dropdown');
        mobileDropdown.classList.toggle('active');
    });
});