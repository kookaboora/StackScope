// server.js (CommonJS version)
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

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
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        // redirect_uri should match exactly the one used in authorization request
        redirect_uri: 'http://localhost:5173/auth/github/callback',
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

    // TODO: Save the user info and token in your DB or session here

    // For now, just return user info for demo
    res.json({ user: githubUser, accessToken });
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    res.status(500).send('Authentication failed');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


