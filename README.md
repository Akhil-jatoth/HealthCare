# 🏥 Swasthya Saathi | AI-Powered Rural Telemedicine & Healthcare Network
> **Bridging the Urban-Rural Healthcare Divide with AI Clinical Triage, Multilingual Regional Support, Live Google Maps Clinic Navigation, and 1-Click Emergency SOS.**

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Stack: MERN](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-emerald)](https://reactjs.org/)
[![AI: Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-blue)](https://ai.google.dev/)
[![Design: Glassmorphism](https://img.shields.io/badge/UI-Modern%20Glassmorphism-indigo)](#design--user-experience)

---

## 📌 Problem Statement & Mission

In rural and remote villages across India:
- Over **70% of the population** resides in rural areas, yet **less than 20% of doctors** practice there.
- Villagers travel tens of kilometers over rough terrain for basic primary consultations.
- Language barriers, low digital literacy, and poor connectivity prevent rural patients from accessing telemedicine.

**Swasthya Saathi** (*"Health Companion"*) provides a complete, low-bandwidth resilient healthcare ecosystem tailored specifically for rural citizens, Primary Health Centers (PHCs), ASHA workers, and verified specialists.

---

## ✨ Key Hackathon Features

### 1. 🤖 AI Symptom Assistant & Triage
- **Clinical Triage**: Patients enter symptoms in simple natural language (or pick rural scenarios like *High Fever & Chills*, *Chest Pain*, *Child Cough*).
- **Specialist Recommendation**: AI determines the exact doctor specialization needed (Cardiology, Pediatrics, Orthopedic, etc.) and evaluates emergency urgency levels.
- **Strict Medical Focus**: Fine-tuned to answer exclusively medical queries and protect rural users from misinformation.

### 2. 🗺️ Interactive Google Health Map & Rural GPS Locator
- **Live Clinic & Doctor Pinpoints**: Displays nearby verified doctors, Primary Health Centers (PHCs), Community Centers, and 24/7 108 Emergency Ambulance Hubs.
- **1-Click "Use My GPS Location"**: Auto-detects patient coordinates to find the closest healthcare facility.
- **Turn-by-Turn Google Maps Navigation**: Direct link to open real-time route directions in Google Maps (`https://www.google.com/maps/dir/...`).
- **Map & Satellite Modes**: Switch between street maps and high-resolution satellite terrain.

### 3. 🌐 Real-Time 4-Language Multilingual Support
- **1-Click Instant Localization**: Switch dynamically between:
  - **English**
  - **हिंदी (Hindi)**
  - **తెలుగు (Telugu)**
  - **தமிழ் (Tamil)**
- Translates the entire navigation, hero section, metrics, triage advice, role gateways, and emergency contacts.

### 4. 🔮 Premium Glassmorphic UI with Ambient Background Motion
- Built with crisp frosted glass panels (`backdrop-filter: blur(20px)`), luminous borders, and GPU-accelerated floating gradient mesh orbs.
- Zero disruptive browser `alert()` popups — uses animated celebration toasts, audio chimes, and dialog modals.

### 5. ⚡ 1-Click Quick Demo Login (Judges' Favorite)
- Test the platform in 1 second without typing credentials.
- Instant prefilled profile chips for **Doctors** (`Dr. Priya Sharma`, `Dr. Shameem`, `Dr. Yash`) and **Patients** (`Sania Begum`, `Akhil`, `Test Patient`) with universal demo password `123456`.

### 6. 🚨 1-Click Emergency SOS Dispatch
- Floating red luminous SOS button in the navigation header.
- Instantly displays priority rural emergency hotlines (**108 Ambulance**, **102 Maternal**, **14416 Tele-MANAS Mental Health**, **104 Health Helpline**) with simulated GPS telemetry dispatch to the nearest PHC.

### 7. 💊 Audio-Assisted Medicine Schedule & Digital EHR
- **Audio Voice Reminders**: Text-to-Speech audio dosage alerts in regional languages for elder and non-literate patients.
- **Longitudinal EHR Passport**: Unified digital health history tracking vitals (BP, SpO2, Heart Rate, Temperature) and digital prescriptions.

### 8. 💳 Rural Micro-Payments
- Integrated with Razorpay supporting UPI, QR code scanning, and subsidized rural consultation vouchers.

---

## 🏗️ Technical Architecture

```
                      ┌─────────────────────────────────────────┐
                      │   Swasthya Saathi React (Vite) App      │
                      │  - Multilingual Context (EN/HI/TE/TA)   │
                      │  - Leaflet / Google Maps Integration    │
                      │  - Ambient Moving Background & Toasts   │
                      └────────────────────┬────────────────────┘
                                           │ HTTP / REST
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │      Node.js + Express REST API         │
                      │  - JWT Authentication & Bcrypt          │
                      │  - Doctor & Patient Management          │
                      │  - Telemedicine OPD Appointments        │
                      └───────┬─────────────────────────┬───────┘
                              │                         │
            ┌─────────────────▼───────────┐    ┌────────▼────────────────┐
            │       MongoDB Atlas         │    │    External Services    │
            │ - Users, Doctors, Patients  │    │ - Google Gemini API     │
            │ - Appointments & EHR Records│    │ - Google Maps Platform  │
            │ - Medicine Reminders        │    │ - Jitsi Meet (WebRTC)   │
            └─────────────────────────────┘    └─────────────────────────┘
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Vanilla CSS3 (Glassmorphism), Leaflet.js |
| **Backend** | Node.js, Express.js, Mongoose ODM |
| **Database** | MongoDB Atlas (Cloud Cluster) |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js, Helmet, CORS |
| **AI & Telehealth** | Google Gemini 1.5 Flash API, Jitsi Meet WebRTC Video |
| **Payments** | Razorpay Checkout SDK (UPI / Cards / NetBanking) |

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Akhil-jatoth/HealthCare.git
cd HealthCare
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `server/` (or copy `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
node src/server.js
```
*Backend API will run on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
*Frontend application will start at `http://localhost:5173`.*

---

## 🌐 Deploying to Render (Live Web Service)

This repository is pre-configured with a unified full-stack architecture for **1-Click Render Deployment**:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Akhil-jatoth/HealthCare)

### Manual Render Setup Steps:
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `https://github.com/Akhil-jatoth/HealthCare.git`.
4. Configure service settings:
   - **Name**: `swasthya-saathi`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)` or nearest
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_connection_string`
   - `JWT_SECRET`: `your_jwt_secret_key`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
6. Click **Create Web Service**.
7. Once deployed, Render will provide your working live URL: `https://swasthya-saathi.onrender.com`!

---

## 🔑 Demo Test Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| **Doctor** | Dr. Priya Sharma (Pediatrician) | `priya@gmail.com` | `123456` |
| **Doctor** | Dr. Mohammed Shameem (Physician) | `mohammedshameem636@gmail.com` | `123456` |
| **Doctor** | Dr. Yash Verma (Cardiologist) | `yash@gmail.com` | `123456` |
| **Patient** | Sania Begum | `mohammedshameem636@gmail.com` | `123456` |
| **Patient** | Akhil Jatoth | `akhiljt166@gmail.com` | `123456` |

*Or simply click **"⚡ Demo Login"** on the navigation bar to sign in with 1 click!*

---

## 🗺️ Application Routes

- `/` — Landing Page with Hero, Stats, AI Triage, and Role Gateways
- `/symptom-checker` — Dedicated AI Symptom Assistant & Clinical Triage
- `/map` — Interactive Google Health Map & Rural GPS Clinic Locator
- `/doctors` — Doctor Directory with Search, Specialty Filter, and Map View Toggle
- `/doctor/register` — Medical Practitioner Onboarding
- `/patients/register` — Patient Health Card Registration
- `/doctors/:id/appointments` — Doctor Tele-OPD Consultation Queue
- `/patients/:id/appointments` — Patient Appointments & Video Room
- `/patients/:id/medicines` — Regional Audio Medicine Reminders
- `/patients/:id/health-records` — Electronic Health Record (EHR) Passport

---

## 👥 Contributors

- **Akhil Jatoth** ([@Akhil-jatoth](https://github.com/Akhil-jatoth))
- **Abhignya** ([@Abhignya005](https://github.com/Abhignya005))
- **Reshma Sulthana** ([@ReshmaSulthana023](https://github.com/ReshmaSulthana023))

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
