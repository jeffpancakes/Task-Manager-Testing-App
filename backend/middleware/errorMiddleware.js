export default function errorMiddleware(err, req, res, next) {
  console.error(err);

  return res.status(500).json({
    message: 'Nastala neočekávaná chyba serveru.',
  });
}