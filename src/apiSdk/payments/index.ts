import axios from 'axios';
import { PaymentsInterface } from 'interfaces/payments';

export const getPayments = async () => {
  const response = await axios.get(`/api/payments`);
  return response.data;
};

export const createPayments = async (payments: PaymentsInterface) => {
  const response = await axios.post('/api/payments', payments);
  return response.data;
};

export const updatePaymentsById = async (id: string, payments: PaymentsInterface) => {
  const response = await axios.put(`/api/payments/${id}`, payments);
  return response.data;
};

export const getPaymentsById = async (id: string) => {
  const response = await axios.get(`/api/payments/${id}`);
  return response.data;
};
