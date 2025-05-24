const express = require("express");
const router = express.Router();
const contactsController = require("../controllers/contacts");
const { body, param } = require("express-validator"); // week 3
const validate = require("../middleware/validate"); // week 3

// GET all
router.get("/", contactsController.getAll);

// GET single contact by ID
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Invalid ID format"),
  validate,
  contactsController.getSingle
);

// CREATE
router.post(
  "/",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("favoriteColor").notEmpty().withMessage("Favorite color is required"),
    body("birthday")
      .notEmpty()
      .withMessage("Birthday is required")
      .isISO8601()
      .toDate()
      .withMessage("Birthday must be a valid date (YYYY-MM-DD)"),
  ],
  validate,
  contactsController.createContact
);

// UPDATE
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid ID format"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("favoriteColor").notEmpty().withMessage("Favorite color is required"),
    body("birthday")
      .notEmpty()
      .withMessage("Birthday is required")
      .isISO8601()
      .toDate()
      .withMessage("Birthday must be a valid date (YYYY-MM-DD)"),
  ],
  validate,
  contactsController.updateContact
);

// DELETE
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid ID format"),
  validate,
  contactsController.deleteContact
);

module.exports = router;
