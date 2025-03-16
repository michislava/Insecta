import dotenv from 'dotenv';

dotenv.config();

export const session = require('express-session');

export const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false },
    resave: false,
    saveUninitialized: true
}

