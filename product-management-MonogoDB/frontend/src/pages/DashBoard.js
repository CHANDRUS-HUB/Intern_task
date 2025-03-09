import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "../ui/card";

const data = [
    { name: 'Canteen', stock: 400, consumption: 240 },
    { name: 'Stationary', stock: 300, consumption: 139 },
    { name: 'Washroom', stock: 200, consumption: 980 },
    { name: 'Cleaning', stock: 278, consumption: 390 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-4">Stock vs Consumption</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="stock" fill="#4F46E5" name="Total Stock" />
                            <Bar dataKey="consumption" fill="#EC4899" name="Total Consumption" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-4">Stock Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={data} dataKey="stock" nameKey="name" outerRadius={100} label>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
