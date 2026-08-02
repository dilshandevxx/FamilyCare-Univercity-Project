import React from 'react';
import { Link } from 'react-router-dom';
import './BrandLogo.css';

/**
 * Modern Clean BrandLogo Component for FamilyCare
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {'default' | 'white' | 'icon-only' | 'monochrome'} [props.variant='default']
 * @param {string} [props.tagline]
 * @param {string} [props.to]
 * @param {string} [props.className]
 * @param {Function} [props.onClick]
 */
export const BrandLogoMark = ({ size = 36, color = '#00A896', innerColor = '#ffffff' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="brand-logo-svg"
  >
    {/* Modern Rounded Squircle Container */}
    <rect
      x="2"
      y="2"
      width="40"
      height="40"
      rx="12"
      fill={color}
      className="brand-logo-bg"
    />
    
    {/* Subtle Inner Accent Border */}
    <rect
      x="3"
      y="3"
      width="38"
      height="38"
      rx="11"
      stroke="#ffffff"
      strokeOpacity="0.18"
      strokeWidth="1"
    />

    {/* Modern Heart & Life-Pulse Synthesis */}
    {/* Left Heart Arc & Pulse Line */}
    <path
      d="M12 23.5H16L19 16.5L23.5 28.5L27 21H32"
      stroke={innerColor}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Protective Heart Crown & Caring Dot */}
    <path
      d="M22 10.5C20.2 8.5 17.2 8.2 15 10.2C12.8 12.2 12.6 15.4 14.5 17.5"
      stroke={innerColor}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M22 10.5C23.8 8.5 26.8 8.2 29 10.2C31.2 12.2 31.4 15.4 29.5 17.5"
      stroke={innerColor}
      strokeWidth="2.4"
      strokeLinecap="round"
    />

    {/* Center Vitality Node */}
    <circle
      cx="22"
      cy="10.8"
      r="2"
      fill={innerColor}
    />
  </svg>
);

const BrandLogo = ({
  size = 'md',
  variant = 'default',
  tagline = '',
  to = '/',
  className = '',
  onClick
}) => {
  const markSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56
  };

  const isWhite = variant === 'white';
  const isIconOnly = variant === 'icon-only';

  const content = (
    <div
      className={`fc-brand-logo fc-size-${size} fc-variant-${variant} ${className}`}
      onClick={onClick}
    >
      <div className="fc-logo-mark-wrap">
        <BrandLogoMark
          size={markSizes[size] || 36}
          color="#00A896"
          innerColor="#ffffff"
        />
      </div>

      {!isIconOnly && (
        <div className="fc-logo-text-wrap">
          <div className="fc-logo-title">
            <span className={`fc-name-family ${isWhite ? 'text-white' : 'text-slate'}`}>
              Family
            </span>
            <span className="fc-name-care">Care</span>
          </div>
          {tagline && <span className="fc-logo-tagline">{tagline}</span>}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="fc-brand-logo-link" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
