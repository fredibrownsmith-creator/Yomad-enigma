import { apiRequest } from './client';
export const getMembers         = (params, token) => apiRequest(`/community/members?${new URLSearchParams(params)}`, 'GET', null, token);
export const getMember          = (id, token)     => apiRequest(`/community/members/${id}`,    'GET',  null, token);
export const sendConnection     = (id, token)     => apiRequest(`/community/connect/${id}`,    'POST', null, token);
export const getConnections     = (token)         => apiRequest('/community/connections',      'GET',  null, token);
export const getPendingConnections = (token)      => apiRequest('/community/pending',          'GET',  null, token);
export const updateConnection   = (id, status, token) => apiRequest(`/community/connections/${id}`, 'PUT', { status }, token);
