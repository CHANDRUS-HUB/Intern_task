const express = require("express");
const { getAllCategories, addCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", addCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
