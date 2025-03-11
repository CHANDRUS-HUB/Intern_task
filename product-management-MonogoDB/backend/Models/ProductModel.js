const mongoose = require("mongoose");

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


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: false }, 
    old_stock: { type: Number, default: 0 },
    new_stock: { type: Number, default: 0 },
    unit: { type: String, required: true },
    consumed: { type: Number, default: 0 },
    in_hand_stock: { type: Number, default: 0 } 
  },
  { timestamps: true }
);


productSchema.pre('validate', function (next) {
  if (!this.category) { 
    const productName = this.name.toLowerCase();
    let matchedCategory = "General";

    for (const category in categoryKeywords) {
      if (categoryKeywords[category].some(keyword => productName.includes(keyword))) {
        matchedCategory = category;
        break;
      }
    }

    this.category = matchedCategory;
  }

  this.in_hand_stock = this.old_stock + this.new_stock - this.consumed;

  next(); 
});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
