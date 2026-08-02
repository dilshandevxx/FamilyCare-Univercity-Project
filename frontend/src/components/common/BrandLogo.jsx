import React from 'react';
import { Link } from 'react-router-dom';
import './BrandLogo.css';

/**
 * FamilyCare — Family Silhouette Brand Mark
 *
 * A crisp, professional SVG icon featuring a clean family silhouette
 * (two adults + child) set inside a rounded-square container.
 * Designed in the style of Linear, Figma, Loom: icon-left + wordmark-right.
 *
 * @param {Object} props
 * @param {number} [props.size=40]   — px size of the square icon container
 * @param {string} [props.color]     — override container fill
 * @param {string} [props.className]
 */
export const BrandLogoMark = ({
  size = 40,
  color = '#00A896',
  className = ''
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`fc-logo-svg ${className}`}
    aria-label="FamilyCare icon"
  >
    {/* Rounded-square background tile */}
    <rect
      x="0" y="0"
      width="48" height="48"
      rx="13"
      fill={color}
    />

    {/* Subtle inner glow border */}
    <rect
      x="1" y="1"
      width="46" height="46"
      rx="12"
      stroke="rgba(255,255,255,0.18)"
      strokeWidth="1.5"
      fill="none"
    />

    {/*
      ── FAMILY SILHOUETTE ──
      Left adult (parent A) — taller
      Right adult (parent B) — slightly shorter
      Child in centre front — smaller
      All drawn as clean white filled paths, flat & modern
    */}

    {/* ── Left Adult (Parent) ── */}
    {/* Head */}
    <circle cx="15" cy="16" r="4" fill="white" />
    {/* Body + shoulders */}
    <path
      d="M8 36 C8 29 10.5 26 15 26 C19.5 26 22 29 22 36"
      fill="white"
    />

    {/* ── Right Adult (Parent) ── */}
    {/* Head */}
    <circle cx="33" cy="17" r="3.5" fill="white" />
    {/* Body + shoulders */}
    <path
      d="M26.5 36 C26.5 30 28.5 27.5 33 27.5 C37.5 27.5 39.5 30 39.5 36"
      fill="white"
    />

    {/* ── Child (Centre Front) ── */}
    {/* Head */}
    <circle cx="24" cy="21.5" r="2.8" fill="white" />
    {/* Body */}
    <path
      d="M19 36 C19 31.5 21 29.5 24 29.5 C27 29.5 29 31.5 29 36"
      fill="white"
    />

    {/* Bottom baseline rule — ties the three figures together */}
    <rect
      x="8" y="36.5"
      width="32" height="2"
      rx="1"
      fill="rgba(255,255,255,0.35)"
    />

    {/* Small teal heart accent — top-right corner badge */}
    <circle cx="38.5" cy="9.5" r="5" fill="rgba(255,255,255,0.18)" />
    <path
      d="M38.5 12.4 C38.5 12.4 34.8 10 35 8 C35.1 6.9 36 6.2 37 6.5 C37.6 6.7 38 7.1 38.5 7.7 C39 7.1 39.4 6.7 40 6.5 C41 6.2 41.9 6.9 42 8 C42.2 10 38.5 12.4 38.5 12.4Z"
      fill="white"
      opacity="0.9"
    />
  </svg>
);

/**
 * FamilyCare — Full Brand Logo
 * Horizontal icon-left + wordmark-right layout
 *
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {'default'|'white'|'dark'|'icon-only'} [props.variant='default']
 * @param {string} [props.tagline]
 * @param {string} [props.to='/']
 * @param {string} [props.className]
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
    xs: 28,
    sm: 34,
    md: 40,
    lg: 48,
    xl: 58
  };

  const isWhite    = variant === 'white';
  const isDark     = variant === 'dark';
  const isIconOnly = variant === 'icon-only';

  // On coloured/dark backgrounds the mark stays #00A896;
  // in white-on-dark panels we still use the same teal colour
  const markColor = '#00A896';

  const content = (
    <div
      className={`fc-brand-logo fc-size-${size} fc-variant-${variant} ${className}`}
      onClick={onClick}
    >
      {/* Icon Mark */}
      <div className="fc-logo-mark-wrap">
        <BrandLogoMark
          size={markSizes[size] || 40}
          color={markColor}
        />
      </div>

      {/* Wordmark */}
      {!isIconOnly && (
        <div className="fc-logo-text-wrap">
          <div className="fc-logo-title">
            <span className={`fc-name-family ${isWhite || isDark ? 'text-white' : 'text-slate'}`}>
              Family
            </span>
            <span className="fc-name-care">Care</span>
            <span className="fc-name-dot" aria-hidden="true" />
          </div>
          {tagline && <span className="fc-logo-tagline">{tagline}</span>}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="fc-brand-logo-link"
        onClick={onClick}
        title="FamilyCare — Home"
        aria-label="FamilyCare home"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
