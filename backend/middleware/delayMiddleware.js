export default async function delayMiddleware(req, res, next) {
  const delay = 500 + Math.floor(Math.random() * 501);

  await new Promise((resolve) => setTimeout(resolve, delay));

  next();
}