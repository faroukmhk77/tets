import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface ThemeColors {
  bgColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  buttonColor: string;
}

interface ThemeContextType {
  theme: ThemeColors;
  updateTheme: (colors: ThemeColors) => Promise<boolean>;
  loading: boolean;
}

const defaultTheme: ThemeColors = {
  bgColor: '#000000',
  primaryColor: '#C9A962',
  secondaryColor: '#1a1a1a',
  accentColor: '#C9A962',
  textColor: '#FFFFFF',
  buttonColor: '#C9A962',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: async () => false,
  loading: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('theme_bg_color, theme_primary_color, theme_secondary_color, theme_accent_color, theme_text_color, theme_button_color')
        .single();

      if (data) {
        setTheme({
          bgColor: data.theme_bg_color || defaultTheme.bgColor,
          primaryColor: data.theme_primary_color || defaultTheme.primaryColor,
          secondaryColor: data.theme_secondary_color || defaultTheme.secondaryColor,
          accentColor: data.theme_accent_color || defaultTheme.accentColor,
          textColor: data.theme_text_color || defaultTheme.textColor,
          buttonColor: data.theme_button_color || defaultTheme.buttonColor,
        });
      }
      setLoading(false);
    };
    fetchTheme();
  }, []);

  useEffect(() => {
    if (!loading) {
      const root = document.documentElement;
      root.style.setProperty('--color-bg', theme.bgColor);
      root.style.setProperty('--color-primary', theme.primaryColor);
      root.style.setProperty('--color-secondary', theme.secondaryColor);
      root.style.setProperty('--color-accent', theme.accentColor);
      root.style.setProperty('--color-text', theme.textColor);
      root.style.setProperty('--color-button', theme.buttonColor);
    }
  }, [theme, loading]);

  const updateTheme = async (colors: ThemeColors): Promise<boolean> => {
    const { error } = await supabase
      .from('site_settings')
      .update({
        theme_bg_color: colors.bgColor,
        theme_primary_color: colors.primaryColor,
        theme_secondary_color: colors.secondaryColor,
        theme_accent_color: colors.accentColor,
        theme_text_color: colors.textColor,
        theme_button_color: colors.buttonColor,
      })
      .eq('id', 1);

    if (!error) {
      setTheme(colors);
      return true;
    }
    console.error('Theme update error:', error);
    return false;
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
