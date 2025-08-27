const express = require("express");
const router = express.Router();
const profile = require("../models/profile")
const auth = require("../middleware/auth")

// get user;

router.get("/", auth, async (req, res) => {
    try {
        const userProfile = await profile.findOne({ user: req.user.id });
        if (!userProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(userProfile);
    } catch (error) {
        console.error("Error in /me:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/",auth,async(req,res)=>{
    try{
        const profileData ={...req.body, user: req.user.id};
        const existingProfile = await profile.findOne({ user: req.user.id });
        if (existingProfile) {
            // Update existing profile
            await profile.updateOne({ user: req.user.id }, profileData);
            return res.json({ message: "Profile updated successfully" });
        } else {
            // Create new profile
            const newProfile = new profile(profileData);
            await newProfile.save();
            return res.status(201).json({ message: "Profile created successfully" });
        }
    }
    catch(error){
        console.error("Error in /api/profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

// Pull
router.put("/", auth, async (req, res) => {
    const { bio, location, website } = req.body;
    try {
        const updatedProfile = await profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: req.body },
            { new: true}
        );
        if (!updatedProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(updatedProfile);
    } catch (error) {
        console.error("Error in /api/profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// delete

router.delete("/", auth, async (req, res) => {
    try {
        const deletedProfile = await profile.findOneAndDelete({ user: req.user.id });
        if (!deletedProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error("Error in /api/profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});