const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/db-check", async (req, res, next) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            status: "ok",
            database_time: result.rows[0].now,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;