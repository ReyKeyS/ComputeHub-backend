const express = require("express");
const env = require("./config/env.config");
const cors = require("cors");
const { connect, getConn } = require('./database/connection');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: '*',
        optionsSuccessStatus: 200,
    })
); 

// Routes
const userRouter = require("./routes/users");
const itemRouter = require("./routes/items");
const cartsRouter = require("./routes/carts");
const transRouter = require("./routes/trans");

app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);
app.use('/api/users/carts', cartsRouter);
app.use('/api/users/transaction', transRouter);

app.all('*', (req, res) => {
    return res.status(404).json({ message: `Page Not Found!` });
});

const port = 3000;
app.listen(port, env("HOST"), () => console.log(`Listening on port ${port}!`));
connect();