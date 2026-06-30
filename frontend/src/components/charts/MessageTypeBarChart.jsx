import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const MessageTypeBarChart = ({ data }) => {
  return (
    <div className="chart-shell compact">
      <ResponsiveContainer height={170} width="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#e8eef8" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 3, 3]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MessageTypeBarChart;
