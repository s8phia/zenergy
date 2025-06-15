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

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [req.params.id, req.userId]
        );
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});


router.patch('/:id', verifyToken, async (req, res) => {
    const {title, description, energy_level} = req.body;
    try{
        const db = await connectToDatabase();
        await db.query(
            'UPDATE todos SET title = ?, description = ?, energy_level = ? WHERE id = ? AND user_id = ?',
            [title, description, energy_level, req.params.id, req.userId]
          );
          
        res.status(200).json({ message: "Task updated successfully" });
    } catch(err){
        console.error(err);
        res.status(500).json({message: "server error"});
    }
})

router.put('/:id/complete', verifyToken, async (req, res) => {
    const {completed} = req.body;
    if(typeof completed === 'undefined'){
        return res.status(400).json({ message: "Missing 'completed' field" });
    }
    try {
        const db = await connectToDatabase();
        await db.query(
            'UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?',
            [completed, req.params.id, req.userId]
        );
        res.status(200).json({ message: "Task completion status updated successfully" });

    } catch(err){
        console.error(err);
        res.status(500).json({message: "server error"});
    }
})

export default router;