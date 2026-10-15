-- ========================================================
-- MAVIS Database Seed Script (MySQL)
-- Mobility Analytics & Vehicle Intelligence System
-- ========================================================

-- 1. Insert Initial Users
-- Password for all seed users is 'password123' (BCrypt encrypted)
-- Hash: $2a$10$wE7vGv/fS9f76aYvFz6bueMv/wB1B4nJ54jD.lS58JkK9s13L7M/O
INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES
(1, 'Rahul Sharma', 'customer@mavis.com', '$2a$10$wE7vGv/fS9f76aYvFz6bueMv/wB1B4nJ54jD.lS58JkK9s13L7M/O', '+91 98765 43210', 'CUSTOMER'),
(2, 'Vikram Singh', 'mechanic@mavis.com', '$2a$10$wE7vGv/fS9f76aYvFz6bueMv/wB1B4nJ54jD.lS58JkK9s13L7M/O', '+91 98111 22334', 'MECHANIC'),
(3, 'Anita Roy', 'admin@mavis.com', '$2a$10$wE7vGv/fS9f76aYvFz6bueMv/wB1B4nJ54jD.lS58JkK9s13L7M/O', '+91 99000 11223', 'ADMIN'),
(4, 'Pooja Verma', 'pooja@mavis.com', '$2a$10$wE7vGv/fS9f76aYvFz6bueMv/wB1B4nJ54jD.lS58JkK9s13L7M/O', '+91 98222 33445', 'MECHANIC'),
(5, 'Amit Joshi', 'amit@mavis.com', '$2a$10$wE7vGv/fS9f76aYvFz6bueMv/wB1B4nJ54jD.lS58JkK9s13L7M/O', '+91 98333 44556', 'MECHANIC');

-- 2. Insert Mechanics
INSERT IGNORE INTO mechanics (id, user_id, name, specialization, experience, rating, phone, active_jobs) VALUES
(1, 2, 'Vikram Singh', 'Brake Systems & Powertrain Overhaul', '8+ Years', '4.9', '+91 98111 22334', 1),
(2, 4, 'Pooja Verma', 'EV Battery Systems & OBD-II DTC Scanners', '5 Years', '4.8', '+91 98222 33445', 1),
(3, 5, 'Amit Joshi', 'Suspension & 3D Laser Alignment', '6 Years', '4.7', '+91 98333 44556', 0);

-- 3. Insert Sample Vehicles
INSERT IGNORE INTO vehicles (id, user_id, registration_no, brand, model, year, fuel_type, odometer, color, last_service, status) VALUES
(1, 1, 'MH 02 CZ 4489', 'Honda', 'City ZX', 2022, 'Petrol', '24,500 km', 'Lunar Silver', '12 Jan 2026', 'Active'),
(2, 1, 'MH 04 ET 9102', 'Hyundai', 'Creta SX(O)', 2023, 'Diesel', '18,200 km', 'Polar White', '05 Mar 2026', 'In Service'),
(3, 1, 'DL 01 AA 1001', 'Tata', 'Nexon EV Empowered', 2024, 'Electric', '9,400 km', 'Daytona Grey', 'New Vehicle', 'Active');

-- 4. Insert Service Bookings (Includes jobs for Mechanic 1, Mechanic 2, and Pending for Admin dispatch)
INSERT IGNORE INTO service_bookings (id, user_id, vehicle_id, vehicle_name, service_type, booking_date, time_slot, description, status, assigned_mechanic, mechanic_id, estimated_cost, created_at) VALUES
('BK-1001', 1, 2, 'Hyundai Creta (MH 04 ET 9102)', 'Brake Inspection & Periodic Service', '2026-10-12', '10:00 AM', 'Brake pedal feels soft and slight grinding sound under heavy braking.', 'In Progress', 'Vikram Singh', 1, '₹4,800', '2026-10-08'),
('BK-1002', 1, 3, 'Tata Nexon EV (DL 01 AA 1001)', 'EV High-Voltage Battery & Cell Diagnostic', '2026-10-20', '02:30 PM', 'Cell balancing calibration & regenerative braking diagnostic check.', 'In Progress', 'Pooja Verma', 2, '₹3,500', '2026-10-09'),
('BK-1003', 1, 1, 'Honda City (MH 02 CZ 4489)', 'Scheduled 25,000 km Oil & Filter Change', '2026-10-22', '11:30 AM', 'Periodic scheduled synthetic engine oil change with multipoint check.', 'Pending', 'Unassigned', NULL, '₹3,200', '2026-10-09'),
('BK-0994', 1, 1, 'Honda City (MH 02 CZ 4489)', 'Wheel Alignment & Balancing', '2026-09-15', '11:00 AM', 'Steering pulling slightly to the left side on highways.', 'Completed', 'Vikram Singh', 1, '₹1,500', '2026-09-12');

-- 5. Insert Job Cards (Distinct jobs for Vikram Singh (id 1) and Pooja Verma (id 2))
INSERT IGNORE INTO job_cards (id, booking_id, vehicle_name, customer_name, customer_phone, mechanic_id, mechanic_name, status, priority, progress_percent, notes, updated_at) VALUES
('JC-1001', 'BK-1001', 'Hyundai Creta (MH 04 ET 9102)', 'Rahul Sharma', '+91 98765 43210', 1, 'Vikram Singh', 'In Progress', 'High', 65, 'Rotor has light scoring but within factory threshold. Front ceramic pads replaced.', '2026-10-09 11:30 AM'),
('JC-1002', 'BK-1002', 'Tata Nexon EV (DL 01 AA 1001)', 'Rahul Sharma', '+91 98765 43210', 2, 'Pooja Verma', 'In Progress', 'Normal', 50, 'OBD-II DTC scan normal. HV battery state-of-health at 97.8%. Cell balancing in progress.', '2026-10-09 12:45 PM'),
('JC-0994', 'BK-0994', 'Honda City (MH 02 CZ 4489)', 'Rahul Sharma', '+91 98765 43210', 1, 'Vikram Singh', 'Completed', 'Normal', 100, '3D Laser Alignment completed. Road test verified smooth.', '2026-09-15 01:15 PM');

-- 6. Insert Invoices (Including pending invoice for Razorpay Test Mode payment)
INSERT IGNORE INTO invoices (id, booking_id, user_id, vehicle_name, date, due_date, subtotal, tax, total, status, payment_method) VALUES
('INV-2026-104', 'BK-1001', 1, 'Hyundai Creta (MH 04 ET 9102)', '2026-10-09', '2026-10-12', 4800.0, 864.0, 5664.0, 'Pending', 'Unpaid'),
('INV-2026-089', 'BK-0994', 1, 'Honda City ZX (MH 02 CZ 4489)', '2026-09-15', '2026-09-15', 1500.0, 270.0, 1770.0, 'Paid', 'Razorpay Test Mode');
