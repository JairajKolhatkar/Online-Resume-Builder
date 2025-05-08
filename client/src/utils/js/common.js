document.addEventListener('DOMContentLoaded', function() {
    // Navigation between form sections
    const formSections = document.querySelectorAll('.form-section');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    // Set initial active section if none is active
    let activeSection = document.querySelector('.form-section.active');
    if (!activeSection && formSections.length > 0) {
        formSections[0].classList.add('active');
    }
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.closest('.form-section');
            const nextSection = currentSection.nextElementSibling;
            
            if (nextSection) {
                currentSection.classList.remove('active');
                nextSection.classList.add('active');
                window.scrollTo(0, 0);
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.closest('.form-section');
            const prevSection = currentSection.previousElementSibling;
            
            if (prevSection) {
                currentSection.classList.remove('active');
                prevSection.classList.add('active');
                window.scrollTo(0, 0);
            }
        });
    });
    
    // Dynamic form fields (add/remove education, experience, skills)
    const addEducationBtn = document.getElementById('addEducation');
    const educationEntries = document.getElementById('educationEntries');
    
    addEducationBtn.addEventListener('click', function() {
        const educationEntry = document.createElement('div');
        educationEntry.className = 'education-entry';
        educationEntry.innerHTML = `
            <div class="form-group">
                <label for="institution">Institution</label>
                <input type="text" name="institution[]" required>
            </div>
            <div class="form-group">
                <label for="degree">Degree</label>
                <input type="text" name="degree[]" required>
            </div>
            <div class="form-group">
                <label for="fieldOfStudy">Field of Study</label>
                <input type="text" name="fieldOfStudy[]">
            </div>
            <div class="form-row">
                <div class="form-group half">
                    <label for="startDate">Start Date</label>
                    <input type="date" name="eduStartDate[]">
                </div>
                <div class="form-group half">
                    <label for="endDate">End Date</label>
                    <input type="date" name="eduEndDate[]">
                </div>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea name="eduDescription[]" rows="3"></textarea>
            </div>
            <button type="button" class="remove-btn">Remove</button>
        `;
        educationEntries.appendChild(educationEntry);
        
        educationEntry.querySelector('.remove-btn').addEventListener('click', function() {
            educationEntries.removeChild(educationEntry);
        });
    });
    
    const addExperienceBtn = document.getElementById('addExperience');
    const experienceEntries = document.getElementById('experienceEntries');
    
    addExperienceBtn.addEventListener('click', function() {
        const experienceEntry = document.createElement('div');
        experienceEntry.className = 'experience-entry';
        experienceEntry.innerHTML = `
            <div class="form-group">
                <label for="company">Company</label>
                <input type="text" name="company[]" required>
            </div>
            <div class="form-group">
                <label for="position">Position</label>
                <input type="text" name="position[]" required>
            </div>
            <div class="form-group">
                <label for="location">Location</label>
                <input type="text" name="location[]">
            </div>
            <div class="form-row">
                <div class="form-group half">
                    <label for="startDate">Start Date</label>
                    <input type="date" name="expStartDate[]">
                </div>
                <div class="form-group half">
                    <label for="endDate">End Date</label>
                    <input type="date" name="expEndDate[]">
                </div>
            </div>
            <div class="form-group checkbox">
                <input type="checkbox" id="currentJob" name="currentJob[]">
                <label for="currentJob">Current Job</label>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea name="expDescription[]" rows="3"></textarea>
            </div>
            <button type="button" class="remove-btn">Remove</button>
        `;
        experienceEntries.appendChild(experienceEntry);
        
        experienceEntry.querySelector('.remove-btn').addEventListener('click', function() {
            experienceEntries.removeChild(experienceEntry);
        });
    });
    
    const addSkillBtn = document.getElementById('addSkill');
    const skillEntries = document.getElementById('skillEntries');
    
    addSkillBtn.addEventListener('click', function() {
        const skillEntry = document.createElement('div');
        skillEntry.className = 'skill-entry';
        skillEntry.innerHTML = `
            <div class="form-row">
                <div class="form-group three-quarters">
                    <label for="skillName">Skill</label>
                    <input type="text" name="skillName[]" required>
                </div>
                <div class="form-group quarter">
                    <label for="proficiency">Level (1-5)</label>
                    <input type="number" name="proficiency[]" min="1" max="5" value="3">
                </div>
            </div>
            <button type="button" class="remove-btn">Remove</button>
        `;
        skillEntries.appendChild(skillEntry);
        
        skillEntry.querySelector('.remove-btn').addEventListener('click', function() {
            skillEntries.removeChild(skillEntry);
        });
    });
    
    // Resume form submission
    const resumeForm = document.getElementById('resumeForm');
    resumeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(resumeForm);
        const resumeData = {
            title: formData.get('fullName') + "'s Resume",
            templateName: formData.get('template'),
            personalInfo: {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address')
            },
            summary: formData.get('summary'),
            educations: getEducationData(formData),
            experiences: getExperienceData(formData),
            skills: getSkillData(formData)
        };
        
        // For demo purposes (without backend), just show the preview and alert
        updateCompletePreview(resumeData);
        
        // Show success message with PDF export option
        const downloadConfirm = confirm('Resume created successfully! Would you like to download it as PDF?');
        if (downloadConfirm) {
            generatePDF(resumeData.personalInfo.fullName);
        }
    });
    
    // Helper functions to organize form data
    function getEducationData(formData) {
        const institutions = formData.getAll('institution[]');
        const degrees = formData.getAll('degree[]');
        const fieldsOfStudy = formData.getAll('fieldOfStudy[]');
        const startDates = formData.getAll('eduStartDate[]');
        const endDates = formData.getAll('eduEndDate[]');
        const descriptions = formData.getAll('eduDescription[]');
        
        const educations = [];
        for (let i = 0; i < institutions.length; i++) {
            educations.push({
                institution: institutions[i],
                degree: degrees[i],
                fieldOfStudy: fieldsOfStudy[i],
                startDate: startDates[i],
                endDate: endDates[i],
                description: descriptions[i]
            });
        }
        return educations;
    }
    
    function getExperienceData(formData) {
        const companies = formData.getAll('company[]');
        const positions = formData.getAll('position[]');
        const locations = formData.getAll('location[]');
        const startDates = formData.getAll('expStartDate[]');
        const endDates = formData.getAll('expEndDate[]');
        const currentJobs = formData.getAll('currentJob[]');
        const descriptions = formData.getAll('expDescription[]');
        
        const experiences = [];
        for (let i = 0; i < companies.length; i++) {
            experiences.push({
                company: companies[i],
                position: positions[i],
                location: locations[i],
                startDate: startDates[i],
                endDate: endDates[i],
                currentJob: !!currentJobs[i],
                description: descriptions[i]
            });
        }
        return experiences;
    }
    
    function getSkillData(formData) {
        const skillNames = formData.getAll('skillName[]');
        const proficiencyLevels = formData.getAll('proficiency[]');
        
        const skills = [];
        for (let i = 0; i < skillNames.length; i++) {
            skills.push({
                name: skillNames[i],
                proficiencyLevel: proficiencyLevels[i]
            });
        }
        return skills;
    }
    
    // Helper function to show a complete preview with all data
    function updateCompletePreview(resumeData) {
        const selectedTemplate = resumeData.templateName;
        const fullName = resumeData.personalInfo.fullName;
        const email = resumeData.personalInfo.email;
        const phone = resumeData.personalInfo.phone;
        const summary = resumeData.summary;
        
        // Create education HTML
        let educationHTML = '';
        resumeData.educations.forEach(edu => {
            educationHTML += `
                <div class="preview-education-item">
                    <h3>${edu.degree} in ${edu.fieldOfStudy || 'N/A'}</h3>
                    <p>${edu.institution} (${formatDate(edu.startDate)} - ${formatDate(edu.endDate) || 'Present'})</p>
                    <p>${edu.description || ''}</p>
                </div>
            `;
        });
        
        // Create experience HTML
        let experienceHTML = '';
        resumeData.experiences.forEach(exp => {
            experienceHTML += `
                <div class="preview-experience-item">
                    <h3>${exp.position}</h3>
                    <p>${exp.company}, ${exp.location || 'N/A'} (${formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : formatDate(exp.endDate)})</p>
                    <p>${exp.description || ''}</p>
                </div>
            `;
        });
        
        // Create skills HTML
        let skillsHTML = '';
        resumeData.skills.forEach(skill => {
            skillsHTML += `
                <div class="preview-skill-item">
                    <span>${skill.name}</span>
                    <span class="skill-level">${'★'.repeat(skill.proficiencyLevel)}</span>
                </div>
            `;
        });
        
        // Create a complete preview based on the selected template
        let previewHTML = '';
        
        switch (selectedTemplate) {
            case 'professional':
                previewHTML = getProfessionalTemplateComplete(fullName, email, phone, summary, educationHTML, experienceHTML, skillsHTML);
                break;
            case 'modern':
                previewHTML = getModernTemplateComplete(fullName, email, phone, summary, educationHTML, experienceHTML, skillsHTML);
                break;
            case 'creative':
                previewHTML = getCreativeTemplateComplete(fullName, email, phone, summary, educationHTML, experienceHTML, skillsHTML);
                break;
            case 'simple':
                previewHTML = getSimpleTemplateComplete(fullName, email, phone, summary, educationHTML, experienceHTML, skillsHTML);
                break;
            default:
                previewHTML = getProfessionalTemplateComplete(fullName, email, phone, summary, educationHTML, experienceHTML, skillsHTML);
        }
        
        document.getElementById('resumePreview').innerHTML = previewHTML;
    }
    
    // Helper function to format dates
    function formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    }
    
    // Template generators with complete data
    function getProfessionalTemplateComplete(name, email, phone, summary, educationHTML, experienceHTML, skillsHTML) {
        return `
            <div class="preview-professional">
                <div class="preview-header">
                    <h1>${name}</h1>
                    <div class="preview-contact">
                        <p>${email} | ${phone}</p>
                    </div>
                </div>
                <div class="preview-summary">
                    <h2>Professional Summary</h2>
                    <p>${summary}</p>
                </div>
                <div class="preview-sections">
                    <h2>Experience</h2>
                    ${experienceHTML || '<p>No experience listed</p>'}
                    <h2>Education</h2>
                    ${educationHTML || '<p>No education listed</p>'}
                    <h2>Skills</h2>
                    ${skillsHTML || '<p>No skills listed</p>'}
                </div>
            </div>
        `;
    }
    
    function getModernTemplateComplete(name, email, phone, summary, educationHTML, experienceHTML, skillsHTML) {
        return `
            <div class="preview-modern">
                <div class="preview-sidebar">
                    <div class="preview-name">
                        <h1>${name}</h1>
                    </div>
                    <div class="preview-contact">
                        <p>${email}</p>
                        <p>${phone}</p>
                    </div>
                    <div class="preview-skills">
                        <h2>Skills</h2>
                        ${skillsHTML || '<p>No skills listed</p>'}
                    </div>
                </div>
                <div class="preview-main">
                    <div class="preview-summary">
                        <h2>About Me</h2>
                        <p>${summary}</p>
                    </div>
                    <div class="preview-experience">
                        <h2>Experience</h2>
                        ${experienceHTML || '<p>No experience listed</p>'}
                    </div>
                    <div class="preview-education">
                        <h2>Education</h2>
                        ${educationHTML || '<p>No education listed</p>'}
                    </div>
                </div>
            </div>
        `;
    }
    
    function getCreativeTemplateComplete(name, email, phone, summary, educationHTML, experienceHTML, skillsHTML) {
        return `
            <div class="preview-creative">
                <div class="preview-header">
                    <h1>${name}</h1>
                    <p class="preview-tagline">Creative Professional</p>
                </div>
                <div class="preview-contact-bar">
                    <p>${email} | ${phone}</p>
                </div>
                <div class="preview-content">
                    <div class="preview-summary">
                        <h2>Profile</h2>
                        <p>${summary}</p>
                    </div>
                    <div class="preview-two-columns">
                        <div class="preview-column">
                            <h2>Experience</h2>
                            ${experienceHTML || '<p>No experience listed</p>'}
                        </div>
                        <div class="preview-column">
                            <h2>Education</h2>
                            ${educationHTML || '<p>No education listed</p>'}
                            <h2>Skills</h2>
                            ${skillsHTML || '<p>No skills listed</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getSimpleTemplateComplete(name, email, phone, summary, educationHTML, experienceHTML, skillsHTML) {
        return `
            <div class="preview-simple">
                <h1>${name}</h1>
                <p>${email} | ${phone}</p>
                <hr>
                <h2>Summary</h2>
                <p>${summary}</p>
                <h2>Experience</h2>
                ${experienceHTML || '<p>No experience listed</p>'}
                <h2>Education</h2>
                ${educationHTML || '<p>No education listed</p>'}
                <h2>Skills</h2>
                ${skillsHTML || '<p>No skills listed</p>'}
            </div>
        `;
    }
    
    // Setup the template selection based on URL params
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    if (templateParam) {
        const templateRadio = document.querySelector(`input[value="${templateParam}"]`);
        if (templateRadio) {
            templateRadio.checked = true;
        }
    }
    
    // Event listeners for "Use Template" buttons
    const useTemplateButtons = document.querySelectorAll('.use-template');
    useTemplateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const template = this.getAttribute('data-template');
            const buildResumeSection = document.getElementById('build-resume');
            
            // Select the appropriate template radio button
            const templateRadio = document.querySelector(`input[value="${template}"]`);
            if (templateRadio) {
                templateRadio.checked = true;
            }
            
            // Scroll to the build resume section
            buildResumeSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Modal functionality for login and signup
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeBtns = document.querySelectorAll('.close');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
    
    signupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.display = 'block';
    });
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });
    
    switchToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });
    
    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });
    
    // Form validation for login and signup
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add login functionality here
        alert('Login functionality will be implemented in the backend.');
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Add signup functionality here
        alert('Signup functionality will be implemented in the backend.');
    });
    
    // Initialize the preview when page loads
    function updatePreview() {
        // Get current form data and update preview when needed
        const fullName = document.getElementById('fullName')?.value || 'Your Name';
        const email = document.getElementById('email')?.value || 'email@example.com';
        const phone = document.getElementById('phone')?.value || '123-456-7890';
        const summary = document.getElementById('summary')?.value || 'Professional summary will appear here.';
        
        // Simple version for initial preview
        let previewHTML = `
            <div class="preview-professional">
                <div class="preview-header">
                    <h1>${fullName}</h1>
                    <div class="preview-contact">
                        <p>${email} | ${phone}</p>
                    </div>
                </div>
                <div class="preview-summary">
                    <h2>Professional Summary</h2>
                    <p>${summary}</p>
                </div>
                <div class="preview-sections">
                    <p>Complete all sections to see your full resume preview.</p>
                </div>
            </div>
        `;
        
        const resumePreview = document.getElementById('resumePreview');
        if (resumePreview) {
            resumePreview.innerHTML = previewHTML;
        }
    }
    
    updatePreview();
    
    // Add event listeners to update preview when form fields change
    const personalInfoInputs = document.querySelectorAll('#personal-info input, #personal-info textarea');
    personalInfoInputs.forEach(input => {
        input.addEventListener('change', updatePreview);
    });
    
    // Add event listener for download PDF button
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            const fullName = document.getElementById('fullName').value || 'Resume';
            generatePDF(fullName);
        });
    }
    
    // PDF Export Functionality
    function generatePDF(filename) {
        // Show loading spinner
        const previewContainer = document.getElementById('resumePreview');
        const originalContent = previewContainer.innerHTML;
        previewContainer.innerHTML += '<div class="export-loading">Generating PDF, please wait...</div>';
        
        // Use setTimeout to allow the loading message to render
        setTimeout(() => {
            // Get the resume preview element
            const element = document.getElementById('resumePreview');
            
            // Create instance of html2canvas
            html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                allowTaint: true
            }).then(canvas => {
                // Remove loading spinner
                previewContainer.innerHTML = originalContent;
                
                // Create PDF from canvas
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                // Calculate dimensions
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                const imgWidth = pdfWidth;
                const imgHeight = pdfWidth / ratio;
                
                // Add image to PDF
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                
                // If the height is larger than the page, add more pages
                if (imgHeight > pdfHeight) {
                    let remainingHeight = imgHeight;
                    let position = 0;
                    while (remainingHeight > 0) {
                        position -= pdfHeight;
                        remainingHeight -= pdfHeight;
                        
                        if (remainingHeight > 0) {
                            pdf.addPage();
                            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        }
                    }
                }
                
                // Save PDF
                pdf.save(filename + '_resume.pdf');
            });
        }, 100);
    }

    // Template selection
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.template-item').forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Make first template selected by default
    if (document.querySelector('.template-item')) {
        document.querySelector('.template-item').classList.add('selected');
    }

    // Add Education
    let educationCount = 1;
    window.addEducation = function() {
        const educationList = document.getElementById('educationList');
        const newEducation = document.createElement('div');
        newEducation.className = 'education-item mt-3';
        newEducation.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Institution</label>
                        <input type="text" class="form-control" name="education[${educationCount}].institution" placeholder="University Name">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Degree</label>
                        <input type="text" class="form-control" name="education[${educationCount}].degree" placeholder="Bachelor of Science">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Field of Study</label>
                        <input type="text" class="form-control" name="education[${educationCount}].fieldOfStudy" placeholder="Computer Science">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Graduation Date</label>
                        <input type="date" class="form-control" name="education[${educationCount}].endDate">
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()"><i class="fas fa-trash-alt me-1"></i> Remove</button>
        `;
        educationList.appendChild(newEducation);
        educationCount++;
    }

    // Add Experience
    let experienceCount = 1;
    window.addExperience = function() {
        const experienceList = document.getElementById('experienceList');
        const newExperience = document.createElement('div');
        newExperience.className = 'experience-item mt-3';
        newExperience.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Company</label>
                        <input type="text" class="form-control" name="experience[${experienceCount}].company" placeholder="Company Name">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Position</label>
                        <input type="text" class="form-control" name="experience[${experienceCount}].position" placeholder="Software Developer">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-control" name="experience[${experienceCount}].startDate">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">End Date</label>
                        <input type="date" class="form-control" name="experience[${experienceCount}].endDate">
                        <div class="form-check mt-2">
                            <input type="checkbox" class="form-check-input" name="experience[${experienceCount}].currentJob" id="currentJob${experienceCount}">
                            <label class="form-check-label" for="currentJob${experienceCount}">Current Job</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="experience[${experienceCount}].description" rows="3" placeholder="Describe your responsibilities and achievements"></textarea>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()"><i class="fas fa-trash-alt me-1"></i> Remove</button>
        `;
        experienceList.appendChild(newExperience);
        experienceCount++;
    }

    // Add Skill
    let skillCount = 1;
    window.addSkill = function() {
        const skillsList = document.getElementById('skillsList');
        const newSkill = document.createElement('div');
        newSkill.className = 'skill-item mt-3';
        newSkill.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Skill</label>
                        <input type="text" class="form-control" name="skills[${skillCount}].name" placeholder="JavaScript">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Level</label>
                        <select class="form-select" name="skills[${skillCount}].level">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()"><i class="fas fa-trash-alt me-1"></i> Remove</button>
        `;
        skillsList.appendChild(newSkill);
        skillCount++;
    }

    // Initialize and expose the preview resume function for the button
    window.previewResume = function() {
        const formData = new FormData(document.getElementById('resumeForm'));
        const resumeData = {
            templateName: document.querySelector('.template-item.selected')?.dataset.template || 'professional',
            personalInfo: {
                fullName: formData.get('fullName') || 'Your Name',
                email: formData.get('email') || 'email@example.com',
                phone: formData.get('phone') || '',
                location: formData.get('location') || '',
                summary: formData.get('summary') || ''
            },
            education: [],
            experience: [],
            skills: []
        };

        // Collect education data
        document.querySelectorAll('.education-item').forEach((item, index) => {
            resumeData.education.push({
                institution: formData.get(`education[${index}].institution`) || '',
                degree: formData.get(`education[${index}].degree`) || '',
                fieldOfStudy: formData.get(`education[${index}].fieldOfStudy`) || '',
                startDate: formData.get(`education[${index}].startDate`) || '',
                endDate: formData.get(`education[${index}].endDate`) || ''
            });
        });

        // Collect experience data
        document.querySelectorAll('.experience-item').forEach((item, index) => {
            resumeData.experience.push({
                company: formData.get(`experience[${index}].company`) || '',
                position: formData.get(`experience[${index}].position`) || '',
                location: formData.get(`experience[${index}].location`) || '',
                startDate: formData.get(`experience[${index}].startDate`) || '',
                endDate: formData.get(`experience[${index}].endDate`) || '',
                currentJob: formData.get(`experience[${index}].currentJob`) === 'on',
                description: formData.get(`experience[${index}].description`) || ''
            });
        });

        // Collect skills data
        document.querySelectorAll('.skill-item').forEach((item, index) => {
            resumeData.skills.push({
                name: formData.get(`skills[${index}].name`) || '',
                level: formData.get(`skills[${index}].level`) || 'Beginner'
            });
        });

        // Create preview HTML based on template
        let previewHTML = generateResumePreview(resumeData);
        
        // Display in modal
        document.getElementById('previewContent').innerHTML = previewHTML;
        
        // Show modal
        const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
        previewModal.show();
    }

    // Generate a preview based on the template
    function generateResumePreview(data) {
        const template = data.templateName;
        let html = '';

        // Format dates
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date) 
                ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) 
                : '';
        };

        // Generate education HTML
        let educationHTML = '';
        data.education.forEach(edu => {
            if (edu.institution || edu.degree) {
                educationHTML += `
                    <div class="mb-2">
                        <h5 class="mb-1">${edu.institution}</h5>
                        <div>${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>
                        <div class="text-muted">${formatDate(edu.endDate)}</div>
                    </div>
                `;
            }
        });

        // Generate experience HTML
        let experienceHTML = '';
        data.experience.forEach(exp => {
            if (exp.company || exp.position) {
                const dateRange = exp.currentJob 
                    ? `${formatDate(exp.startDate)} - Present` 
                    : `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`;
                
                experienceHTML += `
                    <div class="mb-3">
                        <h5 class="mb-1">${exp.position}</h5>
                        <div class="fw-bold">${exp.company}</div>
                        <div class="text-muted">${dateRange}</div>
                        <p class="mt-2">${exp.description}</p>
                    </div>
                `;
            }
        });

        // Generate skills HTML
        let skillsHTML = '';
        data.skills.forEach(skill => {
            if (skill.name) {
                skillsHTML += `
                    <div class="badge bg-primary p-2 me-2 mb-2">
                        ${skill.name} <span class="ms-1 fw-normal">(${skill.level})</span>
                    </div>
                `;
            }
        });

        // Build the preview based on template
        switch (template) {
            case 'modern':
                html = `
                    <div class="resume-preview p-4">
                        <div class="row">
                            <div class="col-md-4 bg-primary text-white p-4 rounded-start">
                                <div class="text-center mb-4">
                                    <h3 class="mb-1">${data.personalInfo.fullName}</h3>
                                    <p class="mb-0">${data.personalInfo.location}</p>
                                </div>
                                <div class="mb-4">
                                    <h4 class="border-bottom pb-2">Contact</h4>
                                    <p>${data.personalInfo.email}</p>
                                    <p>${data.personalInfo.phone}</p>
                                </div>
                                <div>
                                    <h4 class="border-bottom pb-2">Skills</h4>
                                    <div class="skills-container">
                                        ${skillsHTML || '<p>No skills listed</p>'}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8 bg-white p-4 rounded-end">
                                <div class="mb-4">
                                    <h4 class="border-bottom pb-2">Summary</h4>
                                    <p>${data.personalInfo.summary || 'No summary provided'}</p>
                                </div>
                                <div class="mb-4">
                                    <h4 class="border-bottom pb-2">Experience</h4>
                                    ${experienceHTML || '<p>No experience listed</p>'}
                                </div>
                                <div class="mb-4">
                                    <h4 class="border-bottom pb-2">Education</h4>
                                    ${educationHTML || '<p>No education listed</p>'}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            
            case 'creative':
                html = `
                    <div class="resume-preview p-4">
                        <div class="bg-dark text-white p-4 text-center rounded-top">
                            <h2 class="display-5">${data.personalInfo.fullName}</h2>
                            <p class="lead mb-0">${data.personalInfo.location}</p>
                        </div>
                        <div class="bg-light p-4 mb-4">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <p><i class="fas fa-envelope me-2"></i>${data.personalInfo.email}</p>
                                </div>
                                <div class="col-md-6 text-md-end">
                                    <p><i class="fas fa-phone me-2"></i>${data.personalInfo.phone}</p>
                                </div>
                            </div>
                            <div class="mb-4">
                                <h4 class="text-primary border-bottom pb-2">About Me</h4>
                                <p>${data.personalInfo.summary || 'No summary provided'}</p>
                            </div>
                            <div class="row">
                                <div class="col-md-7">
                                    <h4 class="text-primary border-bottom pb-2">Experience</h4>
                                    ${experienceHTML || '<p>No experience listed</p>'}
                                </div>
                                <div class="col-md-5">
                                    <h4 class="text-primary border-bottom pb-2">Education</h4>
                                    ${educationHTML || '<p>No education listed</p>'}
                                    <h4 class="text-primary border-bottom pb-2 mt-4">Skills</h4>
                                    <div class="skills-container">
                                        ${skillsHTML || '<p>No skills listed</p>'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            
            case 'professional':
            default:
                html = `
                    <div class="resume-preview p-4">
                        <div class="text-center mb-4">
                            <h2 class="mb-1">${data.personalInfo.fullName}</h2>
                            <p class="mb-0">
                                ${data.personalInfo.location}
                                ${data.personalInfo.location && (data.personalInfo.phone || data.personalInfo.email) ? ' | ' : ''}
                                ${data.personalInfo.phone} 
                                ${data.personalInfo.phone && data.personalInfo.email ? ' | ' : ''}
                                ${data.personalInfo.email}
                            </p>
                        </div>
                        
                        <div class="mb-4">
                            <h4 class="border-bottom pb-2">Professional Summary</h4>
                            <p>${data.personalInfo.summary || 'No summary provided'}</p>
                        </div>
                        
                        <div class="mb-4">
                            <h4 class="border-bottom pb-2">Experience</h4>
                            ${experienceHTML || '<p>No experience listed</p>'}
                        </div>
                        
                        <div class="mb-4">
                            <h4 class="border-bottom pb-2">Education</h4>
                            ${educationHTML || '<p>No education listed</p>'}
                        </div>
                        
                        <div class="mb-4">
                            <h4 class="border-bottom pb-2">Skills</h4>
                            <div class="skills-container">
                                ${skillsHTML || '<p>No skills listed</p>'}
                            </div>
                        </div>
                    </div>
                `;
        }

        return html;
    }

    // Generate PDF
    window.generatePDF = function() {
        try {
            // Since backend is not functional, show a preview message
            alert('PDF generation would typically call the backend API. As a fallback, we will show you a preview instead.');
            window.previewResume();
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating PDF');
        }
    }

    // Generate DOCX
    window.generateDOCX = function() {
        try {
            // Since backend is not functional, show a preview message
            alert('DOCX generation would typically call the backend API. As a fallback, we will show you a preview instead.');
            window.previewResume();
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating DOCX');
        }
    }

    // Add event listeners for current job checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.name.includes('currentJob')) {
            const index = parseInt(e.target.id.replace('currentJob', ''));
            const endDateField = document.querySelector(`input[name="experience[${index}].endDate"]`);
            if (endDateField) {
                endDateField.disabled = e.target.checked;
                if (e.target.checked) {
                    endDateField.value = '';
                }
            }
        }
    });
}); 