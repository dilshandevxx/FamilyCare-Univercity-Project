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
  const [gisRenderFailed, setGisRenderFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemoFallback, setShowDemoFallback] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

  useEffect(() => {
    if (!clientId) {
      setGisRenderFailed(true);
      return;
    }

    // Load Google Identity Services script if not already present
    const loadGis = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
        return;
      }

      const existingScript = document.getElementById('google-gis-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => setGisLoaded(true));
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-gis-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGisLoaded(true);
      script.onerror = () => {
        console.warn('Failed to load Google GIS script from Google CDN');
        setGisRenderFailed(true);
      };
      document.body.appendChild(script);
    };

    loadGis();
  }, [clientId]);

  useEffect(() => {
    if (!gisLoaded || !clientId || !buttonRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        auto_select: false,
        cancel_on_tap_outside: true,
        callback: async (response) => {
          if (!response.credential) {
            if (onError) onError('No credential received from Google.');
            setShowDemoFallback(true);
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
            const msg = err.response?.data?.error || err.message || 'Google sign-in failed. Please try again.';
            if (onError) onError(msg);
            setShowDemoFallback(true);
          } finally {
            setLoading(false);
          }
        },
        error_callback: (err) => {
          console.warn('Google GIS error:', err);
          setGisRenderFailed(true);
          setShowDemoFallback(true);
        }
      });

      // Clear any previous child before rendering button
      if (buttonRef.current) {
        buttonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: mode === 'register' ? 'signup_with' : 'signin_with',
          logo_alignment: 'left',
          width: 320,
        });
      }
    } catch (e) {
      console.warn('Could not initialize Google GIS button:', e);
      setGisRenderFailed(true);
    }
  }, [gisLoaded, clientId, role, mode, extraData, onSuccess, onError]);

  // Direct Click Handler (works when GIS button isn't rendered or as fallback)
  const handleCustomClick = async () => {
    if (disabled || loading) return;
    setLoading(true);

    try {
      // 1. If Google GIS prompt is available, try opening prompt
      if (clientId && window.google?.accounts?.id && !gisRenderFailed) {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.warn('Google One Tap suppressed or dismissed:', notification.getNotDisplayedReason?.() || notification.getSkippedReason?.());
            // Fallback to OAuth redirect or demo sign-in
            setShowDemoFallback(true);
            setLoading(false);
          }
        });
        return;
      }

      // 2. Redirect to backend Google OAuth endpoint
      const targetRole = role === 'caregiver' ? 'caregiver' : 'family';
      window.location.href = `${serverUrl}/api/auth/google?role=${targetRole}`;
    } catch (err) {
      console.error('Google sign-in error:', err);
      if (onError) onError('Google sign in encountered an issue. You can use the Quick Google Demo button below.');
      setShowDemoFallback(true);
      setLoading(false);
    }
  };

  // Quick 1-click Google Test / Demo login fallback
  const handleDemoGoogleAuth = async () => {
    if (disabled || loading) return;
    setLoading(true);
    if (onError) onError('');

    try {
      const isCaregiver = role === 'caregiver';
      const demoPayload = {
        credential: 'dev_google_' + Date.now(),
        role: isCaregiver ? 'caregiver' : 'child',
        email: isCaregiver ? 'caregiver.google@familycare.com' : 'family.google@familycare.com',
        name: isCaregiver ? 'Sarah Mitchell (Google Verified)' : 'Jane Cooper (Google User)',
        picture: isCaregiver 
          ? 'https://images.unsplash.com/photo-1594824813589-9a74cf8f2b87?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        ...extraData,
      };

      if (onSuccess) {
        await onSuccess(demoPayload);
      }
    } catch (err) {
      console.error('Google demo auth error:', err);
      if (onError) onError(err.response?.data?.error || err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const displayText = text || (mode === 'register' 
    ? (role === 'caregiver' ? 'Sign up with Google (Caregiver)' : 'Sign up with Google') 
    : 'Continue with Google');

  return (
    <div className="google-auth-wrapper">
      {/* If Google Client ID is configured and rendered properly without error */}
      {clientId && gisLoaded && !gisRenderFailed ? (
        <div className="google-gis-container">
          <div ref={buttonRef} className="google-rendered-btn" />
        </div>
      ) : (
        /* Modern custom Google branded button */
        <button
          type="button"
          onClick={handleCustomClick}
          className="google-custom-btn"
          disabled={disabled || loading}
          aria-label={displayText}
        >
          {loading ? (
            <span className="google-btn-spinner" />
          ) : (
            <svg className="google-btn-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          )}
          <span className="google-btn-label">{loading ? 'Connecting to Google...' : displayText}</span>
        </button>
      )}

      {/* Quick 1-Click Google Auth for instant testing / demonstration */}
      <div className="google-demo-fallback-box">
        <button
          type="button"
          className="google-demo-fallback-btn"
          onClick={handleDemoGoogleAuth}
          disabled={disabled || loading}
          title="Instant Google test sign-in (works without Google Cloud Console setup)"
        >
          ⚡ Quick 1-Click Google {mode === 'register' ? 'Sign Up' : 'Sign In'} ({role === 'caregiver' ? 'Caregiver' : 'Family'})
        </button>
      </div>
    </div>
  );
};

export default GoogleSignInButton;
