/** Tailwind config: activa plugins útiles para esta UI */
import lineClamp from '@tailwindcss/line-clamp';
import forms from '@tailwindcss/forms';

export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: { extend: {} },
    plugins: [lineClamp, forms],
};
