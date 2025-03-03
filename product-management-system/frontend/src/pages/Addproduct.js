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
  dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'lactose', 'ghee', 'paneer', 'cottage cheese', 'whey', 'buttermilk', 'curd'],
  fruit: ['apple', 'banana', 'orange', 'grape', 'mango', 'peach', 'watermelon', 'kiwi', 'pineapple', 'pear', 'pomegranate', 'strawberry', 'blueberry', 'lemon'],
  vegetable: ['carrot', 'spinach', 'broccoli', 'tomato', 'potato', 'onion', 'cucumber', 'lettuce', 'cabbage', 'peas', 'capsicum', 'mushroom', 'ginger', 'garlic', 'beetroot'],
  grains: ['rice', 'wheat', 'oats', 'barley', 'quinoa', 'millet', 'corn', 'buckwheat', 'flour', 'pasta', 'noodles', 'semolina', 'vermicelli'],
  meat: ['chicken', 'beef', 'pork', 'lamb', 'fish', 'turkey', 'duck', 'bacon', 'sausages', 'hamburger', 'mutton', 'crab', 'prawns'],
  snacks: ['chips', 'crisps', 'popcorn', 'biscuits', 'cookies', 'chocolate', 'candy', 'snack bars', 'granola bars', 'namkeen', 'khakhra', 'murukku', 'chakli'],
  beverages: ['coffee', 'tea', 'juice', 'soda', 'water', 'milkshake', 'energy drink', 'beer', 'wine', 'cocktail', 'coconut water', 'lassi', 'green tea'],
  spices: ['salt', 'pepper', 'cumin', 'turmeric', 'coriander', 'chili', 'ginger', 'garlic', 'cinnamon', 'cardamom', 'bay leaf', 'cloves', 'nutmeg', 'star anise'],
  bakery: ['bread', 'baguette', 'croissant', 'muffins', 'cookies', 'cake', 'pastries', 'pie', 'donuts', 'rusk', 'breadsticks'],
  frozen: ['frozen vegetables', 'frozen fruit', 'ice cream', 'frozen pizza', 'frozen chicken', 'frozen fish', 'frozen paratha', 'frozen chapati'],
  condiments: ['ketchup', 'mustard', 'mayonnaise', 'barbecue sauce', 'soy sauce', 'hot sauce', 'vinaigrette', 'chili sauce', 'honey', 'vinegar'],
  nuts_and_seeds: ['almonds', 'cashews', 'peanuts', 'walnuts', 'sunflower seeds', 'flax seeds', 'pumpkin seeds', 'chia seeds', 'sesame seeds', 'pistachios'],
  dairy_alternatives: ['soy milk', 'almond milk', 'coconut milk', 'oat milk', 'tofu', 'tempeh', 'vegan cheese', 'cashew milk'],
  canned_goods: ['canned beans', 'canned tomatoes', 'canned tuna', 'canned corn', 'canned soup', 'canned fruit', 'canned peas', 'canned mushrooms'],
  cleaning_supplies: ['detergent', 'dish soap', 'toilet cleaner', 'glass cleaner', 'floor cleaner', 'laundry powder', 'bleach', 'phenyl', 'scrubber', 'garbage bags'],
  personal_care: ['shampoo', 'conditioner', 'soap', 'toothpaste', 'toothbrush', 'lotion', 'deodorant', 'razor', 'hand wash', 'sanitizer', 'talcum powder'],
  baby_products: ['diapers', 'baby wipes', 'baby food', 'formula', 'baby lotion', 'pacifier', 'baby shampoo', 'baby oil', 'baby powder'],
  pet_supplies: ['dog food', 'cat food', 'pet shampoo', 'pet toys', 'litter', 'dog treats', 'pet collar', 'fish food', 'bird seeds'],
  health_supplements: ['vitamins', 'protein powder', 'omega-3', 'multivitamins', 'fish oil', 'probiotics', 'creatine', 'calcium tablets', 'herbal supplements'],
  household_essentials: ['tissues', 'napkins', 'toilet paper', 'aluminum foil', 'cling wrap', 'mosquito repellent', 'matchbox', 'batteries'],
  cooking_essentials: ['cooking oil', 'ghee', 'butter', 'sugar', 'jaggery', 'salt', 'rice flour', 'corn flour', 'baking powder', 'yeast'],
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
      toast.error(" Error adding product.");
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
