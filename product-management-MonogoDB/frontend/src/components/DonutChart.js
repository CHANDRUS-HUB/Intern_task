import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Card, CardContent } from "../ui/card";
import { toast } from "react-toastify";
import { baseurl } from "../URL/url";
const DonutChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            labels: [],
            legend: {
                position: 'right',    // Moves legend to the right for better space utilization
                fontSize: '16px',     // Improves text visibility
                markers: {
                    width: 14,
                    height: 14
                },
                itemMargin: {
                    vertical: 8        // Adds spacing between legend items
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => `${val.toFixed(1)}%`
            },
            colors: ['#4F46E5', '#EC4899', '#10B981', '#FF8042']
        }

    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseurl}/products`);

                // Data Transformation
                const transformedData = response.data.reduce((acc, product) => {
                    const existingCategory = acc.find(item => item.name === product.category);

                    if (existingCategory) {
                        existingCategory.totalStock += product.old_stock + product.new_stock;
                    } else {
                        acc.push({
                            name: product.category,
                            totalStock: product.old_stock + product.new_stock
                        });
                    }

                    return acc;
                }, []);

                const seriesData = transformedData.map(item => item.totalStock);
                const labelsData = transformedData.map(item => item.name);

                setChartData({
                    ...chartData,
                    series: seriesData,
                    options: { ...chartData.options, labels: labelsData }
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data.");
            }
        };

        fetchData();
    }, [chartData]);

    return (
        <Card>
            <CardContent className="p-7">  {/* Increased padding */}
                <h2 className="text-2xl font-bold justify-center mb-6"> Stock Distribution</h2>
                <div className="flex justify-center items-center">
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                        width="450"
                        height="460"
                    />
                </div>
            </CardContent>

        </Card>
    );
};

export default DonutChart;
