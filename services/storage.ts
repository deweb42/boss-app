import { ClientData } from '../types';
import { DEFAULT_CLIENT_DATA } from '../constants';

const STORAGE_KEY = 'acquisition_framework_os_v2';

export const getClientData = (): ClientData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Merge with default to ensure new fields (like branding/unlocks) exist if loading old data
      return { ...DEFAULT_CLIENT_DATA, ...parsed };
    }
  } catch (error) {
    console.error('Error reading from local storage', error);
  }
  return DEFAULT_CLIENT_DATA;
};

export const saveClientData = (data: ClientData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to local storage', error);
  }
};

export const resetClientData = (): void => {
    localStorage.removeItem(STORAGE_KEY);
}