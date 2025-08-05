const User = require("../models/User");
const Booking = require("../models/Booking");

// Mark booking complete and add points
const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking || booking.status !== "active") {
      return res.status(400).json({ msg: "Invalid or already completed booking" });
    }

    booking.status = "completed";
    await booking.save();

    const user = await User.findById(userId);
    user.point += 10;
    await user.save();

    res.status(200).json({ msg: "Booking completed. 10 points awarded!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Redeem 100 points to earn 1 free booking credit
const redeemPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.point < 100) {
      return res.status(400).json({ msg: "Not enough points to redeem" });
    }

    user.point -= 100;
    await user.save();

    res.status(200).json({ msg: "You can now book 1 parking slot for free!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { completeBooking, redeemPoints };
