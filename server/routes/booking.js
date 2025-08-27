const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const auth = require("../middleware/auth");

// create a new booking

router.post("/", auth, async (req, res) => {
    try {
        const { listingId, checkIn, checkOut } = req.body;
        const booking = new Booking({
            userId: req.user.id,
            listingId,
            checkIn,
            checkOut
        });
        await booking.save();    // save the booking
        res.status(201).json(booking);
    } catch (error) {
        console.error("Error while creating booking:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/my-bookings", auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate("listingId");
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error int fetching bookings:", error);
        res.status(500).json({ error: "Internal pointer variable error" });
    }
});


//getthe single booking by thier id
router.get("/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("listingId");
        if (!booking || booking.userId.toString() !== req.user.id) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error while fetching booking:", error);
        res.status(500).json({ error: "Internal pointer variable error" });
    }
});

//update the bookings

router.put("/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking || booking.userId.toString() !== req.user.id) {
            return res.status(404).json({ error: "Booking not found in our database" });
        }
        const { checkIn, checkOut } = req.body;
        booking.checkIn = checkIn || booking.checkIn;
        booking.checkOut = checkOut || booking.checkOut;
        await booking.save();
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error while updating booking:", error);
        res.status(500).json({ error: "Internal pointer variable error" });
    }
});

// delete a booking
router.delete("/:id", auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking || booking.userId.toString() !== req.user.id) {
            return res.status(404).json({ error: "Booking not found in our database" });
        }
        await booking.remove();
        res.status(204).send();
    } catch (error) {
        console.error("Error while deleting booking:", error);
        res.status(500).json({ error: "Internal pointer variable error" });
    }
});

module.exports = router;