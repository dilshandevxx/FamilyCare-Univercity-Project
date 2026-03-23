# 🏥 FamilyCare – Eldercare Monitoring System

> **"Stay connected. Stay caring. Anytime, anywhere ❤️"**

FamilyCare is a professional full-stack web platform designed for children living abroad to seamlessly monitor and manage the health and daily activities of their elderly parents back home. By bridging the gap between family members and professional caregivers, we ensure transparency, real-time clinical monitoring, and ultimate peace of mind.

---

## 🧠 Problem Statement
For millions of individuals working overseas, keeping track of their elderly parents' health in their home country is a significant challenge. Traditional communication often misses critical health trends, and there is a lack of structured, real-time data from caregivers regarding medications, vitals, and daily well-being.

## 💡 Solution Overview
FamilyCare provides a centralized hub where:
1. **Children** can manage parent profiles and assign caregivers.
2. **Caregivers** can log medical and activity data in real-time.
3. **Data Insights** are provided through intuitive dashboards, ensuring that health anomalies are spotted early.

---

## 🚀 Key Features
- **🔐 Multi-Role Authentication:** Secure login for both Children (Family) and Caregivers.
- **👴 Elder Profile Management:** Children can create and manage multiple profiles (e.g., Mother, Father).
- **📋 Caregiver Assignment:** Assign dedicated caregivers based on their specializations, availability, and hourly rates.
- **🩺 Health vitals Logs:** Caregivers log daily updates including Blood Pressure, Heart Rate, Temperature, Meals, and Medication.
- **⚡ Real-time Updates:** Stay notified of health logs as they happen using WebSockets (Socket.io).
- **📊 Health Insights:** Visual dashboards featuring health trends using Chart.js.
- **🛡️ Secure Access Control:** Granular permissions ensures data privacy and security.
- **🔮 Future Support:** Upcoming integration for emergency support (Ambulance/Doctor-on-call).

---

## 🏗️ System Architecture
The application follows a modern **MERN-style** architecture (using MySQL instead of MongoDB) for high data integrity:

- **Frontend:** React.js Single Page Application (SPA).
- **Backend:** Node.js/Express.js RESTful API.
- **Real-time:** Socket.io for live data synchronization.
- **Database:** MySQL for structured relational data storage.

---

## 🗄️ Database Design (MySQL)
We chose **MySQL** over NoSQL because health data is highly structured and requires strict **ACID compliance**. Relational integrity ensures that health logs are always accurately linked to the correct Elder and Caregiver.

### Core Tables:
- **`Users`**: Stores account details and roles (Child, Caregiver, Admin).
- **`Elders`**: Parent profiles linked to a Child account.
- **`Caregivers`**: Professional profiles with specializations and pricing.
- **`HealthLogs`**: Vital signs and daily reports linked to an Elder.
- **`Appointments`**: Scheduling information between families and care providers.

---

## ⚙️ Tech Stack
- **Frontend:** React 18, Vite, React Router, Chart.js, Axios.
- **Backend:** Node.js, Express.js.
- **Real-time:** Socket.io.
- **Database:** MySQL 8.0+.
- **ORM:** Sequelize (or Prisma).
- **Deployment:** Vercel (Frontend), Render (Backend).

---

## 🛠️ Installation Guide

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server
- npm or yarn

### 2. Clone the Repository
```bash
git clone https://github.com/dilshandevxx/FamilyCare-Univercity-Project.git
cd FamilyCare-Univercity-Project
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MySQL credentials
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 5. Database Setup
```bash
mysql -u root -p < backend/src/database/schema.sql
```

---

## 🔐 Environment Variables
### Backend (`backend/.env`)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=familycare_db
JWT_SECRET=your_jwt_secret_key
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📂 Folder Structure
```text
├── backend/
│   ├── src/
│   │   ├── config/      # Database connection
│   │   ├── controllers/ # Logic handlers
│   │   ├── middleware/  # Auth & Security
│   │   ├── models/      # Sequelize Data Models
│   │   ├── routes/      # API Endpoints
│   │   └── database/    # SQL Schemas
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── context/     # Auth & Global State
│   │   ├── pages/       # Page Components
│   │   ├── services/    # API calling helpers (Axios)
└── README.md
```

---

## ▶️ Usage Guide
1. **Register** as a Child user.
2. **Add a Profile** for your parent under "Manage Parents".
3. **Browse Caregivers** and assign one to your parent's profile.
4. **Caregivers** can log in to view their assigned parents and submit daily logs.
5. **Monitor** health charts on your dashboard.

---

## 📸 Screenshots
*(Coming Soon - Placeholders)*
| Dashboard | Health Log Entry | Caregiver Search |
|-----------|------------------|------------------|
| ![Dashboard](https://via.placeholder.com/300x200) | ![Logs](https://via.placeholder.com/300x200) | ![Search](https://via.placeholder.com/300x200) |

---

## 🔮 Future Enhancements
- 🚑 **One-Tap Emergency:** Direct link to local ambulance services.
- 💊 **Medication Reminders:** Automated SMS/Push notifications for parents.
- 📞 **Video Consultation:** Integrated tele-health sessions with doctors.
- 📱 **Mobile App:** Dedicated iOS/Android versions using React Native.

---

## 👨💻 Contributors
- **Member 1** - Backend & Database
- **Member 2** - Frontend UI/UX
- **Member 3** - State Management & Auth

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
