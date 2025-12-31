import { Platform } from 'react-native';
import { moderateScale } from './responsive';

export const palette = {
    primary: '#00C2FF',
    secondary: '#70E000', 

    dark: {
        background: '#0B0F17',
        surface: '#161B26',
        text: '#FFFFFF',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        border: '#1E293B',
    },

    light: {
        background: '#F1F5F9',
        surface: '#FFFFFF',
        text: '#0F172A',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        border: '#E2E8F0',
    }
};

export const typography = {
    fonts: {
        main: Platform.select({ ios: 'System', android: 'sans-serif' }),
        code: Platform.select({ ios: 'Courier', android: 'monospace' }),
        // Recommendations for future custom fonts:
        // main: 'Inter-Regular',
        // bold: 'Inter-Bold',
    },
    sizes: {
        xs: moderateScale(10),
        sm: moderateScale(12),
        md: moderateScale(14),
        lg: moderateScale(16),
        xl: moderateScale(20),
        xxl: moderateScale(24),
        display: moderateScale(48),
    },
    weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    }
};

export const theme = {
    palette,
    typography,
    colors: (isDark: boolean) => isDark ? palette.dark : palette.light,
};
