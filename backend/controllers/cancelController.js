const Booking = require("../models/Booking");
const ParkingLocation = require("../models/ParkingLocation");

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    if (booking.status !== "active") {
      return res.status(400).json({ msg: "Booking is already cancelled or completed" });
    }

    booking.status = "cancelled";
    await booking.save();

    const location = await ParkingLocation.findById(booking.locationId);
    if (location) {
      location.freeSpot += 1;
      await location.save();
    }

    const fine = 10;
    res.status(200).json({
      msg: "Booking cancelled successfully.",
      fine: `${fine} Taka cancellation charge applied.`,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { cancelBooking };
