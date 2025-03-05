const pool = require("../config/database");

async function fetchCategoryKeywords() {
  try {
    const [rows] = await pool.execute("SELECT name, keywords FROM categories");
    const categoryKeywords = {};

    rows.forEach((row) => {
      categoryKeywords[row.name] = row.keywords
        ? row.keywords.split(",").map((kw) => kw.trim().toLowerCase())
        : [];
    });

    return categoryKeywords;
  } catch (error) {
    console.error(" Error fetching category keywords:", error);
    return {}; 
  }
}


 
async function getProductCategory(productName) {
  try {
    if (!productName) throw new Error("Product name is required.");

    const categoryKeywords = await fetchCategoryKeywords();
    const lowerName = productName.toLowerCase();
    let matchedCategory = "General";

    for (const category in categoryKeywords) {
      if (categoryKeywords[category].some((keyword) => lowerName.includes(keyword))) {
        matchedCategory = category;
        break;
      }
    }

    return matchedCategory;
  } catch (error) {
    console.error(" Error determining product category:", error);
    return "General";
  }
}

module.exports = { fetchCategoryKeywords, getProductCategory };
