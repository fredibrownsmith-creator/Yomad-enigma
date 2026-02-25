import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'yoganomad_token';
export const getToken    = ()      => AsyncStorage.getItem(KEY);
export const setToken    = (token) => AsyncStorage.setItem(KEY, token);
export const removeToken = ()      => AsyncStorage.removeItem(KEY);
