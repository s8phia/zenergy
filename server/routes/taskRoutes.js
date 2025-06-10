import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import jwt from 'jsonwebtoken';

const router= express.Router();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if(!token) {
            return res.status(403).json({message: "No Token Provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userId = decoded.id;
        next()
    }  catch(err) {
        return res.status(500).json({message: "server error"})
    }
}


router.post('/', verifyToken, async (req, res) => {
    const {title, description, energy_level} = req.body;
    if (!title) {
        return res.status(400).json({message: "title required"});
    }

    try{
        const db = await connectToDatabase();
        await db.query(
            'INSERT INTO todos (user_id, title, description, energy_level) VALUES (?, ?, ?, ?)',
            [req.userId, title, description, energy_level]
          );
          
        res.status(201).json({ message: "Task created successfully" });
    } catch(err){
        console.error(err);
        res.status(500).json({message: "server error"});
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query(
            'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [req.userId]
        );
        res.status(200).json({ tasks: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
})

export default router;