require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

//import Routes
const userRoutes = require("./Routes/users");
const authRoutes = require("./Routes/auth");

//middlewares
app.use(express.json());
app.use(cors());

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));


