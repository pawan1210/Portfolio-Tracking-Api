const yup = require("yup");
const { tradeType, securityType } = require("../../utils/constants");

const createTradeValidationSchema = yup.object().shape({
  portfolio_id: yup.string().required("portfolio_id is required"),
  trade_type: yup
    .string()
    .oneOf([Object.keys(tradeType)], "Invalid trade_type")
    .required("trade_type is required"),
  security_type: yup
    .string()
    .oneOf([Object.keys(securityType)], "Invalid security_type")
    .required("security_type is required"),
  ticker_symbol: yup.string().required("ticker_symbol is required"),
  price: yup
    .number()
    .positive("price should be positive")
    .required("price is required"),
  quantity: yup
    .number()
    .positive("quantity should be positive")
    .integer("quantity should be integral")
    .required("quantity is required"),
  unit: yup.string().required("unit is required"),
});

const updateTradeValidationSchema = yup.object().shape({
  portfolio_id: yup.string().required("portfolio_id is required"),
  trade_type: yup
    .string()
    .oneOf([Object.keys(tradeType)], "Invalid trade_type"),
  security_type: yup
    .string()
    .oneOf([Object.keys(securityType)], "Invalid security_type"),
  ticker_symbol: yup.string(),
  price: yup.number().positive("price should be positive"),
  quantity: yup
    .number()
    .positive("quantity should be positive")
    .integer("quantity should be integral"),
});

const requestValidation = (req, res, next) => {
  let validationSchema = createTradeValidationSchema;
  if (req.method == "PATCH") {
    validationSchema = updateTradeValidationSchema;
  }
  validationSchema
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
