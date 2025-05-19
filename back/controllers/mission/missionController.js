const Mission       = require('../../models/Mission');
const CarbonRecord  = require('../../models/CarbonRecord');
const User          = require('../../models/User');

/** POST /api/mission/complete
 *  body: { missionId, stageIndex, difficulty, imageUrl }
 */
exports.completeStage = async (req, res) => {
  try {
    const { missionId, stageIndex, difficulty, imageUrl } = req.body;
    const userId = req.user.userId;

    /* ① 미션·스테이지 찾기 */
    const mission = await Mission.findOne({ _id: missionId, user: userId });
    if (!mission) return res.status(404).json({ message: 'Mission not found' });
    const stage = mission.stages[stageIndex];
    if (!stage) return res.status(400).json({ message: 'Invalid stage index' });
    if (stage.completed) return res.status(400).json({ message: 'Already completed' });

    /* ② 미션 완료 처리 */
    stage.completed   = true;
    stage.difficulty  = difficulty;
    stage.proofImageUrl = imageUrl;

    /* ③ 탄소 절감량 계산 (난이도 보너스) */
    const diffRatio = difficulty === 'hard' ? 1.1 : difficulty === 'easy' ? 0.9 : 1;
    const reduction = Math.round(stage.expected_reduction_g * diffRatio);

    /* ④ CarbonRecord 생성 */
    const record = await CarbonRecord.create({
      user   : userId,
      date   : new Date(),
      amount : reduction,          // +gCO₂
      desc   : stage.title,
      category : 'mission',
    });

    /* ⑤ 유저 캐시·곰곰온도 갱신 */
    const monthKey = new Date().toISOString().slice(0, 7);
    const tempDelta = reduction / 500;          // 1000g ↓당 1° ↓
    await User.updateOne(
      { _id: userId },
      {
        $inc: {
          carbonSaved_g              : reduction,
          'monthlyCarbonStat.totalPlus' : reduction,
          bearTemp                   : -tempDelta,
        },
        $set: { 'monthlyCarbonStat.month': monthKey },
      },
      { upsert: true },
    );

    /* ⑥ 미션 저장 */
    await mission.save();

    res.status(200).json({ mission, record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
