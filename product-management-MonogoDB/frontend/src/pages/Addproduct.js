import { useState } from "react";
import { toast } from "react-toastify";
import { addProduct } from "../api/productApi";


const unitTypes = ["kg", "g", "liter", "ml", "package", "piece", "box", "dozen", "bottle", "can"];

const categoryUnits = {
  dairy: ["liter", "ml", "kg", "g", "package", "carton", "bottle"],
  fruit: ["kg", "g", "dozen", "piece", "box", "packet"],
  vegetable: ["kg", "g", "piece", "box", "bundle"],
  grains: ["kg", "g", "liter", "ml", "package", "sack"],
  meat: ["kg", "g", "piece", "package", "tray"],
  snacks: ["package", "box", "piece", "packet", "can"],
  beverages: ["liter", "ml", "bottle", "can", "carton", "packet"],
  spices: ["kg", "g", "package", "bottle", "jar"],
  bakery: ["piece", "package", "dozen", "loaf", "box"],
  frozen: ["kg", "g", "package", "box", "carton"],
  condiments: ["liter", "ml", "bottle", "can", "jar", "sachet"],
  nuts_and_seeds: ["kg", "g", "package", "jar", "box"],
  dairy_alternatives: ["liter", "ml", "package", "carton", "bottle"],
  canned_goods: ["can", "package", "jar", "bottle"],
  cleaning_supplies: ["liter", "ml", "package", "bottle", "box", "sachet"],
  personal_care: ["piece", "package", "bottle", "tube", "bar"],
  baby_products: ["piece", "package", "bottle", "box", "carton"],
  pet_supplies: ["kg", "g", "package", "can", "bottle", "bag"],
  health_supplements: ["kg", "g", "bottle", "package", "jar", "sachet"],
  household_essentials: ["piece", "box", "roll", "packet", "carton"],
  cooking_essentials: ["liter", "ml", "kg", "g", "packet", "bottle", "box"],
};

const categoryKeywords = {
  Dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Lactose', 'Ghee', 'Paneer', 'Cottage Cheese', 'Whey', 'Buttermilk', 'Curd'],
  Fruit: ['Apple', 'Banana', 'Orange', 'Grape', 'Mango', 'Peach', 'Watermelon', 'Kiwi', 'Pineapple', 'Pear', 'Pomegranate', 'Strawberry', 'Blueberry', 'Lemon'],
  Vegetable: ['Carrot', 'Spinach', 'Broccoli', 'Tomato', 'Potato', 'Onion', 'Cucumber', 'Lettuce', 'Cabbage', 'Peas', 'Capsicum', 'Mushroom', 'Ginger', 'Garlic', 'Beetroot'],
  Grains: ['Rice', 'Wheat', 'Oats', 'Barley', 'Quinoa', 'Millet', 'Corn', 'Buckwheat', 'Flour', 'Pasta', 'Noodles', 'Semolina', 'Vermicelli'],
  Meat: ['Chicken', 'Beef', 'Pork', 'Lamb', 'Fish', 'Turkey', 'Duck', 'Bacon', 'Sausages', 'Hamburger', 'Mutton', 'Crab', 'Prawns'],
  Snacks: ['Chips', 'Crisps', 'Popcorn', 'Biscuits', 'Cookies', 'Chocolate', 'Candy', 'Snack Bars', 'Granola Bars', 'Namkeen', 'Khakhra', 'Murukku', 'Chakli'],
  Beverages: ['Coffee', 'Tea', 'Juice', 'Soda', 'Water', 'Milkshake', 'Energy Drink', 'Beer', 'Wine', 'Cocktail', 'Coconut Water', 'Lassi', 'Green Tea'],
  Spices: ['Salt', 'Pepper', 'Cumin', 'Turmeric', 'Coriander', 'Chili', 'Ginger', 'Garlic', 'Cinnamon', 'Cardamom', 'Bay Leaf', 'Cloves', 'Nutmeg', 'Star Anise'],
  Bakery: ['Bread', 'Baguette', 'Croissant', 'Muffins', 'Cookies', 'Cake', 'Pastries', 'Pie', 'Donuts', 'Rusk', 'Breadsticks'],
  Frozen: ['Frozen Vegetables', 'Frozen Fruit', 'Ice Cream', 'Frozen Pizza', 'Frozen Chicken', 'Frozen Fish', 'Frozen Paratha', 'Frozen Chapati'],
  Condiments: ['Ketchup', 'Mustard', 'Mayonnaise', 'Barbecue Sauce', 'Soy Sauce', 'Hot Sauce', 'Vinaigrette', 'Chili Sauce', 'Honey', 'Vinegar'],
  Nuts_and_Seeds: ['Almonds', 'Cashews', 'Peanuts', 'Walnuts', 'Sunflower Seeds', 'Flax Seeds', 'Pumpkin Seeds', 'Chia Seeds', 'Sesame Seeds', 'Pistachios'],
  Dairy_Alternatives: ['Soy Milk', 'Almond Milk', 'Coconut Milk', 'Oat Milk', 'Tofu', 'Tempeh', 'Vegan Cheese', 'Cashew Milk'],
  Canned_Goods: ['Canned Beans', 'Canned Tomatoes', 'Canned Tuna', 'Canned Corn', 'Canned Soup', 'Canned Fruit', 'Canned Peas', 'Canned Mushrooms'],
  Cleaning_Supplies: ['Detergent', 'Dish Soap', 'Toilet Cleaner', 'Glass Cleaner', 'Floor Cleaner', 'Laundry Powder', 'Bleach', 'Phenyl', 'Scrubber', 'Garbage Bags'],
  Personal_Care: ['Shampoo', 'Conditioner', 'Soap', 'Toothpaste', 'Toothbrush', 'Lotion', 'Deodorant', 'Razor', 'Hand Wash', 'Sanitizer', 'Talcum Powder'],
  Baby_Products: ['Diapers', 'Baby Wipes', 'Baby Food', 'Formula', 'Baby Lotion', 'Pacifier', 'Baby Shampoo', 'Baby Oil', 'Baby Powder'],
  Pet_Supplies: ['Dog Food', 'Cat Food', 'Pet Shampoo', 'Pet Toys', 'Litter', 'Dog Treats', 'Pet Collar', 'Fish Food', 'Bird Seeds'],
  Health_Supplements: ['Vitamins', 'Protein Powder', 'Omega-3', 'Multivitamins', 'Fish Oil', 'Probiotics', 'Creatine', 'Calcium Tablets', 'Herbal Supplements'],
  Household_Essentials: ['Tissues', 'Napkins', 'Toilet Paper', 'Aluminum Foil', 'Cling Wrap', 'Mosquito Repellent', 'Matchbox', 'Batteries'],
  Cooking_Essentials: ['Cooking Oil', 'Ghee', 'Butter', 'Sugar', 'Jaggery', 'Salt', 'Rice Flour', 'Corn Flour', 'Baking Powder', 'Yeast']
};



const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    consumed: "",
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[A-Za-z ]*$/.test(value)) {
      toast.error(" Product name should only contain letters and spaces.");
      return;
    }

    if ((name === "quantity" || name === "consumed") && (!/^\d*\.?\d*$/.test(value))) {
      toast.error(" Please enter a valid number.");
      return;
    }

    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setProduct({ ...product, category: selectedCategory, name: "" });
  };


  const handleProductSelection = (e) => {
    setProduct({ ...product, name: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name.trim()) {
      toast.error(" Product name is required.");
      return;
    }

    if (!unitTypes.includes(product.unit)) {
      toast.error(" Invalid unit. Choose from: " + unitTypes.join(", "));
      return;
    }

    setLoading(true);

    try {
      await addProduct({
        name: product.name.trim(),
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
        consumed: product.consumed,
      });

      toast.success("Product added successfully!");
      setProduct({ name: "", category: "", quantity: "", unit: "", consumed: "" });
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(" Error adding product.",error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="text-gray-700 font-medium">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">Select Category</option>
            {Object.keys(categoryKeywords).map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>


        {product.category && categoryKeywords[product.category] && (
          <div>
            <label className="text-gray-700 font-medium">Product Name</label>
            <select
              value={product.name}
              onChange={handleProductSelection}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select a Product</option>
              {categoryKeywords[product.category].map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        )}



        <div>
          <label className="text-gray-700 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={product.quantity}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium">Unit</label>
          <select
            name="unit"
            value={product.unit}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">Select Unit</option>
            {(categoryUnits[product.category] || unitTypes).map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>


        <div>
          <label className="text-gray-700 font-medium">Consumed Quantity</label>
          <input
            type="number"
            name="consumed"
            placeholder="Enter consumed amount"
            value={product.consumed}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

      
        <button
          type="submit"
          className={`w-full font-semibold py-3 rounded-lg shadow-md transition-all ${loading
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-blue-700"
            }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
