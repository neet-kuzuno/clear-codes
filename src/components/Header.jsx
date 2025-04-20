import React from 'react';
import SettingsButton from './SettingsButton';

function Header({ appVersion, onOpenSettings }) {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#1f2937',
    borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
  };

  const titleStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    margin: '0'
  };

  return (
    <header className="header" style={headerStyle}>
      <div className="header-title">
        <h1 style={titleStyle}>
          Clear Codes v{appVersion}
        </h1>
      </div>
      <div className="header-actions">
        <SettingsButton onClick={onOpenSettings} />
      </div>
    </header>
  );
}

Header.defaultProps = {
  appVersion: '0.1.0',
  onOpenSettings: () => {}
};

export default Header; 