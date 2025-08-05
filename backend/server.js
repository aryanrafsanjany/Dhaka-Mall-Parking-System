const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Create sample data function
const createSampleData = async () => {
  try {
    const Area = require("./models/Area");
    const ParkingLocation = require("./models/ParkingLocation");
    
    // Check if areas already exist
    const existingAreas = await Area.find();
    if (existingAreas.length === 0) {
      console.log("📝 Creating sample areas...");
      
      // Create sample areas
      const areas = await Area.create([
        { name: "Badda", description: "Popular shopping area in Dhaka" },
        { name: "Dhanmondi", description: "Residential and commercial area" },
        { name: "Farmgate", description: "Central business district" },
        { name: "Khilgaon", description: "Eastern part of Dhaka" }
      ]);
      
      console.log("✅ Sample areas created");
      
      // Create sample parking locations
      console.log("📝 Creating sample parking locations...");
      await ParkingLocation.create([
        {
          mallName: "Badda Shopping Complex",
          address: "Badda, Dhaka-1212",
          totalSpot: 50,
          freeSpot: 30,
          areaId: areas[0]._id
        },
        {
          mallName: "Badda Plaza",
          address: "Badda Main Road, Dhaka-1212",
          totalSpot: 40,
          freeSpot: 25,
          areaId: areas[0]._id
        },
        {
          mallName: "Dhanmondi Mall",
          address: "Dhanmondi, Dhaka-1205",
          totalSpot: 60,
          freeSpot: 35,
          areaId: areas[1]._id
        },
        {
          mallName: "Farmgate Center",
          address: "Farmgate, Dhaka-1215",
          totalSpot: 45,
          freeSpot: 20,
          areaId: areas[2]._id
        },
        {
          mallName: "Khilgaon Market",
          address: "Khilgaon, Dhaka-1219",
          totalSpot: 35,
          freeSpot: 15,
          areaId: areas[3]._id
        }
      ]);
      
      console.log("✅ Sample parking locations created");
    }
  } catch (error) {
    console.error("❌ Error creating sample data:", error);
  }
};

// Create sample data after MongoDB connection
mongoose.connection.once('open', () => {
  createSampleData();
});

// Health check
app.get("/", (req, res) => {
  console.log("GET / route hit");
  res.send("🚗 Dhaka Mall Parking API is working!");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/areas", require("./routes/area"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/cancel", require("./routes/cancel"));
app.use("/api/points", require("./routes/point"));
app.use("/api/maps", require("./routes/maps"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/feedback", require("./routes/feedback"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

