import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ActivityLineChart = ({ values }) => {
  const data = values.map((value, index) => ({
    label: `${index + 1}`,
    value,
  }));

  return (
    <div className="chart-shell">
      <ResponsiveContainer height={210} width="100%">
        <AreaChart data={data} margin={{ top: 14, right: 18, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#315df4" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#315df4" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e8eef8" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} width={34} />
          <Tooltip />
          <Area
            dataKey="value"
            fill="url(#activityFill)"
            stroke="#315df4"
            strokeWidth={3}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityLineChart;
