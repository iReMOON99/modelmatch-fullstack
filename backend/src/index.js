const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('./lib/prisma');
const { upload } = require('./lib/cloudinary');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Middleware to authenticate JWT
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/', (req, res) => {
  res.json({ message: 'Backend is working' });
});

// Auth Endpoints
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role, name } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password and role are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role.toUpperCase(),
        name: name || email.split('@')[0]
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Profile & Social Endpoints
app.post('/api/user/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { avatarUrl: req.file.path },
    });

    res.json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

app.get('/api/social/gifts', async (req, res) => {
  try {
    const gifts = await prisma.gift.findMany({ where: { isActive: true } });
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gifts' });
  }
});

app.post('/api/social/send-gift', authenticate, async (req, res) => {
  const { giftId, receiverId } = req.body;
  try {
    const gift = await prisma.gift.findUnique({ where: { id: giftId } });
    const sender = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (sender.balance < gift.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const [userGift] = await prisma.$transaction([
      prisma.userGift.create({
        data: {
          giftId,
          senderId: req.user.userId,
          receiverId,
        }
      }),
      prisma.user.update({
        where: { id: req.user.userId },
        data: { balance: { decrement: gift.price } }
      }),
      prisma.message.create({
        data: {
          senderId: req.user.userId,
          receiverId,
          type: 'GIFT',
          giftId,
          content: `Sent a gift: ${gift.name}`
        }
      })
    ]);

    res.json(userGift);
  } catch (error) {
    console.error('Send gift error:', error);
    res.status(500).json({ error: 'Failed to send gift' });
  }
});

app.get('/api/social/stickers', async (req, res) => {
  try {
    const packs = await prisma.stickerPack.findMany({
      include: { stickers: true }
    });
    res.json(packs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stickers' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
