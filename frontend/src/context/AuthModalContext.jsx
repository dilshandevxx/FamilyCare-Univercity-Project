import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot_password'
  const [role, setRole] = useState('family'); // 'family' | 'caregiver'

  const openAuthModal = useCallback((initialMode = 'login', initialRole = 'family') => {
    setMode(initialMode);
    setRole(initialRole);
    setIsOpen(true);
  }, []);

  const openLogin = useCallback((initialRole = 'family') => {
    openAuthModal('login', initialRole);
  }, [openAuthModal]);

  const openRegister = useCallback((initialRole = 'family') => {
    openAuthModal('register', initialRole);
  }, [openAuthModal]);

  const openForgotPassword = useCallback(() => {
    openAuthModal('forgot_password', role);
  }, [openAuthModal, role]);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAuthModal]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        role,
        setMode,
        setRole,
        openAuthModal,
        openLogin,
        openRegister,
        openForgotPassword,
        closeAuthModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export default AuthModalContext;
