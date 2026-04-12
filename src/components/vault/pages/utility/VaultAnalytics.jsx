import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const VaultAnalytics = ({ messages }) => {
  const [groupBy, setGroupBy] = useState("category");

  const data = useMemo(() => {
    const getKey = (m) => {
      if (groupBy === "priority")
        return ["Low", "Medium", "High"][m.priority || 0];
      if (groupBy === "status") return m.status || "New";
      return m.category || "New";
    };

    const stats = messages.reduce((acc, m) => {
      const k = getKey(m);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(stats).map(([name, value]) => ({
      name,
      value,
    }));
  }, [messages, groupBy]);

  return (
    <div className="glass p-4 relative max-w-full h-full flex flex-col">
      {/* Glass highlight layer */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-30 rounded-lg" />

      <div className="relative z-0 flex flex-col h-full">
        {/* HEADER */}
        <div className="flex justify-between mb-3 shrink-0">
          <h3 className="text-sm text-[var(--text-muted)]">Distribution</h3>

          <select
            className="ui-select"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="category">Category</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* CHART */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius="80%">
                {data.map((_, i) => (
                  <Cell key={i} fill={`hsl(${i * 60},70%,60%)`} />
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
};

export default VaultAnalytics;
