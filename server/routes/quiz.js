const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
res.status(501).json({ error: "not implemented yet" });
});

module.exports = router;