// import { useState, useEffect } from "react";
// import axios from "axios";
// import { baseurl } from "../URL/url";

// function Categories() {
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");

//   // ✅ Built-in category options
//   const defaultCategories = ["Dairy Prouduct ,Canteen", "Stationary", "Washroom", "Office Products "];

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(`${baseurl}/categories`);
//       setCategories(res.data);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name.trim()) {
//       alert("⚠️ Category name cannot be empty.");
//       return;
//     }

//     try {
//       await axios.post(`${baseurl}/categories`, { name });
//       alert("✅ Category added!");
//       setName("");
//       fetchCategories();
//     } catch (error) {
//       console.error("❌ Failed to add category:", error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Category Management</h2>

//       {/* ✅ Default categories */}
//       <h3 className="text-xl font-semibold mt-4">Built-in Categories</h3>
//       <ul className="list-disc pl-5">
//         {defaultCategories.map((cat, index) => (
//           <li key={index}>{cat}</li>
//         ))}
//       </ul>

//       <h3 className="text-xl font-semibold mt-4">Custom Categories</h3>
//       <ul className="list-disc pl-5">
//         {categories.map((category) => (
//           <li key={category.id}>{category.name}</li>
//         ))}
//       </ul>

//       <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//         <input
//           type="text"
//           placeholder="New Category"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full p-2 border rounded"
//         />
//         <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Add Category</button>
//       </form>
//     </div>
//   );
// }

// export default Categories;
