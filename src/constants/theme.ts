export const colors = {
  primary: '#007AFF',
  danger: '#FF3B30',
  text: {
    primary: '#000',
    secondary: '#333',
    tertiary: '#666',
    quaternary: '#888',
    placeholder: '#999',
  },
  background: {
    primary: '#fff',
    secondary: '#f5f5f5',
    tertiary: '#f9f9f9',
  },
  border: {
    light: '#eee',
    medium: '#ddd',
    dark: '#ccc',
  },
  success: '#34C759',
  warning: '#FF9500',
  info: '#5AC8FA',
  accent: '#E3F2FD',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: 'bold' as const,
  },
  title1: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  headline: {
    fontSize: 18,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  callout: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  subheadline: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  footnote: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
