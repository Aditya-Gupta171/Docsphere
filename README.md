# DocSphere - Real-Time Collaborative Document Editor

DocSphere is a full-stack MERN application for real-time document collaboration, similar to Google Docs. It features user authentication, document sharing, email invitations, and live editing with cursor tracking.

## Features

- 🔒 User Authentication (JWT)
- 📝 Real-time Document Editing
- 👥 Document Sharing & Collaboration
- 📧 Email Invitations
- 🎨 Rich Text Formatting
- 👆 Live Cursor Tracking
- 🔄 Auto-saving
- 📱 Responsive Design

## Tech Stack

### Frontend
- React.js
- Socket.IO Client
- TailwindCSS
- Quill.js Editor
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Nodemailer

## Setup Instructions

### Prerequisites
- Node.js 
- MongoDB installed locally or MongoDB Atlas account
- Gmail account for email service

### Backend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/docsphere.git
cd docsphere/Backend
```
2. install dependencies
```bash
npm install
```
3. Create .env file in Backend directory
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Docsphere
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```
4. Start Backend Server
```bash
npm run dev
```
### Frontend Setup

1. Navigate to Frontend directory
```bash
cd ../Frontend
```
2. Install dependencies
```bash
npm install
```
3. Start Frontend Development Server
``` 
VITE_API_URL=http://localhost:5000/api
VITE_JWT_ACCESS_KEY=accessToken
VITE_JWT_REFRESH_KEY=refreshToken
VITE_WS_URL=http://localhost:5000
```
### Email Configuration
To enable email functionality:

- Enable 2-Step Verification in your Gmail account
- Generate an App Password
- Use the generated password in your Backend .env file

# Usage
- Open http://localhost:5173 in your browser
- Create an account or sign in
- Create a new document
- Share document using email invitation
- Collaborate in real-time

## Contributing
- Fork the repository
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request