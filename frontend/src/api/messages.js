import { apiRequest } from './client';
export const getInbox       = (token)          => apiRequest('/messages/inbox',   'GET', null, token);
export const getConversation = (userId, token) => apiRequest(`/messages/${userId}`, 'GET', null, token);
