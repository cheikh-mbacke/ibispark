import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import styles from "./ChartCard.module.css";

export const WeeklyOccupationChart = ({ data }) => {
  const chartData = data || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
          label={{ value: "Occupation", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Taux d'occupation"]}
          labelFormatter={(label) => `Jour: ${label}`}
        />
        <Legend />
        <Bar
          name="Taux d'occupation"
          dataKey="occupationRate"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          name="Emplacements disponibles"
          dataKey="spotsAvailable"
          fill="#10B981"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HotelDistributionChart = ({ data }) => {
  const chartData = data || [];
  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#6366F1",
    "#0EA5E9",
  ];

  // Si nous avons plus d'hôtels que de couleurs, nous réutiliserons les couleurs
  const getColor = (index) => COLORS[index % COLORS.length];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="spotCount"
          nameKey="name"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index)} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [
            `${value} emplacements (${props.payload.parkingCount} parkings)`,
            props.payload.name,
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const OccupancyTrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
        <Tooltip formatter={(value) => [`${value}%`, "Taux d'occupation"]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="occupancyRate"
          stroke="#3B82F6"
          name="Taux d'occupation"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default {
  WeeklyOccupationChart,
  HotelDistributionChart,
  OccupancyTrendChart,
};
