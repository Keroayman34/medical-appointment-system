export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);

      const err = new Error("Validation error");
      err.statusCode = 400;
      err.details = messages; // optional: extra info

      return next(err);
    }

    next();
  };
};
