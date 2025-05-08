// Multi-Step Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skill suggestions
    initializeSkillSuggestions();
    
    // Initialize hidden skill inputs with empty arrays
    const techSkillsInput = document.getElementById('technicalSkills');
    const softSkillsInput = document.getElementById('softSkills');
    
    if (techSkillsInput && !techSkillsInput.value) {
        techSkillsInput.value = '[]';
    }
    
    if (softSkillsInput && !softSkillsInput.value) {
        softSkillsInput.value = '[]';
    }
    
    // Initialize tech skills input
    const techSkillInput = document.getElementById('techSkillInput');
    if (techSkillInput) {
        techSkillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTechSkill();
            }
        });
        
        // Add input handler for real-time suggestions
        techSkillInput.addEventListener('input', function() {
            showSkillSuggestions(this, 'tech');
        });
    }
    
    // Initialize soft skills input
    const softSkillInput = document.getElementById('softSkillInput');
    if (softSkillInput) {
        softSkillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSoftSkill();
            }
        });
        
        // Add input handler for real-time suggestions
        softSkillInput.addEventListener('input', function() {
            showSkillSuggestions(this, 'soft');
        });
    }
    
    // Initialize form steps
    updateProgressBar(1);
    
    // Add click event listeners to step dots for direct navigation
    initializeStepDotNavigation();
    
    // Create save indicator
    createSaveIndicator();
    
    // Load saved progress
    loadSavedProgress();
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Only process when not in an input field
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
            const currentStep = getCurrentStep();
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                // Next step
                nextStep(currentStep);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                // Previous step
                prevStep(currentStep);
            }
        }
    });
});

// Create save indicator
function createSaveIndicator() {
    const saveIndicator = document.createElement('div');
    saveIndicator.className = 'save-indicator';
    saveIndicator.id = 'saveIndicator';
    saveIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Progress saved successfully';
    document.body.appendChild(saveIndicator);
}

// Show save indicator with animation
function showSaveIndicator() {
    const saveIndicator = document.getElementById('saveIndicator');
    if (saveIndicator) {
        saveIndicator.classList.add('show');
        
        setTimeout(() => {
            saveIndicator.classList.remove('show');
        }, 3000);
    }
}

// Initialize step dot navigation
function initializeStepDotNavigation() {
    const stepDots = document.querySelectorAll('.step-dot');
    stepDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetStep = parseInt(this.getAttribute('data-step'));
            const currentStep = getCurrentStep();
            
            console.log(`Attempting to navigate from step ${currentStep} to step ${targetStep}`);
            
            // If trying to navigate forward, validate all previous steps
            if (targetStep > currentStep) {
                let canProceed = true;
                
                // Validate each step from current to target (excluding target)
                for (let i = currentStep; i < targetStep; i++) {
                    if (!validateStep(i)) {
                        canProceed = false;
                        
                        // Highlight the step with the error
                        highlightInvalidStep(i);
                        break;
                    }
                    
                    // If validation passes, mark step as completed
                    const stepDot = document.querySelector(`.step-dot[data-step="${i}"]`);
                    if (stepDot) {
                        stepDot.classList.add('completed');
                    }
                }
                
                if (!canProceed) {
                    return false;
                }
            }
            
            // Navigate to the target step with animation
            navigateToStep(targetStep, currentStep < targetStep ? 'next' : 'prev');
        });
    });
}

// Highlight the step that has validation errors
function highlightInvalidStep(stepNumber) {
    const stepDot = document.querySelector(`.step-dot[data-step="${stepNumber}"]`);
    if (stepDot) {
        // Add a shaking animation to indicate error
        stepDot.classList.add('shake-animation');
        
        setTimeout(() => {
            stepDot.classList.remove('shake-animation');
        }, 600);
    }
}

// Add CSS for the shake animation
(function addShakeAnimationStyle() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translate(0, 0) rotate(0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 0) rotate(-1deg); }
            20%, 40%, 60%, 80% { transform: translate(2px, 0) rotate(1deg); }
        }
        .shake-animation {
            animation: shake 0.6s ease;
        }
    `;
    document.head.appendChild(style);
})();

// Get the current active step
function getCurrentStep() {
    const activeStep = document.querySelector('.form-step.active');
    if (activeStep) {
        const stepNumber = activeStep.id.replace('step', '');
        return parseInt(stepNumber);
    }
    return 1; // Default to first step
}

// Navigate directly to a specific step
function navigateToStep(stepNumber, direction = 'next') {
    // Get all steps
    const allSteps = document.querySelectorAll('.form-step');
    const currentStep = document.querySelector('.form-step.active');
    const currentStepNumber = getCurrentStep();
    const targetStep = document.getElementById(`step${stepNumber}`);
    
    if (!targetStep) return;
    
    // Apply the appropriate animation class based on direction
    if (direction === 'next') {
        // Moving forward: current slides left, new slides in from right
        currentStep.classList.add('slide-left');
        setTimeout(() => {
            // Hide current step
            currentStep.classList.remove('active', 'slide-left');
            
            // Show target step with animation
            targetStep.classList.add('active', 'slide-right');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                targetStep.classList.remove('slide-right');
            }, 400);
        }, 300);
    } else {
        // Moving backward: current slides right, new slides in from left
        currentStep.classList.add('slide-right');
        setTimeout(() => {
            // Hide current step
            currentStep.classList.remove('active', 'slide-right');
            
            // Show target step with animation
            targetStep.classList.add('active', 'slide-left');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                targetStep.classList.remove('slide-left');
            }, 400);
        }, 300);
    }
    
    // Update active state on dots
    const allDots = document.querySelectorAll('.step-dot');
    allDots.forEach(dot => {
        const dotStep = parseInt(dot.getAttribute('data-step'));
        
        // Remove active class from all dots
        dot.classList.remove('active');
        
        // Add appropriate classes
        if (dotStep === stepNumber) {
            dot.classList.add('active');
        }
        
        // Keep or add completed class for previous steps
        if (dotStep < stepNumber) {
            dot.classList.add('completed');
        }
    });
    
    // Update progress bar with animation
    updateProgressBar(stepNumber);
    
    // Scroll to top with smooth behavior
    window.scrollTo({top: 0, behavior: 'smooth'});
    
    // Save current step in sessionStorage
    sessionStorage.setItem('currentResumeStep', stepNumber);
}

// Save current step to sessionStorage
function saveCurrentStep(stepNumber) {
    sessionStorage.setItem('currentResumeStep', stepNumber);
}

// Retrieve current step from sessionStorage
function getLastSavedStep() {
    const stepNumber = sessionStorage.getItem('currentResumeStep');
    return stepNumber ? parseInt(stepNumber) : 1;
}

// Validate a specific step with improved visual feedback
function validateStep(stepNumber) {
    let isValid = true;
    
    // Clear existing validation errors for this step
    const stepContainer = document.getElementById(`step${stepNumber}`);
    if (stepContainer) {
        const invalidFields = stepContainer.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => {
            field.classList.remove('is-invalid');
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.remove();
            }
        });
    }
    
    switch(stepNumber) {
        case 1:
            // Validate Personal Details
            const fullName = document.querySelector('input[name="fullName"]');
            const email = document.querySelector('input[name="email"]');
            const phone = document.querySelector('input[name="phone"]');
            
            if (!fullName || !fullName.value.trim()) {
                showValidationError(fullName, "Please enter your full name");
                isValid = false;
            }
            
            if (!email || !email.value.trim()) {
                showValidationError(email, "Please enter your email address");
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                showValidationError(email, "Please enter a valid email address");
                isValid = false;
            }
            
            if (phone && phone.value.trim() && !isValidPhone(phone.value.trim())) {
                showValidationError(phone, "Please enter a valid phone number");
                isValid = false;
            }
            break;
            
        case 2:
            // Validate Summary & Skills
            const summary = document.querySelector('textarea[name="summary"]');
            if (!summary || !summary.value.trim()) {
                showValidationError(summary, "Please enter a brief career summary");
                isValid = false;
            }
            
            // Check if at least one technical skill is added
            const techSkills = document.getElementById('technicalSkills');
            const techSkillInput = document.getElementById('techSkillInput');
            try {
                const parsedSkills = JSON.parse(techSkills?.value || '[]');
                if (!techSkills || !techSkills.value || parsedSkills.length === 0) {
                    showValidationError(techSkillInput, "Please add at least one technical skill");
                    isValid = false;
                }
            } catch (error) {
                console.error('Error parsing technical skills:', error);
                showValidationError(techSkillInput, "There was an error with your technical skills");
                isValid = false;
            }
            break;
            
        case 3:
            // Validate Education
            const degree = document.querySelector('input[name="education[0].degree"]');
            const institution = document.querySelector('input[name="education[0].institution"]');
            const startDate = document.querySelector('input[name="education[0].startDate"]');
            
            if (!degree || !degree.value.trim()) {
                showValidationError(degree, "Please enter your degree or certificate");
                isValid = false;
            }
            
            if (!institution || !institution.value.trim()) {
                showValidationError(institution, "Please enter your institution name");
                isValid = false;
            }
            
            if (!startDate || !startDate.value) {
                showValidationError(startDate, "Please enter your education start date");
                isValid = false;
            }
            break;
            
        case 4:
            // Only validate Experience if not skipped
            const experienceItems = document.querySelectorAll('.experience-item');
            if (experienceItems.length > 0) {
                const company = document.querySelector('input[name="experience[0].company"]');
                const position = document.querySelector('input[name="experience[0].position"]');
                
                if (company && position) {
                    if (!company.value.trim()) {
                        showValidationError(company, "Please enter the company name");
                        isValid = false;
                    }
                    
                    if (!position.value.trim()) {
                        showValidationError(position, "Please enter your job title");
                        isValid = false;
                    }
                }
            }
            break;
            
        case 5:
            // Projects validation is optional
            break;
            
        case 6:
            // Certifications validation is optional
            break;
            
        case 7:
            // Extras validation is optional
            break;
    }
    
    // If there are validation errors, scroll to the first error
    if (!isValid && stepContainer) {
        const firstError = stepContainer.querySelector('.is-invalid');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

// Show validation error with improved visual feedback
function showValidationError(element, message) {
    if (!element) return;
    
    // Add invalid class to the element
    element.classList.add('is-invalid');
    
    // Create the feedback element if it doesn't exist
    let feedbackElement = element.nextElementSibling;
    if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'invalid-feedback';
        element.parentNode.insertBefore(feedbackElement, element.nextSibling);
    }
    
    // Set the error message
    feedbackElement.textContent = message;
    
    // Add shake animation to the element
    element.classList.add('shake-animation');
    setTimeout(() => {
        element.classList.remove('shake-animation');
    }, 500);
}

// Add CSS for shake animation
(function addShakeAnimation() {
    if (!document.getElementById('validation-animations')) {
        const style = document.createElement('style');
        style.id = 'validation-animations';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .shake-animation {
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
            .is-invalid {
                border-color: var(--danger-color) !important;
                box-shadow: 0 0 0 0.2rem rgba(231, 29, 54, 0.25) !important;
            }
            .invalid-feedback {
                color: var(--danger-color);
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }
})();

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Validate phone format
function isValidPhone(phone) {
    // Allow different formats with or without country code
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
    return phoneRegex.test(phone);
}

// Navigation between form steps
function nextStep(currentStep) {
    // Validate current step first
    if (!validateStep(currentStep)) {
        return false;
    }
    
    // Mark the current step as completed
    const currentDot = document.querySelector(`.step-dot[data-step="${currentStep}"]`);
    if (currentDot) {
        currentDot.classList.add('completed');
    }
    
    // Navigate to the next step
    navigateToStep(currentStep + 1, 'next');
    
    return true;
}

// Go to previous step with animation
function prevStep(currentStep) {
    // Navigate to the previous step
    navigateToStep(currentStep - 1, 'prev');
    
    return true;
}

// Update progress bar
function updateProgressBar(step) {
    const progress = (step / 7) * 100;
    document.getElementById('stepProgressBar').style.width = `${progress}%`;
}

// Add new technical skill
function addTechSkill(skillParam) {
    const input = document.getElementById('techSkillInput');
    const container = document.getElementById('techSkillsContainer');
    const hiddenInput = document.getElementById('technicalSkills');
    
    // Use either passed skill or input value
    const skillText = skillParam || input.value.trim();
    
    if (skillText !== '') {
        // Auto-correct common misspellings
        const correctedSkill = autoCorrectTechnicalSkill(skillText);
        
        // Create skill tag
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `${correctedSkill} <span class="remove-skill" onclick="removeSkill(this, 'technical')"><i class="fas fa-times"></i></span>`;
        
        container.appendChild(skillTag);
        
        // Update hidden input value
        let currentSkills = [];
        try {
            currentSkills = hiddenInput.value ? JSON.parse(hiddenInput.value) : [];
            // Ensure currentSkills is an array
            if (!Array.isArray(currentSkills)) {
                currentSkills = [];
            }
        } catch (e) {
            console.error('Error parsing existing technical skills:', e);
            currentSkills = [];
        }
        
        currentSkills.push(correctedSkill);
        hiddenInput.value = JSON.stringify(currentSkills);
        
        console.log('Updated technical skills:', hiddenInput.value);
        
        // Clear input
        input.value = '';
        
        // Remove any suggestions
        removeSkillSuggestions();
    }
}

// Add new soft skill
function addSoftSkill(skillParam) {
    const input = document.getElementById('softSkillInput');
    const container = document.getElementById('softSkillsContainer');
    const hiddenInput = document.getElementById('softSkills');
    
    // Use either passed skill or input value
    const skillText = skillParam || input.value.trim();
    
    if (skillText !== '') {
        // Create skill tag
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `${skillText} <span class="remove-skill" onclick="removeSkill(this, 'soft')"><i class="fas fa-times"></i></span>`;
        
        container.appendChild(skillTag);
        
        // Update hidden input value
        let currentSkills = [];
        try {
            currentSkills = hiddenInput.value ? JSON.parse(hiddenInput.value) : [];
            // Ensure currentSkills is an array
            if (!Array.isArray(currentSkills)) {
                currentSkills = [];
            }
        } catch (e) {
            console.error('Error parsing existing soft skills:', e);
            currentSkills = [];
        }
        
        currentSkills.push(skillText);
        hiddenInput.value = JSON.stringify(currentSkills);
        
        console.log('Updated soft skills:', hiddenInput.value);
        
        // Clear input
        input.value = '';
        
        // Remove any suggestions
        removeSkillSuggestions();
    }
}

// Remove skill
function removeSkill(element, type) {
    const skillTag = element.parentNode;
    const skillText = skillTag.textContent.trim().replace('×', '').trim();
    const hiddenInput = document.getElementById(type === 'technical' ? 'technicalSkills' : 'softSkills');
    
    // Remove from DOM
    skillTag.remove();
    
    // Update hidden input value
    try {
        let currentSkills = hiddenInput.value ? JSON.parse(hiddenInput.value) : [];
        
        // Ensure currentSkills is an array
        if (!Array.isArray(currentSkills)) {
            currentSkills = [];
        }
        
        const updatedSkills = currentSkills.filter(skill => skill !== skillText);
        hiddenInput.value = JSON.stringify(updatedSkills);
        
        console.log(`Updated ${type} skills after removal:`, hiddenInput.value);
    } catch (e) {
        console.error(`Error updating ${type} skills on removal:`, e);
        hiddenInput.value = '[]';
    }
}

// Add new education item
function addEducation() {
    const educationList = document.getElementById('educationList');
    const itemCount = educationList.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Degree/Certificate</label>
                    <input type="text" class="form-control" name="education[${itemCount}].degree" placeholder="Bachelor of Science">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Institution</label>
                    <input type="text" class="form-control" name="education[${itemCount}].institution" placeholder="University Name">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control" name="education[${itemCount}].location" placeholder="City, Country">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">CGPA/Grade</label>
                    <input type="text" class="form-control" name="education[${itemCount}].grade" placeholder="3.8/4.0">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" name="education[${itemCount}].startDate">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">End Date</label>
                    <input type="date" class="form-control" name="education[${itemCount}].endDate">
                    <div class="form-check mt-2">
                        <input type="checkbox" class="form-check-input" name="education[${itemCount}].current" id="currentEducation${itemCount}">
                        <label class="form-check-label" for="currentEducation${itemCount}">Currently Studying</label>
                    </div>
                </div>
            </div>
        </div>
        <span class="remove-item" onclick="removeItem(this, 'education')"><i class="fas fa-times"></i></span>
    `;
    
    educationList.appendChild(newItem);
}

// Preview resume
function previewResume() {
    try {
        // Extract data from form
        const form = document.getElementById('resumeForm');
        if (!form) {
            console.error('Resume form not found');
            alert('Error: Resume form not found. Please refresh the page and try again.');
            return false;
        }
        
        const formData = new FormData(form);
        const resumeData = {};
        
        for (const [key, value] of formData.entries()) {
            resumeData[key] = value;
        }
        
        // Parse skills from hidden inputs
        try {
            const techSkillsInput = document.getElementById('technicalSkills');
            const softSkillsInput = document.getElementById('softSkills');
            
            // Initialize skills arrays
            resumeData.technicalSkills = [];
            resumeData.softSkills = [];
            
            // Parse technical skills
            if (techSkillsInput && techSkillsInput.value) {
                try {
                    resumeData.technicalSkills = JSON.parse(techSkillsInput.value);
                } catch (e) {
                    // If JSON parsing fails, try to get skills from the skill tags
                    const techSkillTags = document.querySelectorAll('#techSkillsContainer .skill-tag');
                    resumeData.technicalSkills = Array.from(techSkillTags).map(tag => 
                        tag.textContent.trim().replace('×', '').trim()
                    );
                }
            }
            
            // Parse soft skills
            if (softSkillsInput && softSkillsInput.value) {
                try {
                    resumeData.softSkills = JSON.parse(softSkillsInput.value);
                } catch (e) {
                    // If JSON parsing fails, try to get skills from the skill tags
                    const softSkillTags = document.querySelectorAll('#softSkillsContainer .skill-tag');
                    resumeData.softSkills = Array.from(softSkillTags).map(tag => 
                        tag.textContent.trim().replace('×', '').trim()
                    );
                }
            }
        } catch (e) {
            console.error('Error parsing skills:', e);
            // Continue with empty skills arrays instead of failing
            resumeData.technicalSkills = [];
            resumeData.softSkills = [];
        }
        
        // Show preview modal
        const previewModal = document.getElementById('previewModal');
        if (!previewModal) {
            console.error('Preview modal not found');
            alert('Error: Preview modal not found. Please refresh the page and try again.');
            return false;
        }
        
        const modal = new bootstrap.Modal(previewModal);
        modal.show();
        
        // Generate preview content
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) {
            console.error('Preview content container not found');
            alert('Error: Preview content container not found. Please refresh the page and try again.');
            return false;
        }
        
        // Display preview based on selected template
        const selectedTemplate = sessionStorage.getItem('selectedTemplate') || 'professional';
        
        // Generate preview based on template and data
        try {
            generateResumePreview(selectedTemplate, resumeData, previewContent);
        } catch (e) {
            console.error('Error generating resume preview:', e);
            previewContent.innerHTML = `
                <div class="alert alert-danger">
                    <h5><i class="fas fa-exclamation-triangle me-2"></i>Error generating preview</h5>
                    <p>There was an error generating your resume preview. Please try again or contact support.</p>
                    <p>Error details: ${e.message}</p>
                </div>
            `;
        }
        
        return true;
    } catch (e) {
        console.error('Error in previewResume function:', e);
        alert('An unexpected error occurred. Please try again or contact support.');
        return false;
    }
}

// Add experience, project, certification handlers will follow the same pattern as education 

// Add new project
function addProject() {
    const projectsList = document.getElementById('projectsList');
    const itemCount = projectsList.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'project-item';
    newItem.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Project Title</label>
                    <input type="text" class="form-control" name="projects[${itemCount}].title" placeholder="E-commerce Website">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Technologies Used</label>
                    <input type="text" class="form-control" name="projects[${itemCount}].technologies" placeholder="React, Node.js, MongoDB">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">GitHub Link</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fab fa-github"></i></span>
                        <input type="url" class="form-control" name="projects[${itemCount}].github" placeholder="https://github.com/username/project">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Live Demo Link</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-globe"></i></span>
                        <input type="url" class="form-control" name="projects[${itemCount}].demo" placeholder="https://project-demo.com">
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="mb-3">
                    <label class="form-label">Project Description</label>
                    <textarea class="form-control" name="projects[${itemCount}].description" rows="3" placeholder="Describe the project, your role, and key achievements"></textarea>
                </div>
            </div>
        </div>
        <span class="remove-item" onclick="removeItem(this, 'project')"><i class="fas fa-times"></i></span>
    `;
    
    projectsList.appendChild(newItem);
}

// Add new certification
function addCertification() {
    const certificationsList = document.getElementById('certificationsList');
    const itemCount = certificationsList.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'certification-item';
    newItem.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-control" name="certifications[${itemCount}].title" placeholder="AWS Certified Solutions Architect">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Issuing Organization</label>
                    <input type="text" class="form-control" name="certifications[${itemCount}].issuer" placeholder="Amazon Web Services">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Date</label>
                    <input type="date" class="form-control" name="certifications[${itemCount}].date">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Certificate Link (Optional)</label>
                    <input type="url" class="form-control" name="certifications[${itemCount}].url" placeholder="https://credential.net/...">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="mb-3">
                    <label class="form-label">Description (Optional)</label>
                    <textarea class="form-control" name="certifications[${itemCount}].description" rows="2" placeholder="Brief description of the certification or its significance"></textarea>
                </div>
            </div>
        </div>
        <span class="remove-item" onclick="removeItem(this, 'certification')"><i class="fas fa-times"></i></span>
    `;
    
    certificationsList.appendChild(newItem);
}

// Add new language
function addLanguage() {
    const languagesList = document.getElementById('languagesList');
    const itemCount = languagesList.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'language-item';
    newItem.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Language</label>
                    <input type="text" class="form-control" name="languages[${itemCount}].name" placeholder="English">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Proficiency</label>
                    <select class="form-select" name="languages[${itemCount}].level">
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                    </select>
                </div>
            </div>
        </div>
        <span class="remove-item" onclick="removeItem(this, 'language')"><i class="fas fa-times"></i></span>
    `;
    
    languagesList.appendChild(newItem);
}

// Add experience
function addExperience() {
    const experienceList = document.getElementById('experienceList');
    const itemCount = experienceList.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Company</label>
                    <input type="text" class="form-control" name="experience[${itemCount}].company" placeholder="Company Name">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Job Title</label>
                    <input type="text" class="form-control" name="experience[${itemCount}].position" placeholder="Software Developer">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Location</label>
                    <input type="text" class="form-control" name="experience[${itemCount}].location" placeholder="City, Country">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Employment Type</label>
                    <select class="form-select" name="experience[${itemCount}].type">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" name="experience[${itemCount}].startDate">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">End Date</label>
                    <input type="date" class="form-control" name="experience[${itemCount}].endDate">
                    <div class="form-check mt-2">
                        <input type="checkbox" class="form-check-input" name="experience[${itemCount}].currentJob" id="currentJob${itemCount}">
                        <label class="form-check-label" for="currentJob${itemCount}">Current Job</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="mb-3">
                    <label class="form-label">Responsibilities & Achievements</label>
                    <textarea class="form-control" name="experience[${itemCount}].description" rows="3" placeholder="• Developed a new feature that increased user engagement by 20%&#10;• Led a team of 5 developers to deliver project ahead of schedule"></textarea>
                    <small class="form-text text-muted">Use bullet points (•) for each responsibility or achievement</small>
                </div>
            </div>
        </div>
        <span class="remove-item" onclick="removeItem(this, 'experience')"><i class="fas fa-times"></i></span>
    `;
    
    experienceList.appendChild(newItem);
}

// Remove item
function removeItem(element, type) {
    const item = element.closest(`.${type}-item`);
    if (item) {
        item.remove();
    }
}

// Generate resume preview
function generateResumePreview(template, data, container) {
    console.log("Generating preview for template:", template);
    console.log("With data:", data);
    
    // Basic structure for all templates
    let html = `
        <div class="resume-${template}">
            <div class="resume-header">
                <h1>${data.fullName || 'Your Name'}</h1>
                <div class="contact-info">
                    ${data.email ? `<div><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                    ${data.phone ? `<div><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                    ${data.location ? `<div><i class="fas fa-map-marker-alt"></i> ${data.location}</div>` : ''}
                </div>
                <div class="social-links">
                    ${data.linkedin ? `<a href="${data.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${data.github ? `<a href="${data.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                    ${data.website ? `<a href="${data.website}" target="_blank"><i class="fas fa-globe"></i></a>` : ''}
                </div>
            </div>
            
            <div class="resume-body">
                ${data.summary ? `
                <div class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${data.summary}</p>
                </div>` : ''}
                
                ${generateSkillsSection(data)}
                ${generateEducationSection(data)}
                ${generateExperienceSection(data)}
                ${generateProjectsSection(data)}
                ${generateCertificationsSection(data)}
                ${generateLanguagesSection(data)}
                
                ${data.hobbies ? `
                <div class="resume-section">
                    <h2>Hobbies & Interests</h2>
                    <p>${data.hobbies}</p>
                </div>` : ''}
                
                ${data.volunteer ? `
                <div class="resume-section">
                    <h2>Volunteer Experience</h2>
                    <p>${data.volunteer}</p>
                </div>` : ''}
            </div>
        </div>
    `;
    
    // Set the content
    container.innerHTML = html;
    
    // Add CSS classes for styling based on template
    container.classList.add(`template-${template}`);
}

function generateSkillsSection(data) {
    let html = '';
    
    // Initialize skills arrays
    let technicalSkills = [];
    let softSkills = [];
    
    // Parse technical skills safely
    if (data.technicalSkills) {
        try {
            // Try parsing as JSON
            technicalSkills = JSON.parse(data.technicalSkills);
        } catch (e) {
            console.warn('Error parsing technical skills JSON:', e);
            // If parsing fails, check if it's already an array
            if (Array.isArray(data.technicalSkills)) {
                technicalSkills = data.technicalSkills;
            } else if (typeof data.technicalSkills === 'string') {
                // If it's a string that's not valid JSON, treat it as a single skill
                technicalSkills = [data.technicalSkills];
            }
        }
    }
    
    // Parse soft skills safely
    if (data.softSkills) {
        try {
            // Try parsing as JSON
            softSkills = JSON.parse(data.softSkills);
        } catch (e) {
            console.warn('Error parsing soft skills JSON:', e);
            // If parsing fails, check if it's already an array
            if (Array.isArray(data.softSkills)) {
                softSkills = data.softSkills;
            } else if (typeof data.softSkills === 'string') {
                // If it's a string that's not valid JSON, treat it as a single skill
                softSkills = [data.softSkills];
            }
        }
    }
    
    if (technicalSkills.length > 0 || softSkills.length > 0) {
        html += '<div class="resume-section"><h2>Skills</h2>';
        
        if (technicalSkills.length > 0) {
            html += '<div class="skills-subsection"><h3>Technical Skills</h3><div class="skills-list">';
            technicalSkills.forEach(skill => {
                html += `<span class="skill-tag">${skill}</span>`;
            });
            html += '</div></div>';
        }
        
        if (softSkills.length > 0) {
            html += '<div class="skills-subsection"><h3>Soft Skills</h3><div class="skills-list">';
            softSkills.forEach(skill => {
                html += `<span class="skill-tag">${skill}</span>`;
            });
            html += '</div></div>';
        }
        
        html += '</div>';
    }
    
    return html;
}

function generateEducationSection(data) {
    let html = '';
    const educationItems = [];
    
    // Parse education items from form data
    for (const key in data) {
        if (key.startsWith('education[')) {
            const match = key.match(/education\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!educationItems[index]) {
                    educationItems[index] = {};
                }
                
                educationItems[index][field] = data[key];
            }
        }
    }
    
    // Filter out empty items
    const filteredItems = educationItems.filter(item => item && item.institution);
    
    if (filteredItems.length > 0) {
        html += '<div class="resume-section"><h2>Education</h2>';
        
        filteredItems.forEach(item => {
            html += `
                <div class="item">
                    <div class="item-header">
                        <h3>${item.degree || ''}</h3>
                        <div class="item-subheader">
                            <span class="item-title">${item.institution || ''}</span>
                            ${item.location ? `<span>${item.location}</span>` : ''}
                            ${item.grade ? `<span>GPA: ${item.grade}</span>` : ''}
                        </div>
                    </div>
                    <div class="item-date">
                        ${formatDateRange(item.startDate, item.endDate, item.current)}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    return html;
}

function generateExperienceSection(data) {
    let html = '';
    const experienceItems = [];
    
    // Parse experience items from form data
    for (const key in data) {
        if (key.startsWith('experience[')) {
            const match = key.match(/experience\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!experienceItems[index]) {
                    experienceItems[index] = {};
                }
                
                experienceItems[index][field] = data[key];
            }
        }
    }
    
    // Filter out empty items
    const filteredItems = experienceItems.filter(item => item && item.company);
    
    if (filteredItems.length > 0) {
        html += '<div class="resume-section"><h2>Work Experience</h2>';
        
        filteredItems.forEach(item => {
            html += `
                <div class="item">
                    <div class="item-header">
                        <h3>${item.position || ''}</h3>
                        <div class="item-subheader">
                            <span class="item-title">${item.company || ''}</span>
                            ${item.location ? `<span>${item.location}</span>` : ''}
                            ${item.type ? `<span>${item.type}</span>` : ''}
                        </div>
                    </div>
                    <div class="item-date">
                        ${formatDateRange(item.startDate, item.endDate, item.currentJob)}
                    </div>
                    ${item.description ? `<div class="item-description">${formatDescription(item.description)}</div>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    return html;
}

function generateProjectsSection(data) {
    let html = '';
    const projectItems = [];
    
    // Parse project items from form data
    for (const key in data) {
        if (key.startsWith('projects[')) {
            const match = key.match(/projects\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!projectItems[index]) {
                    projectItems[index] = {};
                }
                
                projectItems[index][field] = data[key];
            }
        }
    }
    
    // Filter out empty items
    const filteredItems = projectItems.filter(item => item && item.title);
    
    if (filteredItems.length > 0) {
        html += '<div class="resume-section"><h2>Projects</h2>';
        
        filteredItems.forEach(item => {
            html += `
                <div class="item">
                    <div class="item-header">
                        <h3>${item.title || ''}</h3>
                        <div class="item-subheader">
                            ${item.technologies ? `<span>${item.technologies}</span>` : ''}
                        </div>
                    </div>
                    <div class="item-links">
                        ${item.github ? `<a href="${item.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                        ${item.demo ? `<a href="${item.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                    </div>
                    ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    return html;
}

function generateCertificationsSection(data) {
    let html = '';
    const certificationItems = [];
    
    // Parse certification items from form data
    for (const key in data) {
        if (key.startsWith('certifications[')) {
            const match = key.match(/certifications\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!certificationItems[index]) {
                    certificationItems[index] = {};
                }
                
                certificationItems[index][field] = data[key];
            }
        }
    }
    
    // Filter out empty items
    const filteredItems = certificationItems.filter(item => item && item.title);
    
    if (filteredItems.length > 0) {
        html += '<div class="resume-section"><h2>Certifications & Awards</h2>';
        
        filteredItems.forEach(item => {
            html += `
                <div class="item">
                    <div class="item-header">
                        <h3>${item.title || ''}</h3>
                        <div class="item-subheader">
                            <span class="item-title">${item.issuer || ''}</span>
                        </div>
                    </div>
                    <div class="item-date">
                        ${item.date ? new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}
                    </div>
                    ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                    ${item.url ? `<div class="item-links"><a href="${item.url}" target="_blank"><i class="fas fa-certificate"></i> View Certificate</a></div>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    return html;
}

function generateLanguagesSection(data) {
    let html = '';
    const languageItems = [];
    
    // Parse language items from form data
    for (const key in data) {
        if (key.startsWith('languages[')) {
            const match = key.match(/languages\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!languageItems[index]) {
                    languageItems[index] = {};
                }
                
                languageItems[index][field] = data[key];
            }
        }
    }
    
    // Filter out empty items
    const filteredItems = languageItems.filter(item => item && item.name);
    
    if (filteredItems.length > 0) {
        html += '<div class="resume-section"><h2>Languages</h2><div class="languages-list">';
        
        filteredItems.forEach(item => {
            html += `<div class="language-item"><span class="language-name">${item.name}</span> - <span class="language-level">${item.level || ''}</span></div>`;
        });
        
        html += '</div></div>';
    }
    
    return html;
}

function formatDateRange(startDate, endDate, isCurrent) {
    let dateStr = '';
    
    if (startDate) {
        dateStr += new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    
    if (isCurrent === 'on') {
        dateStr += ' - Present';
    } else if (endDate) {
        dateStr += ' - ' + new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    
    return dateStr;
}

function formatDescription(text) {
    if (!text) return '';
    
    // Split by bullet points and create HTML
    return text.split('•').filter(item => item.trim() !== '')
        .map(item => `<li>${item.trim()}</li>`)
        .join('');
}

// Skip experience section
function skipExperience() {
    if (confirm('Are you sure you want to skip the experience section? You can always add it later.')) {
        // Clear any existing experience items
        const experienceList = document.getElementById('experienceList');
        experienceList.innerHTML = '';
        
        // Add a hidden input to indicate no experience
        const noExperienceInput = document.createElement('input');
        noExperienceInput.type = 'hidden';
        noExperienceInput.name = 'noExperience';
        noExperienceInput.value = 'true';
        experienceList.appendChild(noExperienceInput);
        
        // Proceed to next step
        nextStep(4);
    }
}

// Save progress function with visual feedback
async function saveProgress(step, saveToServer = true) {
    try {
        // Show saving indicator
        showSavingIndicator();
        
        // Collect all form data
        const form = document.getElementById('resumeForm');
        if (!form) throw new Error('Form not found');
        
        // Create a form data object
        const formData = new FormData(form);
        const data = {};
        
        // Process form data
        for (const [key, value] of formData.entries()) {
            // Handle nested fields (like education[0].degree)
            if (key.includes('[') && key.includes(']')) {
                const mainKey = key.substring(0, key.indexOf('['));
                const subKey = key.substring(key.indexOf('['));
                
                // Initialize array or object if needed
                if (!data[mainKey]) {
                    // Check if it's an array or object
                    if (subKey.match(/^\[\d+\]/)) {
                        data[mainKey] = [];
                    } else {
                        data[mainKey] = {};
                    }
                }
                
                // Process array notation [0].field
                if (subKey.match(/^\[\d+\]\./)) {
                    const index = parseInt(subKey.match(/\[(\d+)\]/)[1]);
                    const field = subKey.match(/\.\w+$/)[0].substring(1);
                    
                    // Initialize array index if needed
                    if (!data[mainKey][index]) {
                        data[mainKey][index] = {};
                    }
                    
                    data[mainKey][index][field] = value;
                }
                // Process object notation [field]
                else if (subKey.match(/^\[\w+\]$/)) {
                    const field = subKey.match(/\[(\w+)\]/)[1];
                    data[mainKey][field] = value;
                }
            } else {
                data[key] = value;
            }
        }
        
        // Process skills data separately
        const techSkills = document.getElementById('technicalSkills');
        if (techSkills && techSkills.value) {
            try {
                data.technicalSkills = JSON.parse(techSkills.value);
            } catch (error) {
                console.error('Error parsing technical skills:', error);
                data.technicalSkills = [];
            }
        }
        
        const softSkills = document.getElementById('softSkills');
        if (softSkills && softSkills.value) {
            try {
                data.softSkills = JSON.parse(softSkills.value);
            } catch (error) {
                console.error('Error parsing soft skills:', error);
                data.softSkills = [];
            }
        }
        
        // Store step-specific data
        data.step = step;
        
        // Save to sessionStorage
        sessionStorage.setItem('resumeProgress', JSON.stringify(data));
        
        // If user is logged in and saveToServer is true, save to server
        if (saveToServer && isUserLoggedIn()) {
            try {
                // Get the structured resume data
                const resumeData = parseResumeFormData(form);
                
                // Add the template information
                resumeData.template = sessionStorage.getItem('selectedTemplate') || 'professional';
                
                // Get the current resume ID from sessionStorage if it exists
                const currentResumeId = sessionStorage.getItem('currentResumeId');
                
                let result;
                
                if (currentResumeId) {
                    // Update existing resume
                    result = await updateResume(currentResumeId, resumeData);
                    sessionStorage.setItem('currentResumeId', result._id);
                    console.log('Resume updated on server:', result);
                } else {
                    // Create new resume
                    result = await createResume(resumeData);
                    // Store the ID for future updates
                    sessionStorage.setItem('currentResumeId', result._id);
                    console.log('Resume created on server:', result);
                }
            } catch (error) {
                console.error('Error saving to server:', error);
                // Show error notification but don't throw since we've saved locally
                showToast('Changes saved locally, but could not save to server: ' + error.message, 'warning');
                showSaveSuccessIndicator();
                return true; // Return true since we've saved to sessionStorage
            }
        }
        
        console.log('Progress saved successfully!');
        
        // Show success indicator
        showSaveSuccessIndicator();
        
        return true;
    } catch (error) {
        console.error('Error saving progress:', error);
        
        // Show error indicator
        showSaveErrorIndicator();
        
        return false;
    }
}

// Show saving indicator
function showSavingIndicator() {
    // Create save indicator if it doesn't exist
    let saveIndicator = document.getElementById('saveIndicator');
    
    if (!saveIndicator) {
        saveIndicator = document.createElement('div');
        saveIndicator.id = 'saveIndicator';
        saveIndicator.className = 'save-indicator';
        document.body.appendChild(saveIndicator);
    }
    
    // Update indicator content for saving state
    saveIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving your progress...';
    saveIndicator.className = 'save-indicator show';
}

// Show success indicator
function showSaveSuccessIndicator() {
    const saveIndicator = document.getElementById('saveIndicator');
    if (saveIndicator) {
        saveIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Progress saved successfully!';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            saveIndicator.classList.remove('show');
        }, 3000);
    }
}

// Show error indicator
function showSaveErrorIndicator() {
    const saveIndicator = document.getElementById('saveIndicator');
    if (saveIndicator) {
        saveIndicator.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error saving progress!';
        saveIndicator.className = 'save-indicator show error';
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            saveIndicator.classList.remove('show', 'error');
        }, 4000);
    }
}

// Updated load saved progress
function loadSavedProgress() {
    try {
        const savedData = sessionStorage.getItem('resumeProgress');
        if (!savedData) return;
        
        const formData = JSON.parse(savedData);
        
        // Fill in form fields
        fillFormWithData(formData);
        
        // Go to the last active step
        const lastStep = getLastSavedStep();
        if (lastStep > 1) {
            setTimeout(() => navigateToStep(lastStep, 'next'), 500);
        }
        
        // Show notification
        showToast('Your progress has been loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading saved progress:', error);
        showToast('Error loading your saved progress', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create or get toast container
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = createToastContainer();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 300);
        }
    }, 5000);
}

// Create toast container with styles
function createToastContainer() {
    // Add styles for toasts
    const style = document.createElement('style');
    style.textContent = `
        #toastContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
        }
        
        .toast {
            background: var(--card-bg);
            color: var(--text-color);
            border-radius: var(--border-radius-md);
            padding: 15px;
            display: flex;
            align-items: center;
            box-shadow: var(--shadow-md);
            transform: translateX(120%);
            transition: transform 0.3s ease;
            border-left: 4px solid #007bff;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-success {
            border-left-color: var(--success-color);
        }
        
        .toast-error {
            border-left-color: var(--danger-color);
        }
        
        .toast-warning {
            border-left-color: var(--warning-color);
        }
        
        .toast-info {
            border-left-color: var(--info-color);
        }
        
        .toast-icon {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .toast-success .toast-icon {
            color: var(--success-color);
        }
        
        .toast-error .toast-icon {
            color: var(--danger-color);
        }
        
        .toast-warning .toast-icon {
            color: var(--warning-color);
        }
        
        .toast-info .toast-icon {
            color: var(--info-color);
        }
        
        .toast-content {
            flex: 1;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: var(--muted-text);
            cursor: pointer;
            font-size: 0.9rem;
            padding: 0;
            margin-left: 10px;
        }
        
        .toast-close:hover {
            color: var(--text-color);
        }
    `;
    document.head.appendChild(style);
    
    // Create container
    const container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
    
    return container;
}

// Skill suggestions database
const skillSuggestions = {
    // Technical skills suggestions
    technical: {
        'java': ['Spring Boot', 'Hibernate', 'Maven', 'JUnit', 'Java EE', 'Android Development', 'Microservices', 'JPA'],
        'python': ['Django', 'Flask', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'FastAPI', 'Data Science'],
        'javascript': ['React', 'Node.js', 'TypeScript', 'Angular', 'Vue.js', 'Express.js', 'jQuery', 'Next.js'],
        'react': ['Redux', 'React Native', 'Next.js', 'Material-UI', 'Styled Components', 'React Router', 'GraphQL'],
        'node': ['Express.js', 'MongoDB', 'REST APIs', 'Socket.io', 'JWT', 'WebSockets', 'NPM'],
        'sql': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Database Design', 'ORM', 'NoSQL'],
        'aws': ['EC2', 'S3', 'Lambda', 'DynamoDB', 'CloudFront', 'Route 53', 'CloudFormation'],
        'docker': ['Kubernetes', 'Containerization', 'CI/CD', 'Microservices', 'DevOps', 'AWS ECS'],
        'html': ['CSS', 'JavaScript', 'Responsive Design', 'Bootstrap', 'Tailwind CSS', 'Accessibility'],
        'css': ['SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'CSS Grid', 'Flexbox', 'Responsive Design']
    },
    // Soft skills suggestions
    soft: {
        'leadership': ['Team Management', 'Strategic Planning', 'Decision Making', 'Conflict Resolution', 'Mentoring'],
        'communication': ['Public Speaking', 'Written Communication', 'Active Listening', 'Presentation Skills', 'Negotiation'],
        'problem': ['Critical Thinking', 'Analytical Skills', 'Decision Making', 'Troubleshooting', 'Innovation'],
        'team': ['Collaboration', 'Team Building', 'Conflict Resolution', 'Cross-functional Teams', 'Agile'],
        'time': ['Project Management', 'Prioritization', 'Deadline Management', 'Organization', 'Efficiency'],
        'adaptability': ['Change Management', 'Flexibility', 'Learning Agility', 'Resilience', 'Innovation'],
        'creativity': ['Innovation', 'Design Thinking', 'Problem Solving', 'Visual Thinking', 'Brainstorming'],
        'analytical': ['Data Analysis', 'Critical Thinking', 'Research', 'Problem Solving', 'Decision Making'],
        'interpersonal': ['Relationship Building', 'Networking', 'Conflict Resolution', 'Emotional Intelligence', 'Teamwork'],
        'project': ['Planning', 'Organization', 'Risk Management', 'Resource Management', 'Stakeholder Management']
    }
};

// Initialize skill suggestions
function initializeSkillSuggestions() {
    const techSkillInput = document.getElementById('techSkillInput');
    const softSkillInput = document.getElementById('softSkillInput');
    
    if (techSkillInput) {
        techSkillInput.addEventListener('input', function() {
            showSkillSuggestions(this, 'tech');
        });
    }
    
    if (softSkillInput) {
        softSkillInput.addEventListener('input', function() {
            showSkillSuggestions(this, 'soft');
        });
    }
    
    // Initialize project technologies suggestions
    initializeProjectTechSuggestions();
}

// Initialize project technologies suggestions
function initializeProjectTechSuggestions() {
    // Add event listeners to existing technology fields
    document.querySelectorAll('input[name^="projects"][name$=".technologies"]').forEach(techInput => {
        techInput.addEventListener('input', function() {
            showTechnologySuggestions(this);
        });
    });
    
    // Add a mutation observer to detect when new project items are added
    const projectsList = document.getElementById('projectsList');
    if (projectsList) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const techInput = node.querySelector('input[name$=".technologies"]');
                            if (techInput) {
                                techInput.addEventListener('input', function() {
                                    showTechnologySuggestions(this);
                                });
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(projectsList, { childList: true });
    }
}

// Show technology suggestions for project fields
function showTechnologySuggestions(inputElement) {
    // Remove existing suggestions
    removeTechnologySuggestions();
    
    const input = inputElement.value.trim();
    if (!input) return;
    
    // Find matching technologies
    const words = input.toLowerCase().split(/[\s,]+/);
    const lastWord = words[words.length - 1];
    
    if (!lastWord || lastWord.length < 2) return;
    
    const suggestions = findTechnologySuggestions(lastWord);
    if (suggestions.length === 0) return;
    
    // Create suggestions container
    const container = document.createElement('div');
    container.className = 'skill-suggestions';
    container.id = 'technologySuggestions';
    
    // Add suggestions
    suggestions.forEach(tech => {
        const suggestion = document.createElement('div');
        suggestion.className = 'skill-suggestion';
        suggestion.textContent = tech;
        suggestion.onclick = () => {
            // Replace the last word with the selected technology
            const currentValue = inputElement.value;
            const updatedValue = currentValue.substring(0, currentValue.lastIndexOf(lastWord)) + tech;
            inputElement.value = updatedValue;
            removeTechnologySuggestions();
        };
        container.appendChild(suggestion);
    });
    
    // Position the suggestions under the input
    inputElement.parentNode.appendChild(container);
    
    // Add event listener to hide suggestions when clicking outside
    document.addEventListener('click', function hideOnClickOutside(event) {
        if (!container.contains(event.target) && event.target !== inputElement) {
            removeTechnologySuggestions();
            document.removeEventListener('click', hideOnClickOutside);
        }
    });
}

// Find matching technology suggestions
function findTechnologySuggestions(input) {
    const suggestions = [];
    const lowerInput = input.toLowerCase();
    
    // Common technologies
    const technologies = [
        'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 
        'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material-UI',
        'jQuery', 'PHP', 'Laravel', 'CodeIgniter', 'Symfony', 'WordPress',
        'Python', 'Django', 'Flask', 'FastAPI', 'NumPy', 'Pandas', 'TensorFlow', 'PyTorch',
        'Java', 'Spring Boot', 'Hibernate', 'Maven', 'Gradle',
        'C#', '.NET', 'ASP.NET', 'Entity Framework',
        'Ruby', 'Ruby on Rails', 'Sinatra',
        'Go', 'Rust', 'Kotlin', 'Swift',
        'SQL', 'MySQL', 'PostgreSQL', 'SQLite', 'Oracle', 'SQL Server',
        'MongoDB', 'Mongoose', 'Redis', 'Cassandra', 'DynamoDB', 'Firebase',
        'GraphQL', 'REST API', 'SOAP', 'Swagger', 'OpenAPI',
        'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',
        'Docker', 'Kubernetes', 'Jenkins', 'Travis CI', 'CircleCI', 'GitHub Actions',
        'AWS', 'Azure', 'Google Cloud', 'Heroku', 'Netlify', 'Vercel',
        'WebSockets', 'Socket.io', 'RabbitMQ', 'Kafka', 'Redis Pub/Sub',
        'JWT', 'OAuth', 'OpenID Connect', 'Passport.js', 'Auth0',
        'Webpack', 'Babel', 'ESLint', 'Prettier', 'Jest', 'Mocha', 'Chai', 'Cypress',
        'Redux', 'MobX', 'Vuex', 'NgRx', 'Context API', 'Recoil',
        'Responsive Design', 'Progressive Web Apps', 'WebAssembly', 'ElectronJS'
    ];
    
    // Find matching technologies
    technologies.forEach(tech => {
        if (tech.toLowerCase().includes(lowerInput)) {
            suggestions.push(tech);
        }
    });
    
    // Return top 5 suggestions
    return suggestions.slice(0, 5);
}

// Remove technology suggestions
function removeTechnologySuggestions() {
    const suggestions = document.getElementById('technologySuggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

// Show skill suggestions
function showSkillSuggestions(input, type) {
    if (!input || !input.value.trim()) {
        removeSkillSuggestions();
        return;
    }
    
    const skillInput = input.value.trim().toLowerCase();
    const suggestions = findSkillSuggestions(skillInput, type);
    
    if (suggestions.length === 0) return;
    
    // Remove any existing suggestions
    removeSkillSuggestions();
    
    // Create suggestions container
    const suggestionsElement = document.createElement('div');
    suggestionsElement.className = 'skill-suggestions active';
    suggestionsElement.id = 'skillSuggestions';
    
    // Add suggestions to container
    suggestions.forEach((suggestion, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        
        // If suggestion doesn't exactly match the input, highlight the difference
        if (suggestion.toLowerCase() !== skillInput) {
            const regex = new RegExp(`(${skillInput})`, 'i');
            suggestionItem.innerHTML = suggestion.replace(regex, '<strong>$1</strong>');
        } else {
            suggestionItem.textContent = suggestion;
        }
        
        // Add data attribute to identify which type of skill
        suggestionItem.dataset.type = type;
        
        // Highlight first suggestion
        if (index === 0) suggestionItem.classList.add('highlighted');
        
        // Add click event
        suggestionItem.addEventListener('click', () => {
            input.value = suggestion;
            removeSkillSuggestions();
            
            // Add the skill
            if (type === 'tech') {
                addTechSkill(suggestion);
            } else {
                addSoftSkill(suggestion);
            }
            
            // Clear input
            input.value = '';
        });
        
        suggestionsElement.appendChild(suggestionItem);
    });
    
    // Position and show the suggestions
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(suggestionsElement);
    
    // Setup keyboard navigation
    input.addEventListener('keydown', handleSuggestionKeyNav);
}

// Handle keyboard navigation in suggestions dropdown
function handleSuggestionKeyNav(e) {
    const suggestionsElement = document.getElementById('skillSuggestions');
    if (!suggestionsElement) return;
    
    const items = suggestionsElement.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;
    
    const highlighted = suggestionsElement.querySelector('.highlighted');
    let highlightedIndex = Array.from(items).indexOf(highlighted);
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            // Clear current highlight
            if (highlighted) highlighted.classList.remove('highlighted');
            
            // Highlight next item or wrap to first
            highlightedIndex = (highlightedIndex + 1) % items.length;
            items[highlightedIndex].classList.add('highlighted');
            items[highlightedIndex].scrollIntoView({ block: 'nearest' });
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            // Clear current highlight
            if (highlighted) highlighted.classList.remove('highlighted');
            
            // Highlight previous item or wrap to last
            highlightedIndex = highlightedIndex <= 0 ? items.length - 1 : highlightedIndex - 1;
            items[highlightedIndex].classList.add('highlighted');
            items[highlightedIndex].scrollIntoView({ block: 'nearest' });
            break;
            
        case 'Enter':
            e.preventDefault();
            if (highlighted) {
                // Simulate click on highlighted item
                highlighted.click();
            }
            break;
            
        case 'Escape':
            e.preventDefault();
            removeSkillSuggestions();
            break;
    }
}

// Remove skill suggestions
function removeSkillSuggestions() {
    const techSuggestions = document.getElementById('technicalSkillSuggestions');
    const softSuggestions = document.getElementById('softSkillSuggestions');
    
    if (techSuggestions) techSuggestions.remove();
    if (softSuggestions) softSuggestions.remove();
}

// Auto-correct technical skill spelling
function autoCorrectTechnicalSkill(skill) {
    const lowerSkill = skill.toLowerCase();
    return technicalSpellCorrections[lowerSkill] || skill; // Return correction or original if no correction found
}

// Common technical skill misspellings and their corrections
const technicalSpellCorrections = {
    'javascript': 'JavaScript',
    'java script': 'JavaScript',
    'js': 'JavaScript',
    'java': 'Java',
    'typescript': 'TypeScript',
    'type script': 'TypeScript',
    'ts': 'TypeScript',
    'react': 'React',
    'reactjs': 'React',
    'react.js': 'React',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'node.js': 'Node.js',
    'express': 'Express.js',
    'expressjs': 'Express.js',
    'mongo': 'MongoDB',
    'mongodb': 'MongoDB',
    'sql': 'SQL',
    'mysql': 'MySQL',
    'postgres': 'PostgreSQL',
    'postgresql': 'PostgreSQL',
    'python': 'Python',
    'django': 'Django',
    'flask': 'Flask',
    'html': 'HTML',
    'html5': 'HTML5',
    'css': 'CSS',
    'css3': 'CSS3',
    'sass': 'SASS',
    'scss': 'SCSS',
    'less': 'LESS',
    'php': 'PHP',
    'jquery': 'jQuery',
    'angular': 'Angular',
    'vuejs': 'Vue.js',
    'vue.js': 'Vue.js',
    'vue': 'Vue.js',
    'redux': 'Redux',
    'git': 'Git',
    'github': 'GitHub',
    'gitlab': 'GitLab',
    'aws': 'AWS',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'k8s': 'Kubernetes',
    'ci/cd': 'CI/CD',
    'cicd': 'CI/CD',
    'jenkins': 'Jenkins',
    'linux': 'Linux',
    'unix': 'Unix',
    'c++': 'C++',
    'cpp': 'C++',
    'c#': 'C#',
    'csharp': 'C#',
    'dotnet': '.NET',
    '.net': '.NET',
    'azure': 'Azure',
    'gcp': 'Google Cloud Platform',
    'tensorflow': 'TensorFlow',
    'pytorch': 'PyTorch',
    'ai': 'AI',
    'ml': 'Machine Learning',
    'machine learning': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'iot': 'IoT',
    'blockchain': 'Blockchain',
    'agile': 'Agile',
    'scrum': 'Scrum',
    'kanban': 'Kanban',
    'jira': 'Jira',
    'rest': 'REST',
    'restful': 'RESTful',
    'restful api': 'RESTful API',
    'graphql': 'GraphQL',
    'oauth': 'OAuth',
    'jwt': 'JWT',
    'json': 'JSON',
    'xml': 'XML',
    'api': 'API'
};

// Check email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check if user is logged in
function isUserLoggedIn() {
    return sessionStorage.getItem('isAuthenticated') === 'true';
} 