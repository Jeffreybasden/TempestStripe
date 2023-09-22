const router = require('express').Router()
const employee = require('../controllers/employeectrl')


router.post('/employee-register',employee.register)



module.exports = router