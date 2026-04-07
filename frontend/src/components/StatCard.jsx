export default function StatCard({ title, value, subtitle, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
      {subtitle ? <span>{subtitle}</span> : null}
    </div>
  );
}
