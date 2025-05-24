const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const app = express();
const pool = require('../db/client');
const authenticate = require('../middleware/authenticate')
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

router.get('/', async(req, res) => {
    try{
        const results = await pool.query('SELECT * FROM items');
        res.json(results.rows)
    }catch(err){
        res.status(500).json({error: "Failed to fetch items"})
    }
} )

router.get('/:itemId', async(req, res) => {
    const {itemId} = req.params;
    try{
        const result = await pool.query('SELECT * FROM items WHERE id = $1', [itemId])
        if(result.rows.length === 0){
            return res.status(404).json({error: "Item not found"})
        }
        res.json(result.rows[0])
    }catch(err){
        res.status(500).json({error: "Failed to fetch item"})
    }
})

router.get('/search/q', async(req, res) => {
    const { q } = req.query;
    console.log("Here: ", q)
    try{
        const results = await pool.query(`
            SELECT * FROM items 
            WHERE LOWER(title) LIKE LOWER($1)
                OR LOWER(artist) LIKE LOWER($1)
            `, [`%${q}%`]);
        res.json(results.rows);
    }catch(err){
        res.status(500).json({error: "Search failed"})
    }
})

module.exports = router;