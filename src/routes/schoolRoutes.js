// src/routes/schoolRoutes.js

const express = require("express");
const router = express.Router();
const { addSchool, listSchools } = require("../controllers/schoolController");
const { validateAddSchool, validateListSchools } = require("../middleware/validate");

// POST /addSchool
router.post("/addSchool", validateAddSchool, addSchool);

// GET /listSchools?latitude=xx&longitude=yy
router.get("/listSchools", validateListSchools, listSchools);

module.exports = router;
