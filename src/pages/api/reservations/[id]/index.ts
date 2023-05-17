import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getReservations();
    case 'PUT':
      return updateReservations();
    case 'DELETE':
      return deleteReservations();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getReservations() {
    const data = await prisma.reservations.findFirst({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }

  async function updateReservations() {
    const data = await prisma.reservations.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteReservations() {
    const data = await prisma.reservations.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
