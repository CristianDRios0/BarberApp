const palette = {
  background: '#131313',
  surface: '#1F2020',
  surfaceBright: '#393939',
  surfaceContainerLow: '#1B1C1C',
  primary: '#F2CA50', 
  primaryContainer: '#D4AF37',
  onPrimary: '#3C2F00',
  secondary: '#C8C6C5',
  onSurface: '#E4E2E1', 
  onSurfaceVariant: '#D0C5AF', 
  outline: '#99907C',
  error: '#FFB4AB',
};

export default {
  light: { 
    text: palette.onSurface,
    background: palette.background,
    tint: palette.primary,
    tabIconDefault: palette.secondary,
    tabIconSelected: palette.primary,
    card: palette.surface,
    border: palette.outline,
    notification: palette.primaryContainer,
    placeholder: palette.outline
  },
  dark: {
    text: palette.onSurface,
    background: palette.background,
    tint: palette.primary,
    tabIconDefault: palette.secondary,
    tabIconSelected: palette.primary,
    card: palette.surface,
    border: palette.outline,
    notification: palette.primaryContainer,
    placeholder: palette.outline
  },
};