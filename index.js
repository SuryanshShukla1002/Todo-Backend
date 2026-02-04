const express = require("express");
const cors = require("cors");
const { setupTheDatabase } = require("./database/db.js");
const authRouter = require("./routes/authRoutes.js");
const todoRouter = require("./routes/todoRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

setupTheDatabase();

app.use("/api/auth", authRouter);
app.use("/api/todos", todoRouter);
app.use("/api/admin", adminRouter);


app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});




app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`,);
});