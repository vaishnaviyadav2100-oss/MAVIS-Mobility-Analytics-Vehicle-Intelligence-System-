# 🚗 MAVIS - Mobility Analytics & Vehicle Intelligence System

Complete Full-Stack Application in One Unified Folder:
- **`frontend/`**: React.js 19 + Tailwind CSS v4 + Lucide Icons
- **`backend/`**: Spring Boot 3 + MySQL + Spring Data JPA + Spring Security + JWT + Automotive AI Triage

---

## 📂 Folder Structure

```
MAVIS/
│
├── 🌐 frontend/              # Complete React.js Web Application
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, StatCard, VehicleCard, BookingCard, JobCard
│   │   ├── pages/
│   │   │   ├── auth/         # Login & Register (Instant 1-Click Demo Logins included)
│   │   │   ├── customer/     # Garage, Book Service, Live Tracker, Invoices, AI Triage
│   │   │   ├── mechanic/     # Bay Board, Assigned Jobs, Interactive Checklist & Sign-off
│   │   │   └── admin/        # Dispatcher, Mechanics, Invoices, Analytics
│   │   ├── services/         # API HTTP Client with JWT, Mock Fallback & CRUD Services
│   │   ├── context/          # AuthContext with 1-click Role Switcher
│   │   └── routes/           # Role-based AppRoutes
│   └── package.json
│
├── ⚙️ backend/               # Complete Spring Boot 3 Backend API
│   ├── src/main/java/com/mavis/
│   │   ├── controller/       # AuthController, VehicleController, BookingController, JobCardController, InvoiceController, AIController
│   │   ├── service/          # AuthService, VehicleService, BookingService, JobCardService, InvoiceService, AIService
│   │   ├── repository/       # JPA Repositories
│   │   ├── entity/           # MySQL Entities (User, Vehicle, Booking, Mechanic, JobCard, Invoice, AIInteraction)
│   │   ├── dto/              # Request / Response DTOs
│   │   └── security/         # SecurityConfig, JwtService, JwtAuthenticationFilter, CORS Config
│   ├── src/main/resources/
│   │   ├── application.properties # Port 8080, MySQL connection, JWT Secret
│   │   └── data.sql          # Pre-seeded database records
│   └── pom.xml               # Maven configuration
│
└── 📄 README.md
```

---

## 🚀 How to Run in VS Code

### 1. Open the whole project in VS Code:
```powershell
code "C:\Users\DELL\.gemini\antigravity\scratch\MAVIS"
```

### 2. Run Frontend:
In Terminal 1:
```powershell
cd C:\Users\DELL\.gemini\antigravity\scratch\MAVIS\frontend
npm.cmd run dev
```
* **URL:** `http://localhost:5173`

### 3. Run Backend:
Ensure MySQL is running on port 3306 (e.g., in XAMPP or MySQL Service), then in Terminal 2:
```powershell
cd C:\Users\DELL\.gemini\antigravity\scratch\MAVIS\backend
mvn spring-boot:run
```
* **API URL:** `http://localhost:8080/api`

---

## 🔑 Demo Logins

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `customer@mavis.com` | `password123` |
| **Mechanic** | `mechanic@mavis.com` | `password123` |
| **Admin** | `admin@mavis.com` | `password123` |

*(Note: There is also an instant 1-click Role Switcher button in the navbar for quick demoing!)*
