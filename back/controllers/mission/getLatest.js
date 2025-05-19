// controllers/mission/getLatest.js
const Mission  = require('../../models/Mission');

const getLatestMission = async (req, res) => {
  try {
    const userId = req.user.userId;                  // JWT 인증 미들웨어
    const latest = await Mission
      .findOne({ user: userId })
      .sort({ createdAt: -1 })                       // 최신 1건
      .lean()
      .exec();

    if (!latest)
      return res.status(404).json({ message: '미션이 없습니다.' });

    res.json(latest);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: '미션 조회 실패' });
  }
};


const getAllMissions = async (req, res) => {
    try {
      const userId = req.user.userId;
      const list   = await Mission
        .find({ user: userId })
        .sort({ createdAt: -1 })   // 최신 → 오래된
        .lean()
        .exec();
  
      res.json(list);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: '미션 전체 조회 실패' });
    }
  };


module.exports = {getLatestMission,getAllMissions}