const express=require('express');
const authRoutes=require('./Routes/authRoutes');
const studentRoutes=require('./Routes/studentRoutes');
const app=express();
const dotenv=require('dotenv').config();
const connectDB=require('./config/db');
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
connectDB();
app.get('/',(req,res)=>{
    res.send('API is running....');
});
app.use("/api/auth", authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', require('./Routes/adminRoutes'));



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});