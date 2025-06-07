const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Update origin to allow your frontend domain
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://stackscope.vercel.app'],
    credentials: true,
  })
);

app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        // 🔁 Redirect URI for production
        redirect_uri: 'https://stackscope.vercel.app/auth/github/callback',
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    console.log('GitHub token response:', tokenResponse.data);

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ error: 'No access token returned' });
    }

    // Use token to get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userResponse.data;

    // Return user info for frontend
    res.json({ user: githubUser, accessToken });
  } catch (error) {
    console.error('GitHub OAuth callback error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});