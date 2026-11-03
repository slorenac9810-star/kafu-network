const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let posts = [
  {
    id: 1,
    author: 'angiesoler',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    caption: '¡Bienvenid@s a Kafu! Tu nueva red social 💜🩵💚 #KafuApp',
    likes: 42
  }
];

let users = [
  {
    username: 'angiesoler',
    name: 'Angie Soler',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    bio: 'Desarrolladora & Creadora de Kafu 🚀✨',
    followers: 1280,
    following: 450
  }
];

app.get('/api/posts', (req, res) => res.json(posts));

app.post('/api/posts', (req, res) => {
  const { caption, image, author } = req.body;
  const newPost = {
    id: Date.now(),
    author: author || 'angiesoler',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    image: image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    caption: caption || '',
    likes: 0
  };
  posts.unshift(newPost);
  res.status(201).json(newPost);
});

app.get('/api/user/:username', (req, res) => {
  const username = req.params.username;
  const user = users.find(u => u.username === username) || {
    username: username,
    name: username,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    bio: 'Usuario de Kafu ✨',
    followers: 120,
    following: 80
  };
  const userPosts = posts.filter(p => p.author === username);
  res.json({ user, posts: userPosts });
});

app.listen(PORT, () => console.log(`Servidor Kafu ejecutándose en el puerto ${PORT}`));