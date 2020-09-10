const mongoose = require("mongoose");

const SuggestedCompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, unique: true },
    companyURL: { type: String, unique: true },
    talentId: {
      type: mongoose.Schema.ObjectId,
      ref: "talent",
      required: [true, "User Id is required"],
    },
    talentName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = SuggestedCompany = mongoose.model(
  "suggested-company",
  SuggestedCompanySchema
);
