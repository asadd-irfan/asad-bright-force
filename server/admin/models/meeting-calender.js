const mongoose = require("mongoose");

const MeetingCalenderSchema = new mongoose.Schema(
  {
    talentManagerId: {
      type: mongoose.Schema.ObjectId,
      ref: "talent-manager",
      // autopopulate: {
      //   select: 'name email'
      // }
    },
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "company",
    },
    startTime: Date,
    endTime: Date,
    talentId: {
      type: mongoose.Schema.ObjectId,
      ref: "talent",
      required: [true, "Talent ID is required."],
      autopopulate: {
        select: "name",
      },
    },
    meetingType: {
      type: String,
      enum: ["video-interview", "company-interview"],
    },
    title: String,
    meetingLink: String,

    duration: String,
    format: String,
    meetingDetails: String,
    notes: String,
    // status: {
    //   type: String,
    //   enum: ['pending','scheduled', 'pass', 'fail']
    // },
    positionId: {
      type: mongoose.Schema.ObjectId,
      ref: "positions",
      autopopulate: {
        select: "title",
        // "title -assignedAccountManager -employmentType -name -positionCreatedBy -role",
      },
    },
    recruitmentId: {
      type: mongoose.Schema.ObjectId,
      ref: "position-candidate",
    },
  },
  {
    timestamps: true,
  }
);

MeetingCalenderSchema.plugin(require("mongoose-autopopulate"));

module.exports = MeetingCalender = mongoose.model(
  "meeting-calender",
  MeetingCalenderSchema
);
