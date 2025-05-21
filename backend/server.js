require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");// Ensure your Express static serving is properly configured
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require('./routes/courseRoutes');
const videoRoutes = require("./routes/videoRoutes");
const settingsRoutes = require('./routes/settingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'Content-Length']
}));
app.use(express.json()); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));
app.use("/", userRoutes);
app.use('/api', courseRoutes);
app.use("/api", videoRoutes);
app.use('/api/user', settingsRoutes);
app.use('/api', adminRoutes);
app.use('/api/payment', paymentRoutes);



app.listen(5001, () => {
  console.log('Backend running on http://localhost:5001');
});
