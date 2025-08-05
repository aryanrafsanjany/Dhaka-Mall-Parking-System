const Payment = require("../models/Payment");
const User = require("../models/User");
const Booking = require("../models/Booking");

// ✅ Process payment
const processPayment = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const userId = req.user.id;

    // Get user's current payment amount
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.paymentAmount <= 0) {
      return res.status(400).json({ msg: "No payment amount due" });
    }

    // Check if user has active bookings to pay for
    const activeBookings = await Booking.find({
      userId,
      status: { $in: ["completed", "cancelled", "expired"] },
      paid: false,
    });

    if (activeBookings.length === 0) {
      return res.status(400).json({ msg: "No bookings to pay for" });
    }

    if (paymentMethod === "points") {
      // Check if user has enough points (100 points per booking)
      const requiredPoints = activeBookings.length * 100;
      if (user.points < requiredPoints) {
        return res.status(400).json({ 
          msg: `Insufficient points. You need ${requiredPoints} points but have ${user.points}` 
        });
      }

      // Deduct points and clear payment amount
      await User.findByIdAndUpdate(userId, {
        $inc: { points: -requiredPoints },
        paymentAmount: 0,
      });

      // Mark all bookings as paid
      for (let booking of activeBookings) {
        booking.paid = true;
        booking.paymentMethod = "points";
        await booking.save();

        // Create payment record
        await Payment.create({
          userId,
          bookingId: booking._id,
          paymentAmount: booking.paymentAmount + booking.fineAmount,
        });
      }

      res.json({ 
        msg: "Payment successful using points",
        pointsDeducted: requiredPoints,
        bookingsPaid: activeBookings.length,
      });

    } else if (paymentMethod === "cash") {
      // Mark all bookings as paid
      for (let booking of activeBookings) {
        booking.paid = true;
        booking.paymentMethod = "cash";
        await booking.save();

        // Create payment record
        await Payment.create({
          userId,
          bookingId: booking._id,
          paymentAmount: booking.paymentAmount + booking.fineAmount,
        });
      }

      // Clear payment amount
      await User.findByIdAndUpdate(userId, {
        paymentAmount: 0,
      });

      res.json({ 
        msg: "Payment successful using cash",
        amountPaid: user.paymentAmount,
        bookingsPaid: activeBookings.length,
      });
    } else {
      return res.status(400).json({ msg: "Invalid payment method" });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ userId })
      .populate("bookingId")
      .sort({ paymentDate: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get user payment summary
const getPaymentSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const unpaidBookings = await Booking.find({
      userId,
      status: { $in: ["completed", "cancelled", "expired"] },
      paid: false,
    });

    res.json({
      paymentAmount: user.paymentAmount,
      points: user.points,
      unpaidBookings: unpaidBookings.length,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  processPayment,
  getPaymentHistory,
  getPaymentSummary,
};
