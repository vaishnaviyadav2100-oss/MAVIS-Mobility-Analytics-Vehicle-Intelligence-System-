// Initial Mock Database for MAVIS frontend demo & fallback mode
export const initialUsers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'customer@mavis.com',
    phone: '+91 98765 43210',
    role: 'CUSTOMER',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  },
  {
    id: 2,
    name: 'Vikram Singh',
    email: 'mechanic@mavis.com',
    phone: '+91 98111 22334',
    role: 'MECHANIC',
    specialization: 'Brakes & Engine Transmission',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  },
  {
    id: 3,
    name: 'Anita Roy',
    email: 'admin@mavis.com',
    phone: '+91 99000 11223',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
];

export const initialVehicles = [
  {
    id: 1,
    userId: 1,
    registrationNo: 'MH 02 CZ 4489',
    brand: 'Honda',
    model: 'City ZX',
    year: 2022,
    fuelType: 'Petrol',
    odometer: '24,500 km',
    color: 'Lunar Silver',
    lastService: '12 Jan 2026',
    status: 'Active',
  },
  {
    id: 2,
    userId: 1,
    registrationNo: 'MH 04 ET 9102',
    brand: 'Hyundai',
    model: 'Creta SX(O)',
    year: 2023,
    fuelType: 'Diesel',
    odometer: '18,200 km',
    color: 'Polar White',
    lastService: '05 Mar 2026',
    status: 'In Service',
  },
  {
    id: 3,
    userId: 1,
    registrationNo: 'DL 01 AA 1001',
    brand: 'Tata',
    model: 'Nexon EV Empowered',
    year: 2024,
    fuelType: 'Electric',
    odometer: '9,400 km',
    color: 'Daytona Grey',
    lastService: 'N/A (New)',
    status: 'Active',
  },
];

export const initialBookings = [
  {
    id: 'BK-1001',
    userId: 1,
    vehicleId: 2,
    vehicleName: 'Hyundai Creta (MH 04 ET 9102)',
    serviceType: 'Brake Inspection & Periodic Service',
    bookingDate: '2026-10-12',
    timeSlot: '10:00 AM',
    description: 'Brake pedal feels soft and slight grinding sound under heavy braking.',
    status: 'In Progress', // Pending, Confirmed, In Progress, Ready, Completed, Cancelled
    assignedMechanic: 'Vikram Singh',
    mechanicId: 2,
    estimatedCost: '₹4,800',
    createdAt: '2026-10-08',
  },
  {
    id: 'BK-1002',
    userId: 1,
    vehicleId: 1,
    vehicleName: 'Honda City (MH 02 CZ 4489)',
    serviceType: 'Oil & Filter Change + AC Servicing',
    bookingDate: '2026-10-20',
    timeSlot: '02:30 PM',
    description: 'Scheduled 25,000 km routine maintenance.',
    status: 'Confirmed',
    assignedMechanic: 'Pooja Verma',
    mechanicId: 4,
    estimatedCost: '₹3,200',
    createdAt: '2026-10-09',
  },
  {
    id: 'BK-0994',
    userId: 1,
    vehicleId: 1,
    vehicleName: 'Honda City (MH 02 CZ 4489)',
    serviceType: 'Wheel Alignment & Balancing',
    bookingDate: '2026-09-15',
    timeSlot: '11:00 AM',
    description: 'Steering pulling slightly to the left side on highways.',
    status: 'Completed',
    assignedMechanic: 'Vikram Singh',
    mechanicId: 2,
    estimatedCost: '₹1,500',
    createdAt: '2026-09-12',
  },
];

export const initialJobs = [
  {
    id: 'JC-801',
    bookingId: 'BK-1001',
    vehicleName: 'Hyundai Creta (MH 04 ET 9102)',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    mechanicId: 2,
    mechanicName: 'Vikram Singh',
    status: 'In Progress',
    priority: 'High',
    progressPercent: 65,
    tasks: [
      { id: 1, title: 'Inspect front brake rotor thickness', done: true },
      { id: 2, title: 'Check brake caliper pin lubrication', done: true },
      { id: 3, title: 'Replace ceramic brake pads', done: true },
      { id: 4, title: 'Bleed hydraulic brake fluid line', done: false },
      { id: 5, title: 'Final road test & ABS check', done: false },
    ],
    notes: 'Rotor has light scoring but within factory threshold. Replaced front pads with OEM pads.',
    updatedAt: '2026-10-09 11:30 AM',
  },
  {
    id: 'JC-798',
    bookingId: 'BK-0994',
    vehicleName: 'Honda City (MH 02 CZ 4489)',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    mechanicId: 2,
    mechanicName: 'Vikram Singh',
    status: 'Completed',
    priority: 'Normal',
    progressPercent: 100,
    tasks: [
      { id: 1, title: '3D Laser wheel alignment check', done: true },
      { id: 2, title: 'Camber and toe angle adjustment', done: true },
      { id: 3, title: 'High-speed wheel balancing test', done: true },
    ],
    notes: 'Front left camber corrected from -0.8 to 0.0 degrees. Test drive smooth.',
    updatedAt: '2026-09-15 01:15 PM',
  },
];

export const initialInvoices = [
  {
    id: 'INV-2026-089',
    bookingId: 'BK-0994',
    userId: 1,
    vehicleName: 'Honda City ZX (MH 02 CZ 4489)',
    date: '2026-09-15',
    dueDate: '2026-09-15',
    items: [
      { description: '3D Computerized Wheel Alignment', amount: 650 },
      { description: 'Dynamic Wheel Balancing (4 Wheels)', amount: 600 },
      { description: 'Balancing Lead Weights', amount: 250 },
    ],
    subtotal: 1500,
    tax: 270,
    total: 1770,
    status: 'Paid',
    paymentMethod: 'UPI / GPay',
  },
  {
    id: 'INV-2026-104',
    bookingId: 'BK-1001',
    userId: 1,
    vehicleName: 'Hyundai Creta (MH 04 ET 9102)',
    date: '2026-10-09',
    dueDate: '2026-10-12',
    items: [
      { description: 'OEM Ceramic Front Brake Pads', amount: 2850 },
      { description: 'Brake Disc Resurfacing / Lathe', amount: 800 },
      { description: 'DOT4 Brake Fluid Flush (1L)', amount: 450 },
      { description: 'Labor & Safety Inspection Charge', amount: 700 },
    ],
    subtotal: 4800,
    tax: 864,
    total: 5664,
    status: 'Pending',
    paymentMethod: 'Unpaid',
  },
];

export const seedDatabase = () => {
  if (!localStorage.getItem('mavis_users')) {
    localStorage.setItem('mavis_users', JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem('mavis_vehicles')) {
    localStorage.setItem('mavis_vehicles', JSON.stringify(initialVehicles));
  }
  if (!localStorage.getItem('mavis_bookings')) {
    localStorage.setItem('mavis_bookings', JSON.stringify(initialBookings));
  }
  if (!localStorage.getItem('mavis_jobs')) {
    localStorage.setItem('mavis_jobs', JSON.stringify(initialJobs));
  }
  if (!localStorage.getItem('mavis_invoices')) {
    localStorage.setItem('mavis_invoices', JSON.stringify(initialInvoices));
  }
};
