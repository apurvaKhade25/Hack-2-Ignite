# 🧘 Nirvana – Mental Wellness Platform

Nirvana is a modern AI-powered mental wellness platform designed to help users track their emotional well-being, reflect through journaling, and access personalized wellness features.

The frontend provides a responsive and user-friendly interface for patients and doctors to interact with the Nirvana platform.

---

## 🌐 Live Demo

🚀 **Live Website:**  
https://nirvana-frontend-ubd6.onrender.com/login

---

## ✨ Features

- 🔐 User Login and Registration
- 🏠 Patient Dashboard
- 😊 Daily Mood Tracking
- 📖 Personal Journal
- 🤖 AI Companion Chat
- 📊 Wellness Reports and Insights
- 🏥 Find Mental Health Clinics
- 🤝 Doctor–Patient Consent Management
- 👨‍⚕️ Separate Doctor Dashboard
- 🔒 Protected Routes based on User Authentication

---

## 🛠️ Tech Stack

- React.js
- Vite
- JavaScript
- React Router DOM
- Axios
- Zustand
- CSS
- Lucide React
- Framer Motion

---

## 📁 Project Structure

```text
src/
│
├── api/
│   └── api.js
│
├── components/
│   ├── Crisis.jsx
│   └── Sidebar.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── MoodLog.jsx
│   ├── Journal.jsx
│   ├── Chat.jsx
│   ├── Report.jsx
│   ├── Clinics.jsx
│   ├── Consent.jsx
│   └── DoctorDashboard.jsx
│
├── store/
│   └── authStore.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🧭 Application Pages

| Page | Description |
|------|-------------|
| Login | Allows users to sign in to their account |
| Register | Allows new users to create an account |
| Dashboard | Main overview of the user's wellness activity |
| Mood Tracker | Users can record and track their daily mood |
| Journal | Users can write and manage personal journal entries |
| AI Companion | Conversational AI support interface |
| Wellness Report | Displays wellness insights and emotional trends |
| Find Clinics | Helps users find mental health clinics |
| Consent | Manages doctor–patient consent |
| Doctor Dashboard | Dashboard for doctors to view authorized patient information |

---

## 🔗 Routes

```text
/login
/register

/patient/dashboard
/patient/mood
/patient/journal
/patient/chat
/patient/wellness
/patient/clinics
/patient/consent

/doctor/dashboard
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/ankitakoli26/final_nirvana.git
```

### 2. Go to the Project Folder

```bash
cd final_nirvana
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will run locally at:

```text
http://localhost:5173
```

---

## 🔌 Backend Integration

The frontend communicates with the Nirvana backend using REST APIs.

The application uses Axios to handle API requests and authentication tokens.

```text
Frontend → REST API → Spring Boot Backend → PostgreSQL Database
```

---

## 🔐 Authentication

Authentication is handled using JWT tokens.

The application includes:

- Protected patient routes
- Protected doctor routes
- Role-based navigation
- Token storage using localStorage
- Automatic authentication headers for API requests

---

## 🚀 Deployment

The Nirvana frontend is deployed and accessible online.

**Live Application:**  
https://nirvana-frontend-ubd6.onrender.com/login

---

## 📌 Future Improvements

- Improved AI conversation features
- More detailed wellness analytics
- Enhanced mood visualization
- Additional accessibility improvements
- Mobile UI optimization
- More personalized wellness recommendations

---

## 📄 License

This project is created for educational, learning, and portfolio purposes.
