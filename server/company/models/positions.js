const mongoose = require("mongoose");

const PositionsSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.ObjectId,
      ref: "app-configurations",
      required: [true, "name is required."],
      autopopulate: {
        select: "name",
      },
    },
    hiringTeam: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "company-user",
      },
    ],
    title: { type: String },
    positionId: { type: Number, unique: true },
    positionCreatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "company-user",
      autopopulate: {
        select: "fullName email title profileImage",
      },
    },

    role: {
      name: {
        type: mongoose.Schema.ObjectId,
        ref: "app-configurations",
        autopopulate: {
          select: "name",
        },
      },
      yearsOfExperience: { type: String },
    },
    skills: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "app-configurations",
      },
    ],
    managementExperience: {
      status: { type: Boolean, default: false },
      yearsOfExperience: { type: String },
    },
    employmentType: {
      type: mongoose.Schema.ObjectId,
      ref: "app-configurations",
      autopopulate: {
        select: "name",
      },
    },
    mainResponsibilities: { type: String },
    positionFeatures: [
      {
        feature: {
          type: mongoose.Schema.ObjectId,
          ref: "app-configurations",
        },
        priorityOrder: { type: Number },
      },
    ],
    positionOffer: {
      salary: Number,
      currency: {
        type: mongoose.Schema.ObjectId,
        ref: "app-configurations",
      },
      equity: {
        type: mongoose.Schema.ObjectId,
        ref: "app-configurations",
      },
      performanceBonus: Number,
      signingBonus: {
        type: mongoose.Schema.ObjectId,
        ref: "app-configurations",
      },
    },
    assignedAccountManager: {
      type: mongoose.Schema.ObjectId,
      ref: "admin",
      autopopulate: {
        select: "name email phone",
      },
    },
    workingTimeFlexibility: {
      type: String,
      enum: ["very-flexible", "somewhat-flexible", "flexible", "not-flexible"],
    },
    // workingHours: {
    //   startingHour: {
    //     type: Number,
    //     default: 9
    //   },
    //   endingHour: {
    //     type: Number,
    //     default: 18
    //   }
    // },
    timezone: {
      type: mongoose.Schema.ObjectId,
      ref: "app-configurations",
    },
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "company",
      autopopulate: {
        select: "name about logo website linkedIn location -accountManager ",
      },
    },
    status: {
      type: String,
      enum: ["Open", "Closed - Hired", "Closed - Other"],
      default: "Open",
    },
    lastGroupStatus: {
      type: String,
      // enum: ['un-processed', 'processed', 'action-required', 'fulfilled'],
      default: "un-processed",
    },
    sentToAccountManager: { type: Boolean, default: false },
    // sentToAccountManagerDate: { type: Date },
    closingReason: {
      closedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "admin",
        autopopulate: {
          select: "name email phone",
        },
      },
      reason: String,
    },
    groupConfigs: {
      candidatesPerGroup: { type: Number, default: 10 },
      matchingScore: { type: Number, default: 70 },
      totalGroups: { type: Number, default: 3 },
    },
    groupsInfo: [
      {
        groupName: String,
        dispatchDate: Date,
        totalDispatchCandidates: Number,
      },
    ],
    totalDispatchedGroups: { type: Number, default: 0 },
    lastProcessedDate: Date,
    nextDispatchedDate: Date,
    isAutoGenerate: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

PositionsSchema.plugin(require("mongoose-autopopulate"));

module.exports = Positions = mongoose.model("positions", PositionsSchema);
