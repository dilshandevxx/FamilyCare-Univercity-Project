import React, { useEffect, useRef, useState } from 'react';
import './GoogleSignInButton.css';

const GoogleSignInButton = ({ 
  mode = 'login', // 'login' | 'register'
  role = 'family', // 'family' | 'caregiver'
  onSuccess,
  onError,
  extraData = {},
  disabled = false,
  text
}) => {
  const buttonRef = useRef(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

  useEffect(() => {
    // If no client ID configured for GIS, we'll use direct OAuth redirect fallback
    if (!clientId) return;

    // Load Google Identity Services script if not already present
    const loadGis = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGisLoaded(true);
      document.body.appendChild(script);
    };

    loadGis();
  }, [clientId]);

  useEffect(() => {
    if (!gisLoaded || !clientId || !buttonRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            if (onError) onError('No credential received from Google.');
            return;
          }
          setLoading(true);
          try {
            if (onSuccess) {
              await onSuccess({
                credential: response.credential,
                role: role === 'caregiver' ? 'caregiver' : 'child',
                ...extraData,
              });
            }
          } catch (err) {
            console.error('Google Auth callback error:', err);
            if (onError) onError(err.response?.data?.error || err.message || 'Google sign in failed');
          } finally {
            setLoading(false);
          }
        },
      });

      // Render Google Sign-in button
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: mode === 'register' ? 'signup_with' : 'signin_with',
        logo_alignment: 'left',
        width: 340,
      });
    } catch (e) {
      console.warn('Could not initialize Google GIS button:', e);
    }
  }, [gisLoaded, clientId, role, mode, extraData, onSuccess, onError]);

  // Direct Click Handler (works when GIS button isn't rendered or as direct OAuth redirect)
  const handleDirectClick = () => {
    if (disabled || loading) return;

    // If GIS is available and initialized, prompt Google popup
    if (clientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    // Direct redirect to backend OAuth endpoint
    const targetRole = role === 'caregiver' ? 'caregiver' : 'family';
    window.location.href = `${serverUrl}/api/auth/google?role=${targetRole}`;
  };

  const displayText = text || (mode === 'register' 
    ? (role === 'caregiver' ? 'Sign up with Google (Caregiver)' : 'Sign up with Google') 
    : 'Continue with Google');

  return (
    <div className="google-auth-wrapper">
      {/* If Google Client ID is configured and rendered */}
      {clientId && gisLoaded ? (
        <div className="google-gis-container">
          <div ref={buttonRef} className="google-rendered-btn" />
        </div>
      ) : (
        /* Fallback modern custom Google button */
        <button
          type="button"
          onClick={handleDirectClick}
          className="google-custom-btn"
          disabled={disabled || loading}
        >
          {loading ? (
            <span className="google-btn-spinner" />
          ) : (
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="google-btn-icon"
              width="18"
              height="18"
            />
          )}
          <span className="google-btn-label">{displayText}</span>
        </button>
      )}
    </div>
  );
};

export default GoogleSignInButton;
