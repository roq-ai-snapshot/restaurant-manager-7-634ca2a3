import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getMenus();
    case 'POST':
      return createMenus();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMenus() {
    const data = await prisma.menus.findMany({});
    return res.status(200).json(data);
  }

  async function createMenus() {
    const data = await prisma.menus.create({
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
