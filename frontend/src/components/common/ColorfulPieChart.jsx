import React, { useState } from 'react';

/**
 * Modern, colorful SVG Pie / Donut Chart component.
 * Uses flat, vibrant colors with interactive slice hovering,
 * center display of stats, and beautiful modern legend badges.
 * Strictly ZERO gradients.
 */

// Helper to calculate SVG coordinates for a circle/donut slice
function getCoordinatesForPercent(percent, radius, cx = 100, cy = 100) {
  const angle = (percent * 360 - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

// Generate SVG path for a slice
function createSlicePath(startPercent, endPercent, outerRadius, innerRadius = 0, cx = 100, cy = 100) {
  // Clamp full circle to 0.9999 to avoid SVG arc glitch
  if (endPercent - startPercent >= 0.9999) {
    endPercent = 0.9999;
  }
  const isLargeArc = endPercent - startPercent > 0.5 ? 1 : 0;
  const p1 = getCoordinatesForPercent(startPercent, outerRadius, cx, cy);
  const p2 = getCoordinatesForPercent(endPercent, outerRadius, cx, cy);

  if (innerRadius === 0) {
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${isLargeArc} 1 ${p2.x} ${p2.y} Z`;
  }

  const p3 = getCoordinatesForPercent(endPercent, innerRadius, cx, cy);
  const p4 = getCoordinatesForPercent(startPercent, innerRadius, cx, cy);
  return `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${isLargeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 ${isLargeArc} 0 ${p4.x} ${p4.y} Z`;
}

const DEFAULT_COLORS = [
  '#00A896', // Brand Teal
  '#3B82F6', // Vibrant Blue
  '#F59E0B', // Bright Amber
  '#8B5CF6', // Modern Purple
  '#EC4899', // Pink / Rose
  '#10B981', // Emerald Green
  '#06B6D4', // Cyan
  '#F43F5E', // Coral Red
];

const ColorfulPieChart = ({
  data = [],
  title = '',
  subtitle = '',
  size = 190,
  donut = true,
  innerRadius = 54,
  outerRadius = 82,
  showLegend = true,
  centerLabel = 'Total',
  centerValue = null,
  unit = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const validData = data.filter(d => Number(d.value) > 0);
  const total = validData.reduce((acc, curr) => acc + Number(curr.value || 0), 0);

  if (total === 0 || validData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>
        No chart data available
      </div>
    );
  }

  // Pre-calculate slices
  let cumulative = 0;
  const slices = validData.map((item, index) => {
    const val = Number(item.value);
    const fraction = val / total;
    const startPct = cumulative;
    const endPct = cumulative + fraction;
    cumulative = endPct;

    const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    const isHovered = hoveredIndex === index;
    const currentOuter = isHovered ? outerRadius + 4 : outerRadius;
    const currentInner = donut ? (isHovered ? innerRadius - 2 : innerRadius) : 0;

    const path = createSlicePath(startPct, endPct, currentOuter, currentInner, 100, 100);

    return {
      ...item,
      val,
      percentage: Math.round(fraction * 100),
      color,
      path,
      index,
    };
  });

  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;
  const displayedValue = activeSlice ? activeSlice.val : (centerValue !== null ? centerValue : total);
  const displayedLabel = activeSlice ? activeSlice.label : centerLabel;
  const displayedSub = activeSlice ? `${activeSlice.percentage}% of total` : (unit || `${slices.length} categories`);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {(title || subtitle) && (
        <div style={{ width: '100%', marginBottom: '0.75rem', textAlign: 'left' }}>
          {title && (
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{title}</h4>
          )}
          {subtitle && (
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>{subtitle}</p>
          )}
        </div>
      )}

      {/* SVG Chart & Center Readout */}
      <div style={{ position: 'relative', width: size, height: size, margin: '0.25rem 0' }}>
        <svg
          viewBox="0 0 200 200"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          {slices.map((slice) => (
            <path
              key={slice.index}
              d={slice.path}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth="2.5"
              style={{
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: hoveredIndex === null || hoveredIndex === slice.index ? 1 : 0.65,
                filter: hoveredIndex === slice.index ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))' : 'none',
              }}
              onMouseEnter={() => setHoveredIndex(slice.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Center label for Donut chart */}
        {donut && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              textAlign: 'center',
              padding: '8px',
            }}
          >
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: activeSlice ? activeSlice.color : '#0f172a',
                lineHeight: 1.1,
                transition: 'color 0.2s ease',
              }}
            >
              {displayedValue}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#334155',
                marginTop: '2px',
                maxWidth: '75px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayedLabel}
            </span>
            <span
              style={{
                fontSize: '0.64rem',
                color: '#94a3b8',
                fontWeight: 500,
              }}
            >
              {displayedSub}
            </span>
          </div>
        )}
      </div>

      {/* Colorful Legend Grid */}
      {showLegend && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.45rem',
            justifyContent: 'center',
            marginTop: '0.75rem',
            width: '100%',
          }}
        >
          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.index;
            return (
              <div
                key={slice.index}
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: isHovered ? '#f1f5f9' : '#f8fafc',
                  border: `1.5px solid ${isHovered ? slice.color : '#e2e8f0'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isHovered ? 'translateY(-1px)' : 'none',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: slice.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: '#1e293b',
                  }}
                >
                  {slice.label}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: slice.color,
                    marginLeft: '2px',
                  }}
                >
                  {slice.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ColorfulPieChart;
