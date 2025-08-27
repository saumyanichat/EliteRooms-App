const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const auth = require("../middleware/auth");

//  get listing 
router.get("/", async (req, res) => {
    try {
        const { location, minPrice, maxPrice } = req.query;
        const filter = {};
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }
        if (minPrice || maxPrice) filter.price = {};
        if (minPrice) {
            filter.price = { ...filter.price, $gte: minPrice };
        }
        if (maxPrice) {
            filter.price = { ...filter.price, $lte: maxPrice };
        }

         
        const listings = await Listing.find(filter);
        res.json(listings); 
    } catch (error) {
        console.error("Error in /api/listing:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// get listing by id

router.get("/:id", async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(listing);
    } catch (error) {
        console.error("Error in /api/listing/:id:", error);
        res.status(500).json({ error: "Server error" });
    }
});

//post listing
router.post("/", auth, async (req, res) => {
    try {
       if(!req.user.isHost) {
           return res.status(403).json({ error: "Only host can add listings" });
       }
       const newListing = new Listing({ ...req.body, host: req.user.id });
       await newListing.save();
       res.status(201).json(newListing);
    } catch (error) {
        console.error("Error in /api/listing:", error);
        res.status(500).json({ error: "Server error" });
    }
});


router.put("/:id", auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        if (listing.hostId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const updated = await Listing.findByIdAndUpdate(
            req.params.id, req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        console.error("Error in /api/listing/:id:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// delete listing

router.delete("/:id", auth, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        if (listing.hostId.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        await listing.deleteOne();
        res.json({ message: "Listing deleted" });
    } catch (error) {
        console.error("Error in /api/listing/:id:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/my-listing", auth, async (req, res) => {
    try {
        if(!req.user.isHost) {
            return res.status(403).json({ error: "Only host can view their listings" });
        }
        const listings = await Listing.find({ hostId: req.user.id });
        res.json(listings);
    } catch (error) {
        console.error("Error in /api/listing/my-listing:", error);
        res.status(500).json({ error: "Error in fetching the listings" });
    }
});

module.exports = router;

