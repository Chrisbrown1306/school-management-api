// src/middleware/validate.js
// Reusable validators for the school APIs.

/**
 * Validates the POST /addSchool request body.
 * Checks all fields are present and of the correct type/range.
 */
const validateAddSchool = (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;
  const errors = [];

  // --- name ---
  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("'name' is required and must be a non-empty string.");
  } else if (name.trim().length > 255) {
    errors.push("'name' must be 255 characters or fewer.");
  }

  // --- address ---
  if (!address || typeof address !== "string" || address.trim() === "") {
    errors.push("'address' is required and must be a non-empty string.");
  } else if (address.trim().length > 255) {
    errors.push("'address' must be 255 characters or fewer.");
  }

  // --- latitude ---
  const lat = parseFloat(latitude);
  if (latitude === undefined || latitude === null || latitude === "") {
    errors.push("'latitude' is required.");
  } else if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push("'latitude' must be a number between -90 and 90.");
  }

  // --- longitude ---
  const lon = parseFloat(longitude);
  if (longitude === undefined || longitude === null || longitude === "") {
    errors.push("'longitude' is required.");
  } else if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push("'longitude' must be a number between -180 and 180.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Normalise values on the request body before passing to controller
  req.body.name = name.trim();
  req.body.address = address.trim();
  req.body.latitude = lat;
  req.body.longitude = lon;

  next();
};

/**
 * Validates the GET /listSchools query parameters.
 */
const validateListSchools = (req, res, next) => {
  const { latitude, longitude } = req.query;
  const errors = [];

  const lat = parseFloat(latitude);
  if (latitude === undefined || latitude === "") {
    errors.push("Query param 'latitude' is required.");
  } else if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push("'latitude' must be a number between -90 and 90.");
  }

  const lon = parseFloat(longitude);
  if (longitude === undefined || longitude === "") {
    errors.push("Query param 'longitude' is required.");
  } else if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push("'longitude' must be a number between -180 and 180.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  req.query.latitude = lat;
  req.query.longitude = lon;

  next();
};

module.exports = { validateAddSchool, validateListSchools };
