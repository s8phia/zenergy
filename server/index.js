import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import tasksRouter from './routes/taskRoutes.js';
import chatRoutes from './routes/chat.js';

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}))
app.use(express.json())
app.use('/auth', authRouter) 
app.use('/tasks', tasksRouter);
app.use('/api', chatRoutes);


app.get('/', (req, res) => {
    console.log("req.body")
})




app.listen(process.env.PORT, () => {
    console.log('Server is running on http://localhost:5000');
});