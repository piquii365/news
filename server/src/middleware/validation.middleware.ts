import { body, validationResult } from "express-validator";
import express from "express";

// Validation middleware to handle validation errors
export const handleValidationErrors = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.type === "field" ? error.path : "unknown",
        message: error.msg,
      })),
    });
  }
  next();
};

// Input sanitization helper
export const sanitizeInput = (input: string | undefined | null): string => {
  return (input || "").trim().replace(/[<>]/g, "");
};

// Login validation rules remain the same
export const validateLogin = [
  body("user")
    .notEmpty()
    .withMessage("Please provide a username or email address!")
    .customSanitizer(sanitizeInput),

  body("password")
    .notEmpty()
    .withMessage("Please provide a password!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long!")
    .customSanitizer(sanitizeInput),
];
// Registration validation rules

export const validateRegistration = [
  body("fullName")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces")
    .customSanitizer(sanitizeInput),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .customSanitizer(sanitizeInput),

  body("username")
    .isLength({ min: 2, max: 50 })
    .withMessage("Username must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores")
    .customSanitizer(sanitizeInput),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    )
    .customSanitizer(sanitizeInput),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Contact form validation rules
export const validateContact = [
  body("name")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .customSanitizer(sanitizeInput),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .customSanitizer(sanitizeInput),

  body("subject")
    .isLength({ min: 5, max: 100 })
    .withMessage("Subject must be between 5 and 100 characters")
    .customSanitizer(sanitizeInput),

  body("message")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters")
    .customSanitizer(sanitizeInput),

  body("category")
    .isIn(["general", "support", "billing", "partnership", "feedback"])
    .withMessage("Invalid category"),
];

// Profile update validation rules
export const validateProfileUpdate = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .customSanitizer(sanitizeInput),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .customSanitizer(sanitizeInput),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number")
    .customSanitizer(sanitizeInput),

  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters")
    .customSanitizer(sanitizeInput),

  body("location")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Location must be between 3 and 100 characters")
    .customSanitizer(sanitizeInput),
];

// Password change validation rules
export const validatePasswordChange = [
  body("currentPassword")
    .isLength({ min: 6 })
    .withMessage("Current password is required")
    .customSanitizer(sanitizeInput),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    )
    .customSanitizer(sanitizeInput),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];
