# School Management API 🎓

A REST API built with **Node.js**, **Express.js**, and **MySQL** that lets you add schools and retrieve them sorted by proximity.

---

## Project Structure

```
school-management/
├── src/
│   ├── index.js                   ← Entry point (starts Express server)
│   ├── config/
│   │   └── db.js                  ← MySQL connection pool
│   ├── routes/
│   │   └── schoolRoutes.js        ← Route definitions
│   ├── controllers/
│   │   └── schoolController.js    ← Business logic + Haversine distance
│   └── middleware/
│       └── validate.js            ← Input validation
├── sql/
│   └── setup.sql                  ← Creates DB, table, and seeds sample data
├── SchoolManagement.postman_collection.json
├── .env.example
└── package.json
```

---

## ⚡ Quick Start (Step-by-Step)

### 1 — Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| MySQL | 8+ | `mysql --version` |

### 2 — Install dependencies

```bash
cd school-management
npm install
```

### 3 — Set up the database

Open your MySQL client and run the setup script:

```bash
mysql -u root -p < sql/setup.sql
```

This creates the `school_management` database, the `schools` table, and seeds 5 sample schools.

### 4 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=school_management
```

### 5 — Start the server

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

You should see:
```
✅  MySQL connected successfully
🚀  Server running at http://localhost:3000
```

---

## API Reference

### `POST /addSchool`

Adds a new school to the database.

**Request body (JSON):**

```json
{
  "name": "Sunrise International School",
  "address": "42 MG Road, Pune, Maharashtra 411001",
  "latitude": 18.5204,
  "longitude": 73.8567
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| name | string | Non-empty, max 255 chars |
| address | string | Non-empty, max 255 chars |
| latitude | number | –90 to 90 |
| longitude | number | –180 to 180 |

**Success response (201):**

```json
{
  "success": true,
  "message": "School added successfully.",
  "data": {
    "id": 6,
    "name": "Sunrise International School",
    "address": "42 MG Road, Pune, Maharashtra 411001",
    "latitude": 18.5204,
    "longitude": 73.8567
  }
}
```

**Validation error (400):**

```json
{
  "success": false,
  "errors": ["'name' is required and must be a non-empty string."]
}
```

---

### `GET /listSchools?latitude=<lat>&longitude=<lon>`

Returns all schools sorted from closest → farthest from the given coordinates.

**Example request:**

```
GET /listSchools?latitude=18.5204&longitude=73.8567
```

**Success response (200):**

```json
{
  "success": true,
  "message": "Found 6 school(s), sorted by distance from (18.5204, 73.8567).",
  "data": [
    {
      "id": 6,
      "name": "Sunrise International School",
      "address": "42 MG Road, Pune, Maharashtra 411001",
      "latitude": 18.5204,
      "longitude": 73.8567,
      "distance_km": 0
    },
    {
      "id": 4,
      "name": "The Cathedral School",
      "address": "CST Road, Kalina, Mumbai, Maharashtra 400098",
      "latitude": 19.0728,
      "longitude": 72.8826,
      "distance_km": 148.67
    }
  ]
}
```

---

## How Distance is Calculated

The API uses the **Haversine formula** — the standard way to calculate straight-line distance between two GPS coordinates on a sphere (Earth). It accounts for Earth's curvature and returns the result in kilometres.

---

## Postman Guide (for first-time users)

1. **Download Postman** from [postman.com/downloads](https://www.postman.com/downloads/) and install it.
2. Open Postman → click **Import** (top-left button).
3. Drag & drop `SchoolManagement.postman_collection.json` into the import dialog.
4. The collection appears in the left sidebar under **Collections**.
5. Click the collection name → **Edit** → **Variables** tab → set `baseUrl` to `http://localhost:3000`.
6. Click any request → hit the blue **Send** button.
7. The response appears in the bottom panel with status code, time, and body.

**Tip:** Run requests in this order:
1. Health Check → confirm server is up
2. Add School (Success) × a few times → populate data
3. List Schools → see them sorted by distance

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `MySQL connection failed` | Check `.env` credentials; ensure MySQL service is running |
| `Access denied for user` | Run `GRANT ALL ON school_management.* TO 'youruser'@'localhost';` in MySQL |
| `Cannot find module` | Run `npm install` again |
| Port already in use | Change `PORT` in `.env` |
