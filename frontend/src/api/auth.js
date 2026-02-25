import { apiRequest } from './client';
export const loginUser    = (email, password) => apiRequest('/auth/login',   'POST', { email, password });
export const registerUser = (userData)        => apiRequest('/auth/register', 'POST', userData);
export const fetchProfile = (token)           => apiRequest('/auth/profile',  'GET',  null, token);
export const updateProfile = (data, token)   => apiRequest('/auth/profile',  'PUT',  data, token);
