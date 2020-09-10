const express = require('express');
const router = express.Router();

const authentication = require('../../middleware/auth');
const authorization = require('../middleware/authorization');

const authController = require('./../controllers/auth-controller');
const companyController = require('./../controllers/company-controller');
const positionController = require('./../controllers/position-controller');
const recruitmentController = require('../../admin/controllers/recruitment-controllers');
const factoryController = require('../../admin/controllers/factory-controller');
const notificationsController = require('../../admin/controllers/notification-controller');
const CompanyRequest = require('../models/company-request');
const AppConfig = require('../../admin/models/app-config-model');
const Talent = require('../../talent/models/talent-model');
const PositionOffer = require('../../company/models/position-offer');
const PositionCandidate = require('../../admin/models/position-candidates');
const MeetingCalendar = require('../../admin/models/meeting-calender');
const fileUpload = require('../../middleware/fileUpload');
const evaluationController = require('../../admin/controllers/evaluation-controller');


router.post('/login', authController.login);
router.post('/request', authController.companyRequest);
router.post('/signup-first-user/:id', authController.createFirstUser);
router.post('/signup-other-user', authController.createOtherUser);

router.get('/request/:id', factoryController.getById(CompanyRequest));

router.use(authentication('company'));

router.get('/user/me', authController.getMe);
router.patch('/update-user', companyController.updateUserDetails);
router.patch('/change-user-password', authController.updatePassword);
router.patch('/user/upload-profileImage', function (req, res, next) {
  req.type = 'image';
  next();
},
  fileUpload('uploads/company/user/profileImages/profileImage').single('profileImage'), companyController.updateUserDetails);


router.patch('/details/:id', authorization.checkRole('admin'), companyController.updateCompanyDetails);

router.patch('/upload-logo/:id', authorization.checkRole('admin'), function (req, res, next) {
  req.type = 'image';
  next();
}, fileUpload('uploads/company/logos/logo').single('logo'), companyController.updateCompanyDetails);

router.patch('/upload-bannerImage/:id', authorization.checkRole('admin'), function (req, res, next) {
  req.type = 'image';
  next();
}, fileUpload('uploads/company/bannerImages/bannerImage').single('bannerImage'), companyController.updateCompanyDetails);

router.get('/users', companyController.allCompanyUsers);
router.post('/invite-user', authorization.checkRole('admin'), companyController.inviteUser);
router.delete('/remove-user/:id', companyController.removeUser);

router.patch('/edit-authorizations/:id', authorization.checkRole('admin'), companyController.editAuthorizations);
router.patch('/appoint-admin/:id', authorization.checkRole('admin'), companyController.appointAsAdmin);

router.get('/details', companyController.companyDetails);
router.patch('/billing-details', authorization.checkRole('admin'), companyController.companyBillingDetails);
router.patch('/change-billing-user/:id', authorization.checkRole('admin'), companyController.changeBillingUser);

router
  .route('/position')
  .post(authorization.checkRights('hire'), positionController.createPosition)
  .get(positionController.getAllCompanyPositions);

router.get('/active-positions', positionController.getActiveCompanyPositionsOfUser);
router.get('/all-positions', positionController.getAllCompanyPositionsOfUser);

router
  .route('/position/:id')
  .get(positionController.getCompanyPositionDetails)
  .patch(authorization.checkRights('hire'), positionController.updatePositionDetails);

router.patch('/restore-position/:id', authorization.checkRights('hire'), positionController.restoreCompanyPosition);

router.delete('/position/remove-shortlist/:id', authorization.checkRights('hire'), recruitmentController.removeShortListCandidate);
router.post('/position/offer/:id', authorization.checkRights('hire'), recruitmentController.approachCandidateWithOffer);
router.post('/position/resend-offer/:id', authorization.checkRights('hire'), recruitmentController.resendOfferToCandidate);

router.patch('/position/schedule-interview/:id', authorization.checkRights('hire'), recruitmentController.scheduleInterviewWithTalent);
router.patch('/position/reschedule-interview/:id', authorization.checkRights('hire'), recruitmentController.rescheduleInterviewWithTalent);
router.patch('/position/interview-result/:id', authorization.checkRights('hire'), recruitmentController.changeInterviewStatus);

router.post('/position-recruitment/:id', authorization.checkRights('hire'), recruitmentController.getPositionCandidateDetails);

router.get('/talent/:id', factoryController.getById(Talent));
router.get('/talent-evaluation/:id', companyController.getTalentEvaluationDetails);
router.get('/offer/:id', authorization.checkRights('hire'), factoryController.getById(PositionOffer));
router.get('/position-candidate/:id', authorization.checkRights('hire'), factoryController.getById(PositionCandidate));
router.get('/position-interview/:id', authorization.checkRights('hire'), factoryController.getById(MeetingCalendar));

router.get('/calendar', authorization.checkRights('hire'), companyController.getCompanyInterviews);
router.get('/talent-calendar/:id', authorization.checkRights('hire'), positionController.getTalentScheduleCalender);
router.get('/talent-offers/:id', authorization.checkRights('hire'), positionController.getTalentOffersList);
router.get('/notifications', notificationsController.getAllNotifications);
router.get('/position-notifications/:id', notificationsController.getPositionNotifications);
router.patch('/read-notification/:id', notificationsController.markAsReadNotification);
router.get('/timezone-name/:id', factoryController.getById(AppConfig));

router.get('/talent-evaluation/:talentId', evaluationController.getTalentEvaluation);

module.exports = router;