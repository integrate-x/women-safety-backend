const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

let latestAlert = {
  active: false,
  latitude: null,
  longitude: null,
  timestamp: null
};

function authenticate(req, res, next) {
  if (!API_KEY || req.get("x-api-key") !== API_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, service: "women-safety-backend" });
});

app.post("/api/sos", authenticate, (req, res) => {
  const { latitude, longitude } = req.body || {};

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 || latitude > 90 ||
    longitude < -180 || longitude > 180
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid numeric latitude and longitude are required"
    });
  }

  latestAlert = {
    active: true,
    latitude,
    longitude,
    timestamp: new Date().toISOString()
  };

  console.log("SOS ALERT RECEIVED", latestAlert);
  return res.status(201).json({
    success: true,
    message: "Emergency alert received",
    alert: latestAlert
  });
});

app.get("/api/alert", (req, res) => {
  res.json(latestAlert);
});

app.post("/api/reset", authenticate, (req, res) => {
  latestAlert = {
    active: false,
    latitude: null,
    longitude: null,
    timestamp: null
  };
  res.json({ success: true, message: "Alert reset" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
