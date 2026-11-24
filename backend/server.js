import app from "./app.js";

const PORT = process.env.PORT || 5000;

// When running locally in Node, listen on PORT
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export default app for Vercel Serverless Function handling
export default app;
