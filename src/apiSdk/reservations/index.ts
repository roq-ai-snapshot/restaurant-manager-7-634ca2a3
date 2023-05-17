import axios from 'axios';
import { ReservationsInterface } from 'interfaces/reservations';

export const getReservations = async () => {
  const response = await axios.get(`/api/reservations`);
  return response.data;
};

export const createReservations = async (reservations: ReservationsInterface) => {
  const response = await axios.post('/api/reservations', reservations);
  return response.data;
};

export const updateReservationsById = async (id: string, reservations: ReservationsInterface) => {
  const response = await axios.put(`/api/reservations/${id}`, reservations);
  return response.data;
};

export const getReservationsById = async (id: string) => {
  const response = await axios.get(`/api/reservations/${id}`);
  return response.data;
};
