const yup = require("yup");

const userValidationSchema = yup.object().shape({
  email: yup.string().required("email is required"),
});

const requestValidation = async (req, res, next) => {
  userValidationSchema
    .validate(req.body)
    .then(() => {
      next();
    })
    .catch((err) => {
      res.status(400).json({
        errors: err.errors,
        params: err.params,
      });
    });
};

module.exports = {
  requestValidation,
};
