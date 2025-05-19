const express = require("express");
const {
    getMonthlyRecords,

} = require("../controllers/carbon/carbonController");

const {
    getLatestMission,
    getAllMissions,
} = require("../controllers/mission/getLatest");

const router = express.Router();

router.get('/:year/:month',getMonthlyRecords);


//

router.get('/mission',getLatestMission);
router.get('/missionall',getAllMissions);


module.exports = router;



