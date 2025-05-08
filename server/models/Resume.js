const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Education section
const EducationSchema = new Schema({
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  location: String,
  grade: String,
  startDate: Date,
  endDate: Date,
  current: Boolean
});

// Schema for Experience section
const ExperienceSchema = new Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  location: String,
  type: String,
  startDate: Date,
  endDate: Date,
  currentJob: Boolean,
  description: String
});

// Schema for Project section
const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  technologies: String,
  github: String,
  demo: String,
  description: String
});

// Schema for Certification section
const CertificationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  issuer: String,
  date: Date,
  url: String,
  description: String
});

// Schema for Language section
const LanguageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level: String
});

// Main Resume Schema
const ResumeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: String,
    default: 'professional'
  },
  // Personal Details
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  location: String,
  address: String,
  linkedin: String,
  github: String,
  website: String,
  // Profile picture will be stored as URL or path
  profilePicture: String,
  
  // Professional Summary
  summary: String,
  
  // Skills
  technicalSkills: [String],
  softSkills: [String],
  
  // Collections
  education: [EducationSchema],
  experience: [ExperienceSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  languages: [LanguageSchema],
  
  // Extras
  hobbies: String,
  volunteer: String,
  social: {
    twitter: String,
    medium: String
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema); 