import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';

type ThemeType = 'cyberpunk' | 'glass' | 'minimal' | 'dark' | 'light' | 'neon';
type FontFamily = 'sans' | 'serif' | 'mono';
type BackgroundPattern = 'none' | 'grid' | 'dots' | 'waves';
type ReducedMotionPreference = 'reduce' | 'no-preference';

interface ThemeSettings {
  theme: ThemeType;
  particleDensity: number;
  animationIntensity: number;
  accentColor: string;
  fontFamily: FontFamily;
  backgroundPattern: BackgroundPattern;
  enableParticles: boolean;
  enableGlitch: boolean;
  reducedMotion: ReducedMotionPreference;
}

interface ThemeContextType extends ThemeSettings {
  setTheme: (theme: ThemeType) => void;
  setParticleDensity: (density: number) => void;
  setAnimationIntensity: (intensity: number) => void;
  setAccentColor: (color: string) => void;
  setFontFamily: (font: FontFamily) => void;
  setBackgroundPattern: (pattern: BackgroundPattern) => void;
  setEnableParticles: (enabled: boolean) => void;
  setEnableGlitch: (enabled: boolean) => void;
  setReducedMotion: (preference: ReducedMotionPreference) => void;
  resetToDefaults: () => void;
  isInitialized: boolean;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  theme: 'cyberpunk',
  particleDensity: 50,
  animationIntensity: 100,
  accentColor: '#00f0d3',
  fontFamily: 'sans',
  backgroundPattern: 'none',
  enableParticles: true,
  enableGlitch: true,
  reducedMotion: 'no-preference',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: ThemeType;
  initialAccentColor?: string;
  persistSettings?: boolean;
  storageKey?: string;
}> = ({
  children,
  initialTheme = DEFAULT_SETTINGS.theme,
  initialAccentColor = DEFAULT_SETTINGS.accentColor,
  persistSettings = true,
  storageKey = 'portfolio-theme-settings-v2',
}) => {
  const [settings, setSettings] = useState<ThemeSettings>({
    ...DEFAULT_SETTINGS,
    theme: initialTheme,
    accentColor: initialAccentColor,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (!persistSettings) {
      setIsInitialized(true);
      return;
    }

    try {
      const savedSettings = localStorage.getItem(storageKey);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        
        // Validate and merge with defaults
        const loadedSettings: ThemeSettings = {
          theme: themes.includes(parsed.theme) ? parsed.theme : DEFAULT_SETTINGS.theme,
          particleDensity: typeof parsed.particleDensity === 'number' 
            ? Math.max(0, Math.min(100, parsed.particleDensity))
            : DEFAULT_SETTINGS.particleDensity,
          animationIntensity: typeof parsed.animationIntensity === 'number'
            ? Math.max(0, Math.min(100, parsed.animationIntensity))
            : DEFAULT_SETTINGS.animationIntensity,
          accentColor: typeof parsed.accentColor === 'string' && parsed.accentColor
            ? parsed.accentColor
            : DEFAULT_SETTINGS.accentColor,
          fontFamily: fonts.includes(parsed.fontFamily) ? parsed.fontFamily : DEFAULT_SETTINGS.fontFamily,
          backgroundPattern: patterns.includes(parsed.backgroundPattern) ? parsed.backgroundPattern : DEFAULT_SETTINGS.backgroundPattern,
          enableParticles: typeof parsed.enableParticles === 'boolean' ? parsed.enableParticles : DEFAULT_SETTINGS.enableParticles,
          enableGlitch: typeof parsed.enableGlitch === 'boolean' ? parsed.enableGlitch : DEFAULT_SETTINGS.enableGlitch,
          reducedMotion: reducedMotionOptions.includes(parsed.reducedMotion) ? parsed.reducedMotion : DEFAULT_SETTINGS.reducedMotion,
        };

        setSettings(loadedSettings);
      }
    } catch (error) {
      console.warn('Failed to load theme settings from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, [persistSettings, storageKey, initialTheme, initialAccentColor]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (persistSettings && isInitialized) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save theme settings to localStorage:', error);
      }
    }
  }, [settings, persistSettings, storageKey, isInitialized]);

  // Update individual settings
  const updateSettings = useCallback(<K extends keyof ThemeSettings>(
    key: K,
    value: ThemeSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Apply theme changes to CSS variables and classes
  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;
    const body = document.body;

    // Set CSS variables
    root.style.setProperty('--neon-cyan', settings.accentColor);
    root.style.setProperty('--animation-intensity', `${settings.animationIntensity}%`);
    root.style.setProperty('--particle-density', settings.particleDensity.toString());

    // Set font family
    const fontMap = {
      sans: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      serif: 'Georgia, ui-serif, serif',
      mono: '"Fira Code", ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    };
    root.style.setProperty('--font-family', fontMap[settings.fontFamily]);

    // Apply data attributes instead of classes for better specificity
    body.setAttribute('data-theme', settings.theme);
    body.setAttribute('data-pattern', settings.backgroundPattern);
    body.setAttribute('data-particles', settings.enableParticles ? 'enabled' : 'disabled');
    body.setAttribute('data-glitch', settings.enableGlitch ? 'enabled' : 'disabled');
    body.setAttribute('data-reduced-motion', settings.reducedMotion);

    // Apply theme-specific CSS variables
    const themeVariables = {
      cyberpunk: {
        '--bg-primary': '#0a0a0a',
        '--bg-secondary': '#1a1a1a',
        '--text-primary': '#ffffff',
        '--text-secondary': '#b0b0b0',
      },
      glass: {
        '--bg-primary': 'rgba(255, 255, 255, 0.1)',
        '--bg-secondary': 'rgba(255, 255, 255, 0.05)',
        '--text-primary': '#ffffff',
        '--text-secondary': '#cccccc',
      },
      minimal: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f8f9fa',
        '--text-primary': '#333333',
        '--text-secondary': '#666666',
      },
      dark: {
        '--bg-primary': '#121212',
        '--bg-secondary': '#1e1e1e',
        '--text-primary': '#ffffff',
        '--text-secondary': '#bbbbbb',
      },
      light: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f5f5f5',
        '--text-primary': '#333333',
        '--text-secondary': '#666666',
      },
      neon: {
        '--bg-primary': '#000000',
        '--bg-secondary': '#0f0f0f',
        '--text-primary': '#ffffff',
        '--text-secondary': '#00ff88',
      },
    };

    const currentThemeVars = themeVariables[settings.theme];
    Object.entries(currentThemeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

  }, [settings, isInitialized]);

  // Sync with system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      if (settings.reducedMotion === 'no-preference') {
        // Only auto-update if user hasn't explicitly set a preference
        updateSettings('reducedMotion', mediaQuery.matches ? 'reduce' : 'no-preference');
      }
    };

    // Set initial value
    handleChange();

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.reducedMotion, updateSettings]);

  const resetToDefaults = useCallback(() => {
    setSettings({
      ...DEFAULT_SETTINGS,
      theme: initialTheme,
      accentColor: initialAccentColor,
    });
  }, [initialTheme, initialAccentColor]);

  const contextValue: ThemeContextType = {
    ...settings,
    setTheme: (theme) => updateSettings('theme', theme),
    setParticleDensity: (density) => updateSettings('particleDensity', density),
    setAnimationIntensity: (intensity) => updateSettings('animationIntensity', intensity),
    setAccentColor: (color) => updateSettings('accentColor', color),
    setFontFamily: (font) => updateSettings('fontFamily', font),
    setBackgroundPattern: (pattern) => updateSettings('backgroundPattern', pattern),
    setEnableParticles: (enabled) => updateSettings('enableParticles', enabled),
    setEnableGlitch: (enabled) => updateSettings('enableGlitch', enabled),
    setReducedMotion: (preference) => updateSettings('reducedMotion', preference),
    resetToDefaults,
    isInitialized,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Constants for validation
const themes: ThemeType[] = ['cyberpunk', 'glass', 'minimal', 'dark', 'light', 'neon'];
const fonts: FontFamily[] = ['sans', 'serif', 'mono'];
const patterns: BackgroundPattern[] = ['none', 'grid', 'dots', 'waves'];
const reducedMotionOptions: ReducedMotionPreference[] = ['reduce', 'no-preference'];

// Enhanced ThemeSwitcher component
export const ThemeSwitcher: React.FC<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}> = ({ 
  position = 'top-right',
  className = '' 
}) => {
  const {
    theme,
    setTheme,
    particleDensity,
    setParticleDensity,
    animationIntensity,
    setAnimationIntensity,
    accentColor,
    setAccentColor,
    fontFamily,
    setFontFamily,
    backgroundPattern,
    setBackgroundPattern,
    enableParticles,
    setEnableParticles,
    enableGlitch,
    setEnableGlitch,
    reducedMotion,
    setReducedMotion,
    resetToDefaults,
    isInitialized,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  if (!isInitialized) {
    return (
      <div className={`fixed ${getPositionClasses(position)} bg-black/80 backdrop-blur-md p-4 rounded-lg shadow-lg z-50`}>
        <div className="text-white text-sm">Loading themes...</div>
      </div>
    );
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${getPositionClasses(position)} z-50 p-3 bg-black/80 backdrop-blur-md rounded-full shadow-lg hover:bg-black/90 transition-all duration-300 group`}
        aria-label="Theme settings"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
            isOpen ? 'bg-cyan-400 rotate-45 scale-110' : 'bg-gray-400 group-hover:bg-cyan-400'
          }`} />
        </div>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className={`fixed ${getPositionClasses(position)} z-50 bg-black/90 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/10 max-w-sm w-80 ${className}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg">Theme Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close settings"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      theme === t
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-gray-600"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm"
                  placeholder="#00f0d3"
                />
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm"
              >
                {fonts.map((f) => (
                  <option key={f} value={f}>
                    {f === 'sans' ? 'Sans Serif' : f === 'serif' ? 'Serif' : 'Monospace'}
                  </option>
                ))}
              </select>
            </div>

            {/* Background Pattern */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Background Pattern</label>
              <select
                value={backgroundPattern}
                onChange={(e) => setBackgroundPattern(e.target.value as BackgroundPattern)}
                className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm"
              >
                {patterns.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sliders */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Particle Density: {particleDensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={particleDensity}
                onChange={(e) => setParticleDensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Animation Intensity: {animationIntensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={animationIntensity}
                onChange={(e) => setAnimationIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <Toggle
                label="Enable Particles"
                checked={enableParticles}
                onChange={setEnableParticles}
              />
              <Toggle
                label="Enable Glitch Effects"
                checked={enableGlitch}
                onChange={setEnableGlitch}
              />
              <Toggle
                label="Reduce Motion"
                checked={reducedMotion === 'reduce'}
                onChange={(checked) => setReducedMotion(checked ? 'reduce' : 'no-preference')}
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                resetToDefaults();
                setIsOpen(false);
              }}
              className="w-full p-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded-lg transition-all duration-300 font-medium"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Helper component for toggle switches
const Toggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-300">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-cyan-500' : 'bg-gray-600'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Helper function for position classes
function getPositionClasses(position: string): string {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };
  return positions[position as keyof typeof positions] || positions['top-right'];
}