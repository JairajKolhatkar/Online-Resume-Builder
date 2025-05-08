# Online Resume Builder

A modern web application for creating professional resumes with customizable templates and real-time preview.

## Features

- **User Authentication**: Secure registration and login to save resume data
- **Multi-Step Form**: User-friendly form with intuitive steps for building resumes
- **Template Selection**: Multiple professional resume templates to choose from
- **Real-time Preview**: See changes as you build your resume
- **Save Progress**: Automatically saves progress to continue later
- **Export as PDF**: Download resume as a professional PDF document
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Theme Switching**: Light and dark mode support

## Project Structure

```
obuilder/                        # Main project directory
├── client/                      # Frontend client
│   ├── public/                  # Public assets 
│   └── src/                     # Source code
│       ├── components/          # Reusable UI components
│       │   └── form/            # Form-related components
│       ├── pages/               # Page components
│       ├── services/            # API service functions
│       │   └── api/             # API clients
│       ├── styles/              # CSS styles
│       │   └── css/             # Stylesheets
│       └── utils/               # Utility functions
│           └── js/              # JavaScript utilities
│       
├── server/                      # Backend server
│   ├── config/                  # Configuration files
│   ├── controllers/             # Route controllers
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── utils/                   # Utility functions
│   └── server.js                # Main server file
├── package.json                 # Project dependencies and scripts
└── README.md                    # Project documentation
```

## Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd obuilder
   ```

2. Install dependencies
   ```
   npm run install-all
   ```

3. Set up environment variables
   Create a `.env` file in the server directory with the following:
   ```
   PORT=3003
   MONGODB_URI=<your-mongodb-connection-string>
   SESSION_SECRET=<your-session-secret>
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Access the application
   Open your browser and navigate to `http://localhost:3003`

## Technology Stack

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Bootstrap 5
  - FontAwesome

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Express-session for auth

- **Tools**:
  - html2pdf.js for PDF generation

## API Endpoints

### User Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Authenticate user
- `GET /api/users/current` - Get current user
- `POST /api/users/logout` - Logout user

### Resume Routes
- `GET /api/resumes` - Get all user resumes
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update existing resume
- `DELETE /api/resumes/:id` - Delete a resume

## Contact

For questions or support, please contact:
- Phone: 7083018771
- Email: jaykool2001@gmail.com
