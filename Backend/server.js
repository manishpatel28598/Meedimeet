const express = require('express')
const cors = require('cors');
const morgan = require('morgan')
const connectDb = require('./config/db');
const dotenv = require('dotenv');
const app = express()
const PORT = process.env.PORT || 8000;

//dotenv config
dotenv.config();

//mongodeb connection
connectDb()

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use('/api/v1/admin', require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//simple Api route

app.get('/api/data', (req, res)=>{
    res.send({message: "hello from the backend"});
});

app.listen(PORT, ()=>{
    console.log(`server is running at port: ${PORT}`);
})