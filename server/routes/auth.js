const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Profile = require("../models/profile");   // Fixed import name

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 
        
        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        
        // Create profile for the user
        const userProfile = new Profile({
            user: user._id,
            bio: "",
            location: "",
            website: "",
            gender: "",
            dateOfBirth: null,
            profilePicture: "",
            createdAt: Date.now(),
        });
        await userProfile.save();
        
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error in /register:", error); // Debug log
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email }); // find that thier is existing email or not in DB
        if (!user){
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const existingProfile = await Profile.findOne({ user: user._id });
        if (!existingProfile) {
            // Create profile for the user if it doesn't exist
            const userProfile = new Profile({
                user: user._id,
                bio: "",
                location: "",
                website: "",
                gender: "",
                dateOfBirth: null,
                profilePicture: "",
                createdAt: Date.now(),
            });
            await userProfile.save();
        }
        // Generate JWT token
        const token =jwt.sign(
            {
                id:user._id,
                isHost:isSecureContext.isHost
,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            user:{
                id:user._id,name:user.name,isHost:user.isHost,
            },
        });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in /login:", error); // Debug log
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;