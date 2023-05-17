import axios from 'axios';
import { MenusInterface } from 'interfaces/menus';

export const getMenus = async () => {
  const response = await axios.get(`/api/menus`);
  return response.data;
};

export const createMenus = async (menus: MenusInterface) => {
  const response = await axios.post('/api/menus', menus);
  return response.data;
};

export const updateMenusById = async (id: string, menus: MenusInterface) => {
  const response = await axios.put(`/api/menus/${id}`, menus);
  return response.data;
};

export const getMenusById = async (id: string) => {
  const response = await axios.get(`/api/menus/${id}`);
  return response.data;
};
