import React from 'react';

interface SettingsProps {
    isDarkMode: boolean;
    onDarkModeToggle: (isDark: boolean) => void;
    customFontColor: string;
    onFontColorChange: (color: string) => void;
    currentTheme: string;
    onThemeChange: (theme: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
    isDarkMode,
    onDarkModeToggle,
    customFontColor,
    onFontColorChange,
    currentTheme,
    onThemeChange
}) => {
    return (
        <div className="settings-view" style={{ 
            padding: '2rem', 
            maxWidth: '800px', 
            margin: '0 auto', 
            width: '100%',
            color: 'var(--text-primary)'
        }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 800 }}>Settings</h1>

            <section className="premium-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Display & Appearance</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ fontWeight: 600 }}>Dark Mode</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Toggle between light and dark backgrounds</div>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                        <input 
                            type="checkbox" 
                            checked={isDarkMode} 
                            onChange={(e) => onDarkModeToggle(e.target.checked)}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: isDarkMode ? 'var(--accent-blue)' : '#ccc',
                            transition: '.4s',
                            borderRadius: '34px'
                        }}>
                            <span style={{
                                position: 'absolute',
                                content: '""',
                                height: '16px',
                                width: '16px',
                                left: '4px',
                                bottom: '4px',
                                backgroundColor: 'white',
                                transition: '.4s',
                                borderRadius: '50%',
                                transform: isDarkMode ? 'translateX(26px)' : 'translateX(0)'
                            }}></span>
                        </span>
                    </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ fontWeight: 600 }}>Font Color</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Customize the default text color</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>{customFontColor}</span>
                        <div 
                            onClick={() => document.getElementById('font-color-input')?.click()}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: customFontColor,
                                border: '2px solid var(--border-color)',
                                cursor: 'pointer'
                            }}
                        />
                        <input 
                            id="font-color-input"
                            type="color" 
                            value={customFontColor}
                            onChange={(e) => onFontColorChange(e.target.value)}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Core Theme</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Select your preferred UI style</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['glass', 'saas', 'soft'].map(t => (
                            <button
                                key={t}
                                onClick={() => onThemeChange(t)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: currentTheme === t ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                                    background: currentTheme === t ? 'var(--bg-hover)' : 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    flex: 1
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Settings;
