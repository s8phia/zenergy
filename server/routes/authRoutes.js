import express from 'express';
import {connectToDatabase} from '../lib/db.js'
const router = express.Router();
import bcrypt from 'bcrypt';

router.post('/register', async (req, res) => {
    const{ username, email, password } = req.body;
    try {
        const db = await connectToDatabase();
        const[rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
        if(rows.length>0){
            return res.status(409).json({message: 'User already exists'})
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashPassword])
        res.status(201).json({message: 'User registered successfully'})
    } catch(err) {
        res.status(500).json(err)
    }

})

export default router;