export const validate = (schema) => {
  return (req, res, next) => {
    const normalizedBody = req.body ?? {};
    const { error } = schema.validate(normalizedBody, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);

      const err = new Error("Validation error");
      err.statusCode = 400;
      err.details = messages;

      return next(err);
    }

    next();
  };
};
