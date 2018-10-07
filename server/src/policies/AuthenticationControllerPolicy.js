const Joi = require('joi')

module.exports = {
  register (req, res, next) {
    const schema = {
      email: Joi.string().email(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      )
    }
    const { error, value } = Joi.validate(req.body, schema)
    console.log(`value ${value} error ${error}`)
    if (error) {
      res.status(400).send({
        error: error.details[0].context.key
      })
    } else {
      next()
    }
  }
}
