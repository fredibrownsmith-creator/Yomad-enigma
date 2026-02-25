import { apiRequest } from './client';
export const getVenues    = (token)          => apiRequest('/venues',            'GET',  null, token);
export const searchVenues = (params, token)  => apiRequest(`/venues/search?${new URLSearchParams(params)}`, 'GET', null, token);
export const getVenue     = (id, token)      => apiRequest(`/venues/${id}`,      'GET',  null, token);
export const createVenue  = (data, token)    => apiRequest('/venues',            'POST', data, token);
export const updateVenue  = (id, data, token)=> apiRequest(`/venues/${id}`,      'PUT',  data, token);
export const deleteVenue  = (id, token)      => apiRequest(`/venues/${id}`,      'DELETE', null, token);
export const addVenueReview = (id, data, token) => apiRequest(`/venues/${id}/reviews`, 'POST', data, token);
