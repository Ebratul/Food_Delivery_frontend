import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useTheme } from "../../hooks/useTheme.js";
import { compactNumber, formatPrice } from "../../lib/utils.js";

// chart palette from the design system (brand, accent, success + tints)
export const PALETTE = ["#7d40ff", "#ff6a2b", "#10b981", "#b08cff", "#ff9f6e", "#34d399", "#5822c4", "#c2410c"];

function useChartTheme() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    grid: dark ? "#2a2a30" : "#e4e4e7",
    axis: dark ? "#a1a1aa" : "#5f5f66",
    tooltip: { background: dark ? "#141416" : "#ffffff", border: `1px solid ${dark ? "#2a2a30" : "#e4e4e7"}`, borderRadius: 12, color: dark ? "#f4f4f5" : "#171717" },
  };
}

export function ChartCard({ title, description, children, className = "" }) {
  return (
    <section className={`surface rounded-[var(--radius-ui)] p-6 ${className}`}>
      <h2 className="t-h4">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-6 h-72">{children}</div>
    </section>
  );
}

/** Revenue / orders over time. */
export function TrendLineChart({ data, lines }) {
  const t = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="month" stroke={t.axis} tickLine={false} axisLine={false} fontSize={12} />
        {lines.map((l, i) => (
          <YAxis key={l.key} yAxisId={l.key} orientation={i ? "right" : "left"} stroke={t.axis} tickLine={false} axisLine={false} fontSize={12}
            tickFormatter={(v) => (l.money ? `৳${compactNumber(v)}` : v)} width={l.money ? 56 : 32} />
        ))}
        <Tooltip contentStyle={t.tooltip} formatter={(v, name) => [lines.find((l) => l.label === name)?.money ? formatPrice(v) : v, name]} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {lines.map((l, i) => (
          <Line key={l.key} yAxisId={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={PALETTE[i]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({ data, dataKey, nameKey = "name", label, money = false, color = PALETTE[0] }) {
  const t = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey={nameKey} stroke={t.axis} tickLine={false} axisLine={false} fontSize={12} interval={0} tickFormatter={(v) => (v.length > 12 ? `${v.slice(0, 11)}…` : v)} />
        <YAxis stroke={t.axis} tickLine={false} axisLine={false} fontSize={12} width={money ? 56 : 32} tickFormatter={(v) => (money ? `৳${compactNumber(v)}` : v)} allowDecimals={false} />
        <Tooltip contentStyle={t.tooltip} cursor={{ fill: t.grid, opacity: 0.4 }} formatter={(v) => [money ? formatPrice(v) : v, label]} />
        <Bar dataKey={dataKey} name={label} fill={color} radius={[8, 8, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data }) {
  const t = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none">
          {data.map((d, i) => <Cell key={d.name} fill={PALETTE[i % PALETTE.length]} />)}
        </Pie>
        <Tooltip contentStyle={t.tooltip} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
