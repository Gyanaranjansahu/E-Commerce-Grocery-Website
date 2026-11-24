import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Run the HTTP server locally only.
// Vercel handles incoming requests in its serverless environment.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export Express app for Vercel
export default app;