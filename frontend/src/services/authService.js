import { apiRequest, setAuthToken } from './api';
import { initialUsers, seedDatabase } from './mockData';

seedDatabase();

export const demoUsers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'customer@mavis.com',
    phone: '+91 98765 43210',
    role: 'CUSTOMER',
  },
  {
    id: 2,
    name: 'Vikram Singh',
    email: 'mechanic@mavis.com',
    phone: '+91 98111 22334',
    role: 'MECHANIC',
    specialization: 'Brakes & Powertrain (Mech #1)',
  },
  {
    id: 4,
    name: 'Pooja Verma',
    email: 'pooja@mavis.com',
    phone: '+91 98222 33445',
    role: 'MECHANIC',
    specialization: 'EV & Diagnostics (Mech #2)',
  },
  {
    id: 3,
    name: 'Anita Roy',
    email: 'admin@mavis.com',
    phone: '+91 99000 11223',
    role: 'ADMIN',
  },
];

export const authService = {
  async login(email, password = 'password123') {
    // 1. Try real Spring Boot backend first
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.data && res.data.token) {
      setAuthToken(res.data.token);
      localStorage.setItem('mavis_current_user', JSON.stringify(res.data.user));
      return { user: res.data.user, token: res.data.token };
    }

    // 2. Fallback to mock/demo users if backend offline
    const users = JSON.parse(localStorage.getItem('mavis_users')) || demoUsers;
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      const mockToken = `mavis_jwt_token_${found.role.toLowerCase()}_${Date.now()}`;
      setAuthToken(mockToken);
      localStorage.setItem('mavis_current_user', JSON.stringify(found));
      return { user: found, token: mockToken };
    }

    // Generic fallback
    const defaultUser = {
      id: 99,
      name: email.split('@')[0],
      email,
      role: email.includes('admin') ? 'ADMIN' : email.includes('mech') ? 'MECHANIC' : 'CUSTOMER',
    };
    const mockToken = `mavis_jwt_token_demo_${Date.now()}`;
    setAuthToken(mockToken);
    localStorage.setItem('mavis_current_user', JSON.stringify(defaultUser));
    return { user: defaultUser, token: mockToken };
  },

  async register(userData) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (res.data && res.data.token) {
      setAuthToken(res.data.token);
      localStorage.setItem('mavis_current_user', JSON.stringify(res.data.user));
      return { user: res.data.user, token: res.data.token };
    }

    const users = JSON.parse(localStorage.getItem('mavis_users')) || demoUsers;
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+91 90000 00000',
      role: userData.role || 'CUSTOMER',
    };
    users.push(newUser);
    localStorage.setItem('mavis_users', JSON.stringify(users));

    const mockToken = `mavis_jwt_token_${newUser.role.toLowerCase()}_${Date.now()}`;
    setAuthToken(mockToken);
    localStorage.setItem('mavis_current_user', JSON.stringify(newUser));
    return { user: newUser, token: mockToken };
  },

  logout() {
    setAuthToken(null);
    localStorage.removeItem('mavis_current_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('mavis_current_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    // Default logged in as Rahul Sharma (CUSTOMER)
    const defaultUser = demoUsers[0];
    localStorage.setItem('mavis_current_user', JSON.stringify(defaultUser));
    return defaultUser;
  },

  async switchRole(role, specificEmail = null) {
    let targetEmail = specificEmail;
    if (!targetEmail) {
      if (role === 'CUSTOMER') targetEmail = 'customer@mavis.com';
      else if (role === 'MECHANIC') targetEmail = 'mechanic@mavis.com';
      else if (role === 'ADMIN') targetEmail = 'admin@mavis.com';
    }

    // Try real login with backend to obtain a verified Spring Boot JWT
    try {
      const res = await this.login(targetEmail, 'password123');
      return res.user;
    } catch (e) {
      const users = JSON.parse(localStorage.getItem('mavis_users')) || demoUsers;
      const match = users.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase()) || {
        id: Date.now(),
        name: `${role.charAt(0) + role.slice(1).toLowerCase()} User`,
        email: targetEmail,
        role,
      };
      setAuthToken(`mavis_jwt_token_${role.toLowerCase()}_switched`);
      localStorage.setItem('mavis_current_user', JSON.stringify(match));
      return match;
    }
  },
};

export default authService;
