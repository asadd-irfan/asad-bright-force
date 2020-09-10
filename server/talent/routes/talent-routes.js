const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const { validationErrors } = require("./../../middleware/validation-errors");

const talentController = require("../controllers/talent-controller");
const evaluationController = require("../controllers/evaluation-controller");
const authController = require("../controllers/auth-controller");
const paramValidation = require("./../validations/talent-validations");
const fileUpload = require("../../middleware/fileUpload");
const SuggestedSkillsModel = require("../models/suggested-skills-model");
const SuggestedCompanyModel = require("../models/suggested-company");
const PositionOffer = require("../../company/models/position-offer");
const Positions = require("../../company/models/positions");
const factoryController = require("../../admin/controllers/factory-controller");
const meetingCalenderController = require("../controllers/meeting-calender-controller");
const scheduleCalenderController = require("../controllers/schedule-calender-controller");
const ScheduleCalenderModel = require("../../admin/models/schedule-calender");
const recruitmentController = require("../controllers/recruitment-controllers");
const MeetingCalendar = require("../../admin/models/meeting-calender");
const AppConfig = require("../../admin/models/app-config-model");

router.post(
  "/register",
  // paramValidation.register,
  // validationErrors,
  authController.register
);

router.post(
  "/login",
  // paramValidation.login,
  // validationErrors,
  authController.login
);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);


router.use(auth("talent"));

router.get("/me", authController.getMe);

router.post("/suggest-skill", factoryController.create(SuggestedSkillsModel));
router.post(
  "/suggest-company",
  factoryController.create(SuggestedCompanyModel)
);

router.patch("/updateMyPassword", authController.updatePassword);

router.route("/profile/:id").patch(talentController.updateProfile);

router.route("/preferred-roles").patch(talentController.preferredRoles);

router.route("/languages").patch(talentController.languages);

router.patch(
  "/engagement-preferences",
  // paramValidation.engagementPreferences,
  // validationErrors,
  talentController.updateEngagementPreferences
);

router.patch(
  "/company-preferences",
  paramValidation.companyPreferences,
  validationErrors,
  talentController.updateCompanyPreferences
);

router.patch("/workplace-features", talentController.updateWorkplaceFeatures);
router.patch("/timezone", talentController.updateTimezoneAndCurrency);
router.patch("/availability-status", talentController.updateAvailabilityStatus);

router
  .route("/work-experience")
  .get(talentController.getWorkExperience)
  .post(talentController.addWorkExperience);

router
  .route("/work-experience/:id")
  .patch(talentController.editWorkExperience)
  .delete(talentController.deleteWorkExperience);

router
  .route("/education")
  .get(talentController.getTalentEducation)
  .post(talentController.addTalentEducation);

router
  .route("/education/:id")
  .patch(talentController.editTalentEducation)
  .delete(talentController.deleteTalentEducation);

router.patch(
  "/upload-profileImage/:id",
  function (req, res, next) {
    req.type = "image";
    next();
  },
  fileUpload("uploads/talent/profileImages/profileImage").single(
    "profileImage"
  ),
  talentController.updateProfile
);

router.patch(
  "/upload-cv",
  function (req, res, next) {
    req.type = "pdf";
    next();
  },
  fileUpload("uploads/talent/resumes/cv").single("resume"),
  talentController.uploadCV
);

router.delete("/remove-cv", talentController.removeCV);
router.post("/submit-profile", talentController.submitProfile);
router.post("/profile-completed", talentController.talentProfileCompleted);

router.get("/evaluation", evaluationController.getTalentEvaluation);

router.patch(
  "/schedule-TM-meeting",
  meetingCalenderController.scheduleTmMeeting
);
router.patch(
  "/schedule-professional-interview",
  meetingCalenderController.scheduleProfessionalInterview
);
router.get("/calender", meetingCalenderController.getCalendersData);

router
  .route("/schedule-calender")
  .get(scheduleCalenderController.getTalentScheduleCalender)
  .post(scheduleCalenderController.createTalentScheduleCalender);

router
  .route("/schedule-calender/:id")
  .patch(scheduleCalenderController.editTalentScheduleCalender)
  .delete(scheduleCalenderController.deleteTalentScheduleCalender);

router.post("/job-offer/:id", recruitmentController.acceptRejectCompanyOffer);

router.get("/company-offers", recruitmentController.getCompanyOfferList);

router.get("/position/:id", factoryController.getById(Positions));
router.get("/offer/:id", factoryController.getById(PositionOffer));
router.get("/recruitment/:id", recruitmentController.getRecruitmentStatus);
router.get("/interview/:id", factoryController.getById(MeetingCalendar));

router.post("/block-company", talentController.blockedACompany);
router.delete("/block-company/:id", talentController.removeBlockedCompany);
router.get("/companies", talentController.getAllCompanies);
router.patch("/merge-events", scheduleCalenderController.mergeTalentEvents);
router.get("/timezone-name/:id", factoryController.getById(AppConfig));

module.exports = router;
