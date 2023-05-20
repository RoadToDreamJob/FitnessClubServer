const Router = require('express')
const router = new Router()

const userRoutes = require('./userRoutes')
const adminRoutes = require('./adminRoutes')

router.use('/user', userRoutes)
router.use('/admin', adminRoutes)

module.exports = router