 const step1Content = document.getElementById('step-1-content');
    const step2Content = document.getElementById('step-2-content');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const stepIndicatorText = document.getElementById('step-indicator-text');
    const stepTitle = document.getElementById('step-title');

    // Navigation Step Event Listeners
    nextBtn.addEventListener('click', () => {
        // Form field constraints checking across current block
        const step1Inputs = step1Content.querySelectorAll('input, select');
        let isValid = true;
        
        step1Inputs.forEach(input => {
            if(!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });

        if(isValid) {
            step1Content.classList.add('step-hidden');
            step2Content.classList.remove('step-hidden');
            stepIndicatorText.innerText = 'Step 2 of 2';
            stepTitle.innerText = 'Security Details';
            
            document.getElementById('password-field').required = true;
            document.getElementById('confirm-password-field').required = true;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    backBtn.addEventListener('click', () => {
        step2Content.classList.add('step-hidden');
        step1Content.classList.remove('step-hidden');
        stepIndicatorText.innerText = 'Step 1 of 2';
        stepTitle.innerText = 'Account Information';
        
        document.getElementById('password-field').required = false;
        document.getElementById('confirm-password-field').required = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Form validation event monitor 
    function handleFormValidation(event) {
        const password = document.getElementById('password-field').value;
        const confirmPassword = document.getElementById('confirm-password-field').value;

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            event.preventDefault();
            return false;
        }

        if (password !== confirmPassword) {
            alert("Error: Passwords do not match. Re-check parameters.");
            event.preventDefault();
            return false;
        }

        alert("Registration processed securely under clinical guidelines!");
        return true;
    }

    // Dynamic focus color-shifts matching the container panels
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const container = input.closest('.form-card');
            if(container) {
                container.style.borderColor = 'rgba(0, 106, 97, 0.6)';
            }
        });
        input.addEventListener('blur', () => {
            const container = input.closest('.form-card');
            if(container) {
                container.style.borderColor = 'rgba(198, 198, 205, 0.3)';
            }
        });
    });

function togglePassword(inputId, eyeId){

    const input = document.getElementById(inputId);
    const eye = document.getElementById(eyeId);

    if(input.type === "password"){
        input.type = "text";
        eye.textContent = "visibility_off";
    }else{
        input.type = "password";
        eye.textContent = "visibility";
    }

}

document.addEventListener("DOMContentLoaded", function () {

    const nextBtn = document.getElementById("next-btn");
    const backBtn = document.getElementById("back-btn");

    const step1 = document.getElementById("step-1-content");
    const step2 = document.getElementById("step-2-content");

    nextBtn.addEventListener("click", () => {
        step1.classList.add("step-hidden");
        step2.classList.remove("step-hidden");
    });

    backBtn.addEventListener("click", () => {
        step2.classList.add("step-hidden");
        step1.classList.remove("step-hidden");
    });

});
function goToStep(stepNumber) {
            const step1 = document.getElementById('step1Container');
            const step2 = document.getElementById('step2Container');
            const indicator = document.getElementById('stepIndicator');
            const titleHeader = document.getElementById('stepHeaderTitle');
            const backBtn = document.getElementById('backBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitBtn = document.getElementById('submitBtn');

            if (stepNumber === 2) {
                // Shift UI elements smoothly into Step 2 state
                step1.classList.add('hidden-step');
                step2.classList.remove('hidden-step');
                
                indicator.innerText = "Step 2 of 2";
                titleHeader.innerText = "Security & Verification";
                
                backBtn.classList.remove('hidden-step');
                nextBtn.classList.add('hidden-step');
                submitBtn.classList.remove('hidden-step');
            } else {
                // Shift back into Step 1 state
                step2.classList.add('hidden-step');
                step1.classList.remove('hidden-step');
                
                indicator.innerText = "Step 1 of 2";
                titleHeader.innerText = "Account Creation";
                
                backBtn.classList.add('hidden-step');
                nextBtn.classList.remove('hidden-step');
                submitBtn.classList.add('hidden-step');
            }
        }

        function handleFormSubmit(event) {
            // Put any password matching validation checks or backend processing routes here
            alert("Registration Complete!");
            return true;
        }

        // Active Focus styling highlights inside parent cards
        document.addEventListener('DOMContentLoaded', () => {
            const inputs = document.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    const card = input.closest('.form-card');
                    if (card) card.style.borderColor = '#006a61';
                });
                input.addEventListener('blur', () => {
                    const card = input.closest('.form-card');
                    if (card) card.style.borderColor = '#e2e8f0';
                });
            });
        });