const validate = (schema) => (req, res, next) => {
  console.log("Validating request body:", req.body);
  const { error, value } = schema.validate(req.body)
  if (error) {
    console.error("Validation error:", error.details[0].message)
    return res.status(400).json({ error: error.details[0].message })
  }
  req.body = value
  next()
}

module.exports = validate
