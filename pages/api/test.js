export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "API çalışıyor!",
    timestamp: new Date().toISOString(),
    method: req.method,
  });
}
