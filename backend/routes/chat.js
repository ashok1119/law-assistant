import express from 'express';
import fetch from 'node-fetch';
import Chat from '../models/Chat.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/auto';

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ message: 'Server missing OPENROUTER_API_KEY' });
    }

    const { prompt, username } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'prompt is required' });
    }
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: 'username is required' });
    }

    const resp = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        // Optional but recommended by OpenRouter
        'HTTP-Referer': process.env.PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.SITE_TITLE || 'IDP App',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ message: 'Upstream error', detail: text });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || '';

    // Persist the exchange
    try {
      await Chat.create({ username, prompt, reply: content });
    } catch (dbErr) {
      // Log but don't fail the request solely due to persistence issues
      console.error('Failed to save chat:', dbErr);
    }

    return res.json({ reply: content });
  } catch (err) {
    console.error('Chat proxy error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
