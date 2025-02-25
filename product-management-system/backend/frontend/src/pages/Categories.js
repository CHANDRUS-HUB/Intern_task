import { useState, useEffect } from "react";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get("http://localhost:5000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://localhost:5000/categories/${editing.id}`, { name });
    } else {
      await axios.post("http://localhost:5000/categories", { name });
    }
    setName("");
    setEditing(null);
    fetchCategories();
  };

  const handleEdit = (category) => {
    setEditing(category);
    setName(category.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await axios.delete(`http://localhost:5000/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          {editing ? "Update Category" : "Add Category"}
        </button>
      </form>
      <table className="w-full border mt-6">
        <thead>
          <tr>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="border p-2">{category.name}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(category)} className="mr-2 p-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(category.id)} className="p-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
