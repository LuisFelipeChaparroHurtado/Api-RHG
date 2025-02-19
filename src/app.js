const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const kidRoutes = require("./routes/kidsRoutes");
const gameRoutes = require("./routes/gameRoutes");
const storiesRoutes = require("./routes/storieRoutes");
const maganizeRoutes = require("./routes/maganizeRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', authRoutes);
app.use('/api/kids', kidRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/maganizes', maganizeRoutes);

module.exports = app;
