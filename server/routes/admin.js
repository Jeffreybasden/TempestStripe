const router = require('express').Router()
const admin = require('../controllers/adminctrl')


router.post('/data',admin.getData)
router.get('/total',admin.getTotal)
router.post('/admin-login',admin.login)
router.post('/admin-register',admin.register)
router.get('/teams',admin.getTeams)
router.get('/delete-team/:id',admin.deleteTeam)
router.post('/add-team/', admin.addTeam)
module.exports = router