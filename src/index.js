const express = require("express");
const env = require("./config/env.config");
const cors = require("cors");
const { connect, getConn } = require('./database/connection');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:5173",
        optionsSuccessStatus: 200,
    })
); 

// app.use('/api', apiRouter);

app.all('*', (req, res) => {
    return res.status(404).json({ message: `Page Not Found!` });
});

const port = 3000;
app.listen(port, env("HOST"), () => console.log(`Listening on port ${port}!`));
connect();