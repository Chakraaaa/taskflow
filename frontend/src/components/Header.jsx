import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import './Header.css';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          FlowTask
        </Link>
        <nav className="header-nav">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="nav-link">Inscription</Link>
            </>
          ) : (
            <>
              <button onClick={handleLogoutClick} className="nav-link logout-btn">
                Déconnexion
              </button>
              {showLogoutConfirm && (
                <div className="logout-confirm-overlay">
                  <div className="logout-confirm-box">
                    <p className="logout-confirm-message">
                      Êtes-vous sûr de vouloir vous déconnecter ?
                    </p>
                    <div className="logout-confirm-buttons">
                      <Button type="secondary" onClick={handleCancelLogout}>
                        Annuler
                      </Button>
                      <Button type="primary" onClick={handleConfirmLogout}>
                        Se déconnecter
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

