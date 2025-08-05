const Booking = require("../models/Booking");
const ParkingLocation = require("../models/ParkingLocation");

const checkAutoCancel = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const bookings = await Booking.find({ userId, status: "active" });
    let cancelledCount = 0;

    for (let booking of bookings) {
      const bookingTime = new Date(booking.bookingTime);
      const diffInHours = (now - bookingTime) / (1000 * 60 * 60);

      if (diffInHours >= 1) {
        booking.status = "cancelled";
        await booking.save();

        const location = await ParkingLocation.findById(booking.locationId);
        if (location) {
          location.freeSpot += 1;
          await location.save();
        }

        cancelledCount++;
      }
    }

    req.autoCancelled = cancelledCount;
    next();
  } catch (err) {
    return res.status(500).json({ msg: "Auto cancel error", error: err.message });
  }
};

module.exports = { checkAutoCancel };
