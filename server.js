require('dotenv').config({ path: './.env' });
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const { getData } = require('./dataInsert');
const crypto = require('crypto');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// Access the MongoDB URI from the environment variable
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

// Create a new MongoDB session store
const store = new MongoDBStore({
  uri: mongoURI,
  collection: 'sessions', // Choose a collection name for storing sessions
});

// Catch errors in the MongoDB session store
store.on('error', function (error) {
  console.error('Session store error:', error);
});

// Generate a random session secret
const sessionSecret = crypto.randomBytes(64).toString('hex');

// Middleware
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Configure session middleware
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Set the session cookie expiration time (1 day)
    },
  })
);

// Routes
const userRoutes = require('./userRoutes');
app.use('/api/users', userRoutes);

// Handle GET request to /api/products
app.get('/api/products', async (req, res) => {
  try {
    const products = await getData();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port localhost:${port}`);
});
