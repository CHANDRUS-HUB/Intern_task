const mongoose = require("mongoose");

const categoryKeywords = {
  dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'lactose', 'ghee', 'paneer', 'cottage cheese', 'whey'],
  fruit: ['apple', 'banana', 'orange', 'grape', 'mango', 'peach', 'watermelon', 'kiwi', 'pineapple', 'pear'],
  vegetable: ['carrot', 'spinach', 'broccoli', 'tomato', 'potato', 'onion', 'cucumber', 'lettuce', 'cabbage', 'peas'],
  grains: ['rice', 'wheat', 'oats', 'barley', 'quinoa', 'millet', 'corn', 'buckwheat', 'flour', 'pasta'],
  meat: ['chicken', 'beef', 'pork', 'lamb', 'fish', 'turkey', 'duck', 'bacon', 'sausages', 'hamburger'],
  snacks: ['chips', 'crisps', 'popcorn', 'biscuits', 'cookies', 'chocolate', 'candy', 'snack bars', 'granola bars'],
  beverages: ['coffee', 'tea', 'juice', 'soda', 'water', 'milkshake', 'energy drink', 'beer', 'wine', 'cocktail'],
  spices: ['salt', 'pepper', 'cumin', 'turmeric', 'coriander', 'chili', 'ginger', 'garlic', 'cinnamon', 'cardamom'],
  bakery: ['bread', 'baguette', 'croissant', 'muffins', 'cookies', 'cake', 'pastries', 'pie', 'donuts'],
  frozen: ['frozen vegetables', 'frozen fruit', 'ice cream', 'frozen pizza', 'frozen chicken', 'frozen fish'],
  condiments: ['ketchup', 'mustard', 'mayonnaise', 'barbecue sauce', 'soy sauce', 'hot sauce', 'vinaigrette'],
  nuts_and_seeds: ['almonds', 'cashews', 'peanuts', 'walnuts', 'sunflower seeds', 'flax seeds', 'pumpkin seeds', 'chia seeds'],
  dairy_alternatives: ['soy milk', 'almond milk', 'coconut milk', 'oat milk', 'tofu', 'tempeh', 'vegan cheese'],
  canned_goods: ['canned beans', 'canned tomatoes', 'canned tuna', 'canned corn', 'canned soup', 'canned fruit'],
  cleaning_supplies: ['detergent', 'dish soap', 'toilet cleaner', 'glass cleaner', 'floor cleaner', 'laundry powder', 'bleach'],
  personal_care: ['shampoo', 'conditioner', 'soap', 'toothpaste', 'toothbrush', 'lotion', 'deodorant', 'razor'],
  baby_products: ['diapers', 'baby wipes', 'baby food', 'formula', 'baby lotion', 'pacifier', 'baby shampoo'],
  pet_supplies: ['dog food', 'cat food', 'pet shampoo', 'pet toys', 'litter', 'dog treats', 'pet collar'],
  health_supplements: ['vitamins', 'protein powder', 'omega-3', 'multivitamins', 'fish oil', 'probiotics', 'creatine']
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
