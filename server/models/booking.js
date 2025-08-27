const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    checkIn : Date,
    checkOut: Date
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;