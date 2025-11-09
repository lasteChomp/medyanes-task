import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const todos = await prisma.todo.findMany({
          orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, data: todos });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const { title, description } = req.body;
        const todo = await prisma.todo.create({
          data: { title, description },
        });
        res.status(201).json({ success: true, data: todo });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
