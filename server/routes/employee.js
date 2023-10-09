const router = require('express').Router()
const employee = require('../controllers/employeectrl')


router.post('/employee-register',employee.register)
router.get('/employee-data',employee.employeeData)



module.exports = router