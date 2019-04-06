const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const inputValidation = require('../utils/validateInput');
const User = require('../db/models/User');

// Dotenv
require('dotenv').config();

// ROUTE:   =>  /api/auth/register 
// METHOD:  =>  POST
// DESC:    =>  Register a new user
router.post('/register', (req, res) => {
    // Check if the provided input is valid
    const inputErrors = inputValidation.register(req.body);
    // If the function returns false, in regards of no errors being returned, proceed
    if(!inputErrors) {
        const { email, password } = req.body;
        // Check if user exists via email
        User.findOne({ where: { email } })
        .then(user => {
            if(!user) {
                // If there's no user, register a new one
                // Hash the password
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // Save the user in the database
                        User.create({
                                email,
                                password: hash
                            })
                            .then(user => res.status(200).json(user))
                            .catch(err => res.status(500).json(err))
                    }
                })
            } else {
                // Send an error message
                res.status(400).json({ error: "User already exists." });
            }
        })
        .catch(err => console.error(err));
    } else {
        // Otherwise, return a JSON object containing all the errors
        res.status(400).json(inputErrors);
    }
});

// ROUTE:   =>  /api/auth/login 
// METHOD:  =>  POST
// DESC:    =>  Log in 
router.post('/login', (req, res) => {
    // Check for input errors
    const inputErrors = inputValidation.login(req.body);
    // If no errors, proceed
    if(!inputErrors) {
        const { email, password } = req.body;
        // Check if user exists within the database
        User.findOne({ where: { email } })
            .then(user => {
                // Send error message if there's no user
                if(!user) {
                    res.status(404).json({ error: 'User not found.' })
                } else {
                    // Compare provided password with the hash
                    bcrypt.compare(password, user.password, (err, match) => {
                        if(err) {
                            // Log the error if there's an error
                            console.error(err);
                        } else {
                            // If no match, send an error
                            if(!match) {
                                res.status(400).json({ error: 'Invalid password.' });
                            } else {
                                const { id, email } = user;
                                const payload = {
                                    id, email
                                };
                                jwt.sign(payload, process.env.SECRET_OR_KEY, {
                                    expiresIn: 86400
                                }, (err, token) => {
                                    if(err) {
                                        console.error(err);
                                    } else {
                                        res.status(200).json({ loggedIn: true, token: `Bearer ${token}` });
                                    }
                                })
                            }
                        }
                    })
                }
            })
    } else {
        // Return input errors
        res.status(400).json(inputErrors);
    }

});

// ROUTE:   =>  /api/auth/current 
// METHOD:  =>  GET
// DESC:    =>  Get current user
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Check if user exists
    User.findOne({ where: { id: req.user.id } })
        .then(user => {
            if(user) {
                // If user exists, send the user object
                const { id, email, createdAt } = user;
                const response = { id, email, createdAt };
                res.json(response);
            } else {
                // Return an error
                res.status(400).json({ error: 'User not found.' });
            }
        })
});

// ROUTE:   =>  /api/auth/delete 
// METHOD:  =>  DELETE
// DESC:    =>  Delete user
router.delete('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Find an user via ID and then delete it
    User.destroy({ where: { id: req.user.id } })
        // If the delete request was successful, send out a JSON object with the value of true
        .then(() => res.status(200).json({ deleted: true }))
        // Else, log the produced error
        .catch(err => console.error(err));
});

module.exports = router;