import React from 'react';
import { Link } from 'react-router-dom';
import './BrandLogo.css';

/**
 * Modern Clean BrandLogoMark SVG Component for FamilyCare
 *
 * @param {Object} props
 * @param {number} [props.size=38]
 * @param {string} [props.color='#00A896'] - Base container color
 * @param {string} [props.innerColor='#ffffff'] - Heart & accent color
 * @param {string} [props.accentColor='#00A896'] - Cross cut-out color
 * @param {string} [props.className='']
 */
export const BrandLogoMark = ({
  size = 38,
  color = '#00A896',
  innerColor = '#ffffff',
  accentColor = '#00A896',
  className = ''
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`fc-logo-svg ${className}`}
  >
    {/* Modern Rounded Squircle Container */}
    <rect
      x="2"
      y="2"
      width="44"
      height="44"
      rx="13"
      fill={color}
      className="fc-logo-bg"
    />

    {/* Crisp Inset Stroke for Clean Border Definition */}
    <rect
      x="3.2"
      y="3.2"
      width="41.6"
      height="41.6"
      rx="11.8"
      stroke="#ffffff"
      strokeOpacity="0.22"
      strokeWidth="1.2"
    />

    {/* Master Brand Emblem: Harmonious Heart & Medical Cross */}
    <g className="fc-logo-emblem">
      {/* Pure White Solid Heart */}
      <path
        d="M24 37.5C24 37.5 9.5 28 9.5 17.5C9.5 12 13.8 8 19 8C21.8 8 23.3 9.4 24 10.5C24.7 9.4 26.2 8 29 8C34.2 8 38.5 12 38.5 17.5C38.5 28 24 37.5 24 37.5Z"
        fill={innerColor}
        className="fc-logo-heart"
      />

      {/* Vertical Cross Bar */}
      <rect
        x="21.75"
        y="13.5"
        width="4.5"
        height="12"
        rx="2.25"
        fill={accentColor}
        className="fc-logo-cross"
      />

      {/* Horizontal Cross Bar */}
      <rect
        x="18"
        y="17.25"
        width="12"
        height="4.5"
        rx="2.25"
        fill={accentColor}
        className="fc-logo-cross"
      />

      {/* Vitality Life-Node Center */}
      <circle
        cx="24"
        cy="19.5"
        r="1.6"
        fill={innerColor}
        className="fc-logo-node"
      />
    </g>
  </svg>
);

/**
 * Modern Clean BrandLogo Component for FamilyCare
 *
 * @param {Object} props
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {'default' | 'white' | 'icon-only' | 'dark'} [props.variant='default']
 * @param {string} [props.tagline]
 * @param {string} [props.to='/']
 * @param {string} [props.className='']
 * @param {Function} [props.onClick]
 */
const BrandLogo = ({
  size = 'md',
  variant = 'default',
  tagline = '',
  to = '/',
  className = '',
  onClick
}) => {
  const markSizes = {
    xs: 26,
    sm: 32,
    md: 38,
    lg: 46,
    xl: 56
  };

  const isWhite = variant === 'white';
  const isIconOnly = variant === 'icon-only';

  const markColor = isWhite ? '#00A896' : '#00A896';
  const innerColor = '#ffffff';
  const accentColor = '#00A896';

  const content = (
    <div
      className={`fc-brand-logo fc-size-${size} fc-variant-${variant} ${className}`}
      onClick={onClick}
    >
      <div className="fc-logo-mark-wrap">
        <BrandLogoMark
          size={markSizes[size] || 38}
          color={markColor}
          innerColor={innerColor}
          accentColor={accentColor}
        />
      </div>

      {!isIconOnly && (
        <div className="fc-logo-text-wrap">
          <div className="fc-logo-title">
            <span className={`fc-name-family ${isWhite ? 'text-white' : 'text-slate'}`}>
              Family
            </span>
            <span className="fc-name-care">Care</span>
            <span className="fc-name-dot"></span>
          </div>
          {tagline && <span className="fc-logo-tagline">{tagline}</span>}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="fc-brand-logo-link" onClick={onClick} title="FamilyCare — Home">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
