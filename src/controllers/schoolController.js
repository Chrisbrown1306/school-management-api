// src/controllers/schoolController.js
// Handles the core logic for adding and listing schools.

const db = require("../config/db");

// ─── Haversine Formula ────────────────────────────────────────────────────────
// Calculates the great-circle distance (in km) between two lat/lon points.
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometres
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ─── POST /addSchool ──────────────────────────────────────────────────────────
const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );

    return res.status(201).json({
      success: true,
      message: "School added successfully.",
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude,
      },
    });
  } catch (err) {
    console.error("addSchool error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Could not add school.",
    });
  }
};

// ─── GET /listSchools ─────────────────────────────────────────────────────────
const listSchools = async (req, res) => {
  const userLat = req.query.latitude;
  const userLon = req.query.longitude;

  try {
    const [schools] = await db.execute(
      "SELECT id, name, address, latitude, longitude FROM schools"
    );

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No schools found in the database.",
        data: [],
      });
    }

    // Attach distance and sort ascending
    const sorted = schools
      .map((school) => ({
        ...school,
        distance_km: parseFloat(
          haversineDistance(
            userLat,
            userLon,
            school.latitude,
            school.longitude
          ).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: `Found ${sorted.length} school(s), sorted by distance from (${userLat}, ${userLon}).`,
      data: sorted,
    });
  } catch (err) {
    console.error("listSchools error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Could not retrieve schools.",
    });
  }
};

module.exports = { addSchool, listSchools };
