const yup = require("yup");

const createPortFolioValidationSchema = yup.object().shape({
  title: yup.string().required("portfolio title is required"),
  user_id: yup.string().required("user_id is required"),
});

const requestValidation = (req, res, next) => {
  createPortFolioValidationSchema
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
