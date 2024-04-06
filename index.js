const express = require('express')
const connectDb = require('./connection/database')
const cors =require('cors')
const userRouter = require('./routes/userRoutes')
const adminRouter = require("./routes/adminRoutes")
const doctorRouter = require("./routes/doctorRoutes")
const app = express()
const path = require('path')

const PORT = 5000

const corsOptions = {
    origin: ["http://localhost:5173"],
    method: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.use(express.static(path.resolve(__dirname, "frontend", "dist")))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}/`);
    })
})