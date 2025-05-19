const express = require("express");
const {
   completeStage
} = require("../controllers/mission/missionController");

const router = express.Router();

router.post("/complete", completeStage);



module.exports = router;