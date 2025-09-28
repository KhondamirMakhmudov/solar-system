// components/card/RegionCard.jsx
const StatItem = ({ value, label }) => (
  <div className="stat-item">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const Metric = ({ value, label }) => (
  <div className="metric">
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
  </div>
);

const InverterCard = ({ inverter }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Онлайн":
        return "status-online";
      case "Предупреждение":
        return "status-warning";
      case "Офлайн":
        return "status-offline";
      default:
        return "status-online";
    }
  };

  const getCardClass = (status) => {
    switch (status) {
      case "Предупреждение":
        return "inverter-card warning";
      case "Офлайн":
        return "inverter-card error";
      default:
        return "inverter-card";
    }
  };

  return (
    <div className={getCardClass(inverter.status)}>
      <div className="inverter-header">
        <div className="inverter-name">{inverter.name}</div>
        <div className={`status-badge ${getStatusClass(inverter.status)}`}>
          {inverter.status}
        </div>
      </div>
      <div className="inverter-metrics">
        <Metric value={inverter.currentPower} label="Текущая мощность" />
        <Metric value={inverter.earnings} label="Заработано" />
        <Metric value={inverter.totalGeneration} label="Общая выработка" />
        <Metric value={inverter.efficiency} label="Эффективность" />
      </div>
    </div>
  );
};

const RegionCard = ({ region, isExpanded, onToggle }) => (
  <div className="region-card">
    <div className="region-header" onClick={onToggle}>
      <div className="region-title">{region.name}</div>
      <div className={`expand-icon ${isExpanded ? "rotated" : ""}`}>▼</div>
    </div>
    <div className="region-stats">
      <StatItem value={region.inverterCount} label="Инверторов" />
      <StatItem value={region.projectCapacity} label="Проектная мощность" />
      <StatItem value={region.totalGeneration} label="Общая выработка" />
      <StatItem value={region.dailyGeneration} label="Суточная выработка" />
      <StatItem value={region.currentGeneration} label="Текущая выработка" />
    </div>
    {isExpanded && (
      <div className="inverters-grid">
        {region.inverters.map((inverter, index) => (
          <InverterCard key={index} inverter={inverter} />
        ))}
      </div>
    )}
  </div>
);

export default RegionCard;
