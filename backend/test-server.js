import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;

// Minimal test - just return OK
app.get('/', (req, res) => {
  res.json({ 
    status: "OK",
    message: "Wasalni Test Server is Running",
    port: PORT,
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server listening on port ${PORT}`);
});