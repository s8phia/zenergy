// server/routes/chat.js
import express from 'express';
import axios from 'axios';
const router = express.Router();


const OPENROUTER_API_KEY = process.env.CHAT_KEY;

router.post('/chat', async (req, res) => {
  try {
    const { message, tasks = [], username = 'User' } = req.body;

    const formattedTasks = tasks.length === 0
      ? 'No tasks added yet.'
      : tasks.map(task => {
          const completed = task.completed === 1 ? '✅ Completed' : '❌ Not completed';
          return `- "${task.title}" (${task.energy_level} energy): ${task.description} [${completed}]`;
        }).join('\n');

    const systemPrompt = `
You are a helpful task assistant named Zenergy Bot. You are helping ${username} manage their time, energy, and productivity.

Here are ${username}'s current tasks:
${formattedTasks}

Based on what ${username} asks, offer personalized suggestions (e.g., "Do low energy tasks first", or "You could complete XYZ now"). 
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error communicating with DeepSeek API:', error.response?.data || error.message);
    res.status(500).send('Internal Server Error');
  }
});


export default router;
