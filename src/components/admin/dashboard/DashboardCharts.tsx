"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { formatPrice } from "@/src/lib/utils";

interface DashboardChartsProps {
    revenueData: Array<{ name: string; total: number }>;
    statusData: Array<{ name: string; value: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DashboardCharts({ revenueData, statusData }: DashboardChartsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 border rounded-xl p-6 bg-card">
                <h3 className="font-semibold mb-4">Revenue Overview</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => `${value / 1000000}M`}
                            />
                            <Tooltip 
                                formatter={(value: any) => [formatPrice(Number(value) || 0), "Total"]}
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px' }}
                            />
                            <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="col-span-3 border rounded-xl p-6 bg-card">
                <h3 className="font-semibold mb-4">Order Status</h3>
                <div className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                     </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
