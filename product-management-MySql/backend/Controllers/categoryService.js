const pool = require("../config/database"); 

async function getUnitsByCategory(categoryName) {
  try {
    const connection = await pool.getConnection();

    
    const [category] = await connection.execute(
      "SELECT id FROM categories WHERE name = ?",
      [categoryName]
    );

    if (category.length === 0) {
      console.log("⚠️ Category not found");
      connection.release();
      return [];
    }

    const categoryId = category[0].id;

    
    const [units] = await connection.execute(
      "SELECT unit FROM units WHERE category_id = ?",
      [categoryId]
    );

    connection.release();
    return units.map((row) => row.unit);
  } catch (error) {
    console.error(" Error fetching units:", error);
    return [];
  }
}


getUnitsByCategory("dairy").then((units) => console.log("Units:", units));

module.exports = { getUnitsByCategory };
