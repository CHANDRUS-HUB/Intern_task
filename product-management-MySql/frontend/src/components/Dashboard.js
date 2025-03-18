import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "../ui/card";
import { toast } from "react-toastify";
import { baseurl } from '../URL/url';
import Homepage from '../components/Homepage';
import DonutChart from '../components/DonutChart';
import 'react-toastify/dist/ReactToastify.css'

const Dashboard = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseurl}/products`,{ withCredentials: true });
                
                // Transform data for chart display
                const transformedData = response.data.reduce((acc, product) => {
                    const existingCategory = acc.find(item => item.name === product.category);

                    if (existingCategory) {
                        existingCategory.totalStock += product.old_stock + product.new_stock;
                        existingCategory.totalConsumption += product.consumed;
                        existingCategory.inHandStock += product.in_hand_stock;
                    } else {
                        acc.push({
                            name: product.category,
                            totalStock: product.old_stock + product.new_stock,
                            totalConsumption: product.consumed,
                            inHandStock: product.in_hand_stock
                        });
                    }

                    return acc;
                }, []);

                setChartData(transformedData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data.");
            }
        };

        fetchData();
    }, []);

    return (

        <>
        <Homepage/>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-4">Stock Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalStock" fill="#4F46E5" name="Total Stock " />
                            <Bar dataKey="totalConsumption" fill="#EC4899" name="Total Consumption" />
                            <Bar dataKey="inHandStock" fill="#10B981" name="In-Hand Stock" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Pie Chart */}
            <DonutChart/>  
        </div>
        </>
    );
    
};


export default Dashboard;