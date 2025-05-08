// API Client for Resume Builder
// This file contains functions for communicating with the backend API

/**
 * Create a new resume on the server
 * @param {Object} resumeData - The resume data to save
 * @returns {Promise<Object>} - The saved resume with ID
 */
async function createResume(resumeData) {
    try {
        const response = await fetch('/api/resumes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Important for sending cookies with request
            body: JSON.stringify(resumeData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to create resume');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating resume:', error);
        throw error;
    }
}

/**
 * Update an existing resume
 * @param {string} resumeId - The ID of the resume to update
 * @param {Object} resumeData - The updated resume data
 * @returns {Promise<Object>} - The updated resume
 */
async function updateResume(resumeId, resumeData) {
    try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Important for sending cookies with request
            body: JSON.stringify(resumeData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to update resume');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating resume:', error);
        throw error;
    }
}

/**
 * Get all resumes for the current user
 * @returns {Promise<Array>} - Array of resume objects
 */
async function getResumes() {
    try {
        const response = await fetch('/api/resumes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Important for sending cookies with request
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to fetch resumes');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching resumes:', error);
        throw error;
    }
}

/**
 * Get a specific resume by ID
 * @param {string} resumeId - The ID of the resume to fetch
 * @returns {Promise<Object>} - The resume object
 */
async function getResumeById(resumeId) {
    try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Important for sending cookies with request
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to fetch resume');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching resume:', error);
        throw error;
    }
}

/**
 * Delete a resume by ID
 * @param {string} resumeId - The ID of the resume to delete
 * @returns {Promise<Object>} - Response message
 */
async function deleteResume(resumeId) {
    try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Important for sending cookies with request
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to delete resume');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting resume:', error);
        throw error;
    }
}

/**
 * Parse form data into a structured object for API submission
 * @param {HTMLFormElement} formElement - The form element containing resume data
 * @returns {Object} Structured resume data for API
 */
function parseResumeFormData(formElement) {
    if (!formElement) {
        throw new Error('Form element is required');
    }
    
    const formData = new FormData(formElement);
    const resumeData = {};
    
    // Process basic fields
    for (const [key, value] of formData.entries()) {
        if (!key.includes('[') && !key.includes('].')) {
            resumeData[key] = value;
        }
    }
    
    // Process arrays and nested objects
    const education = [];
    const experience = [];
    const projects = [];
    const certifications = [];
    const languages = [];
    let social = {};
    
    for (const [key, value] of formData.entries()) {
        // Handle education[0].field format
        if (key.startsWith('education[')) {
            const match = key.match(/education\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!education[index]) {
                    education[index] = {};
                }
                
                education[index][field] = value;
            }
        }
        
        // Handle experience[0].field format
        else if (key.startsWith('experience[')) {
            const match = key.match(/experience\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!experience[index]) {
                    experience[index] = {};
                }
                
                experience[index][field] = value;
            }
        }
        
        // Handle projects[0].field format
        else if (key.startsWith('projects[')) {
            const match = key.match(/projects\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!projects[index]) {
                    projects[index] = {};
                }
                
                projects[index][field] = value;
            }
        }
        
        // Handle certifications[0].field format
        else if (key.startsWith('certifications[')) {
            const match = key.match(/certifications\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!certifications[index]) {
                    certifications[index] = {};
                }
                
                certifications[index][field] = value;
            }
        }
        
        // Handle languages[0].field format
        else if (key.startsWith('languages[')) {
            const match = key.match(/languages\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                
                if (!languages[index]) {
                    languages[index] = {};
                }
                
                languages[index][field] = value;
            }
        }
        
        // Handle social.field format
        else if (key.startsWith('social.')) {
            const field = key.split('.')[1];
            social[field] = value;
        }
    }
    
    // Add arrays to resumeData
    if (education.length > 0) resumeData.education = education.filter(item => item && item.institution);
    if (experience.length > 0) resumeData.experience = experience.filter(item => item && item.company);
    if (projects.length > 0) resumeData.projects = projects.filter(item => item && item.title);
    if (certifications.length > 0) resumeData.certifications = certifications.filter(item => item && item.title);
    if (languages.length > 0) resumeData.languages = languages.filter(item => item && item.name);
    
    // Add social object
    if (Object.keys(social).length > 0) resumeData.social = social;
    
    // Parse skills from hidden inputs
    if (document.getElementById('technicalSkills') && document.getElementById('technicalSkills').value) {
        try {
            resumeData.technicalSkills = JSON.parse(document.getElementById('technicalSkills').value);
        } catch (error) {
            console.error('Error parsing technical skills:', error);
            resumeData.technicalSkills = [];
        }
    }
    
    if (document.getElementById('softSkills') && document.getElementById('softSkills').value) {
        try {
            resumeData.softSkills = JSON.parse(document.getElementById('softSkills').value);
        } catch (error) {
            console.error('Error parsing soft skills:', error);
            resumeData.softSkills = [];
        }
    }
    
    return resumeData;
} 