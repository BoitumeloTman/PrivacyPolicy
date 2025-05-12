/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Enhanced color palette
      colors: {
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        gray: {
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
        },
        zinc: {
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        }
      },
      
      // Mobile-first breakpoints
      screens: {
        'xs': '375px',   // Small phones
        'sm': '640px',   // Phones
        'md': '768px',   // Tablets
        'lg': '1024px',  // Small laptops
        'xl': '1280px',  // Desktops
        '2xl': '1536px', // Large screens
      },
      
      // Better typography for mobile
      fontSize: {
        '2xs': '0.625rem',  // 10px - tiny labels
        'xs': '0.75rem',     // 12px
        'sm': '0.875rem',    // 14px - mobile body
        'base': '1rem',      // 16px - comfortable reading
        'lg': '1.125rem',    // 18px
      },
      
      // Mobile-optimized spacing
      spacing: {
        '4.5': '1.125rem',   // 18px - better button padding
        '18': '4.5rem',      // 72px - larger tap targets
      },
      
      // Touch target sizes
      minWidth: {
        'tap': '3rem',      // 48px minimum touch target
      },
      minHeight: {
        'tap': '3rem',      // 48px minimum touch target  
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Better form input styling
  ],
};