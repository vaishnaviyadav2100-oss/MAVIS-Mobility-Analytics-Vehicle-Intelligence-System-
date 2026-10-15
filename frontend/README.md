# 🚗 MAVIS Frontend (React.js + Tailwind CSS + Lucide Icons)

**MAVIS** — *Mobility Analytics & Vehicle Intelligence System*

## 🌟 Highlights
- **Vite + React.js + Tailwind CSS**: Lightning fast modern automotive dark UI.
- **Dual-Mode Operation**:
  - **Connected to Spring Boot**: Automatically attaches JWT bearer tokens and hits `http://localhost:8080/api`.
  - **Offline/Demo Ready**: Automatically falls back to built-in reactive localStorage state with realistic vehicle, booking, and invoice data.
- **3-Role Support with 1-Click Role Switcher**:
  1. **Customer**: Garage, Add Vehicle, Book Service, Live Tracker, Service History, Invoices, AI Triage.
  2. **Mechanic**: Live Bay Board, Assigned Jobs, Interactive Checklist & Sign-off.
  3. **Admin**: Master Dispatcher, Mechanic Management, Fleet Management, Job Cards, Invoices, Analytics.
- **AI Automotive Assistant**: Triage customer complaints (e.g., brake grinding, overheating, vibration), provides category, priority, inspection areas, and 1-click booking pre-fill!

## 🚀 How to Run

```bash
cd mavis-frontend
npm run dev
```

Open the local URL (usually `http://localhost:5173`) in your browser.

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Global header with instant role switcher & user pill
│   ├── Sidebar.jsx          # Role-based sidebar with architecture indicator
│   ├── ProtectedRoute.jsx   # Role-based protection guard
│   ├── StatCard.jsx         # KPI metric card with glowing accent
│   ├── VehicleCard.jsx      # Automobile card with specs & booking trigger
│   ├── BookingCard.jsx      # Appointment card with status tags
│   └── JobCard.jsx          # Mechanic job card with progress bar
├── pages/
│   ├── auth/                # Login (with 1-click demo logins) & Register
│   ├── customer/            # Dashboard, MyVehicles, AddVehicle, BookService, MyBookings, ServiceHistory, MyInvoices, AIAssistant
│   ├── mechanic/            # MechanicDashboard, AssignedJobs, JobDetails (checklist)
│   └── admin/               # AdminDashboard, ManageUsers, ManageVehicles, ManageBookings, ManageMechanics, JobCards, Invoices, Analytics
├── services/
│   ├── api.js               # HTTP client with JWT interceptor
│   ├── authService.js       # Authentication & login/register
│   ├── vehicleService.js    # Vehicles CRUD
│   ├── bookingService.js    # Bookings CRUD & dispatch
│   ├── jobService.js        # Mechanic jobs & task checklist
│   ├── invoiceService.js    # Invoices & UPI online payment
│   ├── aiService.js         # AI complaint analyzer & preliminary guidance
│   └── mockData.js          # Seed database for instant presentation
├── context/
│   └── AuthContext.jsx      # Auth state & user session
├── routes/
│   └── AppRoutes.jsx        # Routing & view dispatch
├── App.jsx
└── main.jsx
```
