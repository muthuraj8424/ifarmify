const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

const app = express();
app.use(cors());

// Enable CORS for only your frontend domain (http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://startup:startup@startup.dzqfb.mongodb.net/?retryWrites=true&w=majority&appName=startup', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/buyer', buyerRoutes);
app.use('/payment', paymentRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));