const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
// const { validationErrors } = require('../../middleware/validation-errors')
// const paramValidation = require('../validations/admin-validations');

const companyController = require('../controllers/company-controller.js');
const recruitmentController = require('../controllers/recruitment-controllers');
const companyRequestController = require('../controllers/company-request-controller');
const factoryController = require('../controllers/factory-controller');
const fileUpload = require('../../middleware/fileUpload');

const CompanyRequest = require('../../company/models/company-request');
const Positions = require('../../company/models/positions');
const Company = require('../../company/models/company');
// const testScript = require('../../talent-filtration/talent-filtration-script');

router.use(auth('admin'));

router.post('/new-company', companyController.createCompany);
router.get('/companies', companyController.getAllCompanies);
router.post('/company', companyController.createNewCompany);
router.get('/company/:id', companyController.getCompanyById);
router.patch('/company/:id', companyController.updateCompanyDetails);
router.patch('/company-logo/:id', function (req, res, next) {
  req.type = 'image';
  next();
}, fileUpload('uploads/company/logos/logo').single('logo'), companyController.updateCompanyDetails);
router.patch('/company-banner/:id', function (req, res, next) {
  req.type = 'image';
  next();
}, fileUpload('uploads/company/bannerImages/bannerImage').single('bannerImage'), companyController.updateCompanyDetails);

router.get('/company-count', companyController.getCompanyAndRequestsCount);
router.get('/company-users/:id', companyController.getAllCompanyUsers);
router.post('/company/invite-user/:id', companyController.inviteUser);
router.delete('/company/remove-user/:userId', companyController.removeUser);
router.patch('/company/edit-authorizations/:id', companyController.editAuthorizations);
router.patch('/company/appoint-admin/:id', companyController.appointAsAdmin);
router.patch('/company/billing/:id', companyController.updateBillingDetails);
router.patch('/company/internal-records/:id', companyController.companyInternalRecords);
router.patch('/company/assign-account-manager/:id', companyController.assignAccountManager);

router.post('/assign-company/:id', companyRequestController.assignToCompany);
router.post('/send-email/:id', companyRequestController.sendEmailToUser);
router.patch('/deny-request/:id', companyRequestController.denyRequest);
router.patch('/assign-account-manager/:id', companyRequestController.assignAccountManagerToRequest);
router.patch('/change-request-email/:id', companyRequestController.changeEmailOfRequest);
router.patch('/restart-request/:id', companyRequestController.restartRequest);

router.get('/company-requests', factoryController.getAll(CompanyRequest));
router.get('/company-request/:id', factoryController.getById(CompanyRequest));

router.get('/positions', recruitmentController.getAllCompanyPositions);
router.get('/positions-count', recruitmentController.getPositionsCount);
router.get('/company-positions/:id', recruitmentController.getCompanyAllPositions);
router.get('/company/position/:id', factoryController.getById(Positions));
router.post('/position/filter-talents/:id', recruitmentController.filterTalentsList);

// router.delete('/position/remove-talent/:id', recruitmentController.removeCandidate);
router.patch('/position/update-group-configs/:id', recruitmentController.updateGroupConfigs);
router.post('/position/process-talent-list/:id', recruitmentController.moveFilteredTalentsToProcessed);
router.post('/position/dispatch-talent-list/:id', recruitmentController.dispatchListToCompany);

router.patch('/close-position/:id', recruitmentController.closeCompanyPosition);
router.post('/recruitment/:id', recruitmentController.getPositionCandidateDetails);
router.get('/recruitment/processed/:id', recruitmentController.getProcessedCandidateDetails);
router.delete('/recruitment/remove-processed-candidates/:id', recruitmentController.removeProcessedCandidates);
router.post('/talent-positions', recruitmentController.getAllTalentPositions);

// router.get('/filterTalentScript', testScript.testing);



module.exports = router;