import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) {
          return res
            .status(404)
            .json({ success: false, error: "Todo not found" });
        }
        res.status(200).json({ success: true, data: todo });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const { title, description, status } = req.body;
        const todo = await prisma.todo.update({
          where: { id },
          data: { title, description, status },
        });
        res.status(200).json({ success: true, data: todo });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    case "DELETE":
      try {
        await prisma.todo.delete({ where: { id } });
        res
          .status(200)
          .json({ success: true, message: "Todo deleted successfully" });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
