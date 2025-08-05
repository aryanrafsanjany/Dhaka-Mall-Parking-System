const Booking = require("../models/Booking");
const User = require("../models/User");
const ParkingLocation = require("../models/ParkingLocation");
const Payment = require("../models/Payment");

// ✅ Create new booking
const createBooking = async (req, res) => {
  try {
    const { locationId } = req.body;
    const userId = req.user.id;

    // Check if location exists and has available spots
    const location = await ParkingLocation.findById(locationId);
    if (!location) {
      return res.status(404).json({ msg: "Parking location not found" });
    }

    if (location.freeSpot <= 0) {
      return res.status(400).json({ msg: "No available parking spots" });
    }

    // Check if user has active booking
    const activeBooking = await Booking.findOne({
      userId,
      status: "active",
    });

    if (activeBooking) {
      return res.status(400).json({ msg: "You already have an active booking" });
    }

    // Create booking
    const booking = new Booking({
      userId,
      locationId,
      bookingTime: new Date(),
    });

    await booking.save();

    // Update parking location free spots
    location.freeSpot -= 1;
    await location.save();

    // Populate location details
    await booking.populate("locationId");

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId })
      .populate("locationId")
      .sort({ createdAt: -1 });

    // Check for expired bookings (auto-cancel after 1 hour)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    for (let booking of bookings) {
      if (
        booking.status === "active" &&
        booking.bookingTime < oneHourAgo
      ) {
        // Auto-cancel expired booking
        booking.status = "expired";
        booking.fineAmount = 10;
        await booking.save();

        // Add fine to user's payment amount
        await User.findByIdAndUpdate(userId, {
          $inc: { paymentAmount: 10 },
        });

        // Increase free spots
        await ParkingLocation.findByIdAndUpdate(booking.locationId, {
          $inc: { freeSpot: 1 },
        });
      }
    }

    // Get updated bookings after auto-cancellation
    const updatedBookings = await Booking.find({ userId })
      .populate("locationId")
      .sort({ createdAt: -1 });

    res.json(updatedBookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId).populate("locationId");
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (booking.status !== "active") {
      return res.status(400).json({ msg: "Booking cannot be cancelled" });
    }

    // Update booking status
    booking.status = "cancelled";
    booking.fineAmount = 10;
    await booking.save();

    // Add fine to user's payment amount
    await User.findByIdAndUpdate(userId, {
      $inc: { paymentAmount: 10 },
    });

    // Increase free spots
    await ParkingLocation.findByIdAndUpdate(booking.locationId._id, {
      $inc: { freeSpot: 1 },
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Complete booking
const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId).populate("locationId");
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (booking.status !== "active") {
      return res.status(400).json({ msg: "Booking cannot be completed" });
    }

    // Update booking status
    booking.status = "completed";
    booking.paymentAmount = 50;
    await booking.save();

    // Add payment amount to user's payment
    await User.findByIdAndUpdate(userId, {
      $inc: { paymentAmount: 50 },
    });

    // Increase free spots
    await ParkingLocation.findByIdAndUpdate(booking.locationId._id, {
      $inc: { freeSpot: 1 },
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Admin cancel booking (no fine)
const adminCancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("locationId");
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.status !== "active") {
      return res.status(400).json({ msg: "Booking cannot be cancelled" });
    }

    // Update booking status (no fine for admin cancellation)
    booking.status = "cancelled";
    await booking.save();

    // Increase free spots
    await ParkingLocation.findByIdAndUpdate(booking.locationId._id, {
      $inc: { freeSpot: 1 },
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("locationId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  completeBooking,
  adminCancelBooking,
  getAllBookings,
};
