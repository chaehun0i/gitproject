import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4F46E5", "#7C3AED", "#06B6D4", "#22C55E"];

const ChangeTypeDonutChart = ({ data }) => {
  return (
    <div className="donut-chart-card">
      <ResponsiveContainer height={190} width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey="value"
            innerRadius={54}
            outerRadius={78}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell fill={COLORS[index % COLORS.length]} key={entry.name} />
            ))}
          </Pie>
          <text dominantBaseline="middle" fill="#0f172a" fontSize="18" fontWeight="800" textAnchor="middle" x="50%" y="47%">
            100%
          </text>
          <text dominantBaseline="middle" fill="#64748b" fontSize="11" fontWeight="700" textAnchor="middle" x="50%" y="58%">
            전체 비율
          </text>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        {data.map((item, index) => (
          <span key={item.name}>
            <i style={{ background: COLORS[index % COLORS.length] }} />
            {item.name} {item.value}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default ChangeTypeDonutChart;
