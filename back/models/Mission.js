const mongoose = require('mongoose');

const StageSchema = new mongoose.Schema(
  {
    title                : String,
    desc                 : String,
    expected_reduction_g : Number,   // 성공 시 ↓
    difficulty           : { type: String, enum: ['easy', 'normal', 'hard'], default: 'normal' },
    completed            : { type: Boolean, default: false },
    proofImageUrl        : String,   // 인증 사진
  },
  { _id: false },
);

const MissionSchema = new mongoose.Schema(
  {
    user      : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt : { type: Date, default: Date.now },
    stages    : [StageSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Mission', MissionSchema);
