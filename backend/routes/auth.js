const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const app = express();
const pool = require('../db/client');
const authenticate = require('../middleware/authenticate')
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async(req, res) => {
    const {username, email, password, role = 'user'} = req.body;
    try{
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role', [username, email, hash, role]);
        const user = result.rows[0]
        const token = jwt.sign({id: user.id, username: user.username, email: user.email, role: user.role}, JWT_SECRET, {expiresIn: '1h'})
        res.status(201).json({ token });
    }catch(err){
        res.status(500).json({error: "Server Error"})
    }
})

router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0]
        if(!user){
            return res.status(401).json({error: "Invalid Credentials"});
        }
        const valid = await bcrypt.compare(password, user.password)
        if(!valid){
            return res.status(401).json({error: "Invalid Credentials"});
        }
        const token = jwt.sign({id: user.id, email: user.email, role: user.role, username: user.username}, JWT_SECRET, {expiresIn: '1h'})
        res.status(201).json({token})
    }catch(err){
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/me', authenticate, async(req, res) => {
    try{
        const result = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [req.user.id]);
        res.send(result.rows[0]);
    }catch(err){
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
})

router.get('/:userId', async(req, res) => {
    const { userId } = req.params;
    try{
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        res.json(result.rows)
    }catch(err){
        res.status(500).json({error: "Failed to fetch user"})
    }
})

router.get('/', async(req, res) => {
    try{
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows)
    }catch(err){
        res.status(500).json({error: "Failed to fetch users"})
    }
})

module.exports = router;