import { apiRequest } from './client';
export const getOffers = (category, token) => apiRequest(`/offers${category ? `?category=${category}` : ''}`, 'GET', null, token);
export const getOffer  = (id, token)       => apiRequest(`/offers/${id}`, 'GET', null, token);
