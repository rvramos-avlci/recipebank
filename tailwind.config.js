/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/js/**/*.{js,jsx,ts,tsx}',
        './resources/views/**/*.blade.php',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans:  ['DM Sans', 'ui-sans-serif', 'system-ui'],
                serif: ['DM Serif Display', 'ui-serif', 'Georgia'],
            },
            colors: {
                brand: {
                    50:  '#eef2ff',
                    100: '#e0e7ff',
                    400: '#818cf8',
                    500: '#6c8bef',
                    600: '#4f6de0',
                    700: '#3d4f99',
                    900: '#1e1b4b',
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
