const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { validationErrors } = require('../../middleware/validation-errors')

const authController = require('../controllers/auth-controller');
const talentController = require('../controllers/talent-controller');
const factoryController = require('../controllers/factory-controller');
const evaluationController = require('../controllers/evaluation-controller');
const paramValidation = require('../validations/admin-validations');
const AppConfigsModel = require('../models/app-config-model');
const Talent = require('../../talent/models/talent-model');
const SuggestedSkills = require('../../talent/models/suggested-skills-model');
const SuggestedCompanies = require('../../talent/models/suggested-company');
const Admins = require('../models/admin-model');
const MeetingCalender = require('../models/meeting-calender');
const ScheduleCalender = require('../models/schedule-calender');
const ProfessionalTester = require('../models/professional-tester');
const TalentManager = require('../models/talent-manager');
const scheduleCalenderController = require('../../talent/controllers/schedule-calender-controller');
const meetingCalendarController = require('../controllers/meeting-calendar');
const commonController = require('../controllers/common-controller');
const fileUpload = require('../../middleware/fileUpload');

// router.post('/testing', authController.test);

router.post(
  '/register',
  paramValidation.register,
  validationErrors,
  authController.register);

router.post(
  '/login',
  paramValidation.login,
  validationErrors,
  authController.login);

router
  .route('/app-configs')
  .get(factoryController.getAllConfigs)
  .post(auth('admin'), factoryController.create(AppConfigsModel));


router.use(auth('admin'));

router.get('/me', authController.getMe);
router.get('/', factoryController.getAll(Admins));
router.patch('/updateMyPassword', authController.updatePassword);

router
  .route('/staff')
  .get(authController.getAllStaffMember)
  .post(authController.createStaffMember);

router
  .route('/staff/:id')
  .get(factoryController.getById(Admins))
  .patch(authController.updateAdminProfile)
  .delete(factoryController.delete(Admins));

router.patch('/profile-image/:id', function (req, res, next) {
  req.type = 'image';
  next();
}, fileUpload('uploads/admin/profileImages/profileImage').single('profileImage'), authController.updateAdminProfile);


router.get('/suggested-skills', factoryController.getAll(SuggestedSkills));
router.get('/suggested-companies', factoryController.getAll(SuggestedCompanies));
router.get('/talent-suggested-companies/:id', talentController.getTalentCompanySuggestions);


router
  .route('/app-configs/:id')
  .get(factoryController.getById(AppConfigsModel))
  .patch(factoryController.update(AppConfigsModel))
  .delete(factoryController.delete(AppConfigsModel));

router.patch('/coefficient-weight', authController.updateCoefficientWeight);
router.get('/configs', factoryController.getAll(AppConfigsModel));


router
  .route('/talent-manager')
  .get(factoryController.getAll(TalentManager))
  .post(factoryController.create(TalentManager));

router
  .route('/talent-manager/:id')
  .get(factoryController.getById(TalentManager))
  .patch(factoryController.update(TalentManager))
  .delete(factoryController.delete(TalentManager));

router
  .route('/professional-interviewer')
  .get(factoryController.getAll(ProfessionalTester))
  .post(factoryController.create(ProfessionalTester));

router
  .route('/professional-interviewer/:id')
  .get(factoryController.getById(ProfessionalTester))
  .patch(factoryController.update(ProfessionalTester))
  .delete(factoryController.delete(ProfessionalTester));

router
  .route('/meeting-calender/:id')
  .patch(factoryController.update(MeetingCalender))
  .delete(factoryController.delete(MeetingCalender));

router
  .route('/schedule-calender')
  .post(scheduleCalenderController.createScheduleCalenderByType)
  .get(scheduleCalenderController.getScheduleCalenderByType);

router
  .route('/schedule-calender/:id')
  .patch(factoryController.update(ScheduleCalender))
  .delete(factoryController.delete(ScheduleCalender));

router.post('/talents', talentController.getAll);
router.get('/talent', factoryController.getAll(Talent));

// ?page=1&limit=10


router
  .route('/talent/:id')
  .get(talentController.getById)
  .delete(talentController.delete);

router
  .route('/talent/contact/:id')
  .post(talentController.contactTalent)
  .delete(talentController.removeContactInfo);

router.patch('/approve-talent-profile/:id', talentController.approveTalentProfile);
router.patch('/talent/profile-status/:id', talentController.changeTalentStatus);

router.get('/submitted-talent-profiles', talentController.getSubmittedTalentProfiles);
router.get('/talent-count', talentController.getTalentCountByStatus);

router.get('/talent-evaluation/:talentId', evaluationController.getTalentEvaluation);
router.patch('/evaluation/coding-challenge/:id', evaluationController.updateCodingChallengeStep);
router.patch('/evaluation/video-interview/:id', evaluationController.updateVideoInterviewStep);

router.delete('/remove-auto-generate', commonController.deleteAutoGeneratedRecords);

// router.get('/talent/manager-meeting/:id', meetingCalendarController.getMeetingDetailsByTalentId);
// router.get('/talent/professional-interview/:id', meetingCalendarController.getInterviewDetailsByTalentId);

module.exports = router;