const rateLimit = require("express-rate-limit")

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, //1 min
  max: 5, //limits IP to 5 logins/1 minute per window
  message: { message: "Too many attempts from this IP,try in 60sec" },
  handler: (req, res, next, options) => {
    // logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'error.log')
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true, //recommended headers according to the documentation
  legacyHeaders: false,
})

module.exports = loginLimiter
