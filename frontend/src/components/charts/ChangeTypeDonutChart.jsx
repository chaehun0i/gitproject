import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#315df4", "#8b5cf6", "#14b8a6", "#cbd5e1"];

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
