import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import axios from "axios";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const BarChart = lazy(() => import("recharts").then((module) => ({ default: module.BarChart })));
const Bar = lazy(() => import("recharts").then((module) => ({ default: module.Bar })));
const LineChart = lazy(() => import("recharts").then((module) => ({ default: module.LineChart })));
const Line = lazy(() => import("recharts").then((module) => ({ default: module.Line })));
const PieChart = lazy(() => import("recharts").then((module) => ({ default: module.PieChart })));
const Pie = lazy(() => import("recharts").then((module) => ({ default: module.Pie })));

function Analytics() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [forecastData, setForecastData] = useState([]);

  const fetchAnalytics = useCallback( () => {
    axios.get(`http://localhost:5000/analytics?category=${category}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  },[category]);

  const fetchForecast = useCallback(() => {
    axios.get(`http://localhost:5000/stock-forecast?category=${category}`)
      .then((res) => setForecastData(res.data))
      .catch((err) => console.error(err));
  }, [category]);

   useEffect(() => {
    fetchAnalytics();
    fetchForecast();
  }, [fetchAnalytics, fetchForecast]);

  const colors = ["#8884d8", "#82ca9d", "#ff6666", "#ffc658"];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">📊 Product Analytics</h2>

      {/* Category Filter */}
      <div className="mb-6 flex items-center space-x-4">
        <label className="font-semibold text-gray-700">Filter by Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded-lg shadow-sm">
          <option value="">All Categories</option>
          <option value="Stationery">Stationery</option>
          <option value="Canteen Products">Canteen Products</option>
          <option value="Daily Consumption Items">Daily Consumption Items</option>
        </select>
      </div>

      {/* Responsive Grid Layout for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-5 shadow-lg rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Stock Analysis</h3>
          <Suspense fallback={<p>Loading...</p>}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="old_stock" fill="#8884d8" name="Old Stock" />
                <Bar dataKey="quantity" fill="#82ca9d" name="New Stock" />
                <Bar dataKey="consumed" fill="#ff6666" name="Consumed" />
                <Bar dataKey="in_hand_stock" fill="#ffc658" name="In-Hand Stock" />
              </BarChart>
            </ResponsiveContainer>
          </Suspense>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-5 shadow-lg rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Stock Trends</h3>
          <Suspense fallback={<p>Loading...</p>}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="old_stock" stroke="#8884d8" />
                <Line type="monotone" dataKey="quantity" stroke="#82ca9d" />
                <Line type="monotone" dataKey="consumed" stroke="#ff6666" />
                <Line type="monotone" dataKey="in_hand_stock" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Suspense>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-5 shadow-lg rounded-xl col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Stock Distribution</h3>
          <Suspense fallback={<p>Loading...</p>}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data} dataKey="in_hand_stock" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Suspense>
        </div>
      </div>

      {/* Forecasted Stock Consumption Table */}
      <div className="bg-white p-5 shadow-lg rounded-xl mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📈 Forecasted Stock Consumption</h3>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product</th>
              <th className="border p-2">Next Date</th>
              <th className="border p-2">Forecasted Consumption</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.length > 0 ? (
              forecastData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.next_date}</td>
                  <td className="border p-2">{item.forecasted_consumption}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center border p-2 text-gray-500">No forecast data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
