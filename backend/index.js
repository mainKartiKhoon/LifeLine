const express = require("express");
const app = express();
const rootRouter = require("./routes/index");
const {connectDb} = require("./db");
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use("/api/v1", rootRouter);

connectDb();

app.listen(5555, () => {
    console.log("Port 5555 activated...")
})