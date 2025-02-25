import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { BarChart, Package, PlusCircle, List } from "lucide-react";

function Dashboard() {
  const links = [
    { to: "/products", label: "Manage Products", color: "blue", icon: <Package /> },
    { to: "/add-product", label: "Add Product", color: "green", icon: <PlusCircle /> },
    { to: "/categories", label: "Manage Categories", color: "purple", icon: <List /> },
    { to: "/analytics", label: "View Analytics", color: "orange", icon: <BarChart /> },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Management Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {links.map(({ to, label, color, icon }, index) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full bg-${color}-500 text-white`}>{icon}</div>
                <Link to={to} className="flex-1">
                  <Button className={`w-full bg-${color}-600 hover:bg-${color}-700`}>
                    {label}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
