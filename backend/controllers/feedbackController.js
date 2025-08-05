const Booking = require("../models/Booking");
const User = require("../models/User");

// ✅ Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!bookingId || !rating) {
      return res.status(400).json({ msg: "Booking ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ msg: "Can only submit feedback for completed bookings" });
    }

    if (booking.rating) {
      return res.status(400).json({ msg: "Feedback already submitted for this booking" });
    }

    // Update booking with feedback
    booking.rating = rating;
    booking.comment = comment || "";
    await booking.save();

    // Award points to user for feedback (10 points)
    await User.findByIdAndUpdate(userId, {
      $inc: { points: 10 },
    });

    res.json({
      msg: "Feedback submitted successfully",
      pointsEarned: 10,
      booking,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get feedback for a booking
const getFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json({
      rating: booking.rating,
      comment: booking.comment,
      hasFeedback: !!booking.rating,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get all feedback (admin)
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Booking.find({
      rating: { $exists: true, $ne: null },
    })
      .populate("userId", "name email")
      .populate("locationId", "mallName address")
      .sort({ updatedAt: -1 });

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get feedback statistics (admin)
const getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback = await Booking.countDocuments({
      rating: { $exists: true, $ne: null },
    });

    const avgRating = await Booking.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const ratingDistribution = await Booking.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalFeedback,
      averageRating: avgRating[0]?.avgRating || 0,
      ratingDistribution,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedback,
  getAllFeedback,
  getFeedbackStats,
};
