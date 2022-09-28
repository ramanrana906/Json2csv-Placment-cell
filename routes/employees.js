const express = require('express');
const router = express.Router();
const passport = require('passport');
const EmployeeController = require('../controllers/Employee_controller');

router.get('/profile/:id',passport.checkAuthentication,EmployeeController.profile);
//router.post('/update/:id',passport.checkAuthentication,EmployeeController.update);
router.get('/sign-up',EmployeeController.signUp);
router.get('/sign-in',EmployeeController.signIn);
router.post('/create',EmployeeController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/employees/sign-in'}
),EmployeeController.createSession);
router.get('/sign-out',EmployeeController.destroySession);

//google auth
router.get('/auth/google',passport.authenticate('google',{scope : ['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/employees/sign-in'}),EmployeeController.createSession);

module.exports = router;