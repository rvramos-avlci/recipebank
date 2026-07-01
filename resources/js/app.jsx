import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import axios from 'axios'

// Axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// Dark mode: restore from localStorage on boot
const saved = localStorage.getItem('bf_theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
}

createInertiaApp({
    title: (title) => title ? `${title} — SoftDev` : 'SoftDev',
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
    progress: {
        color: '#6c8bef',
        showSpinner: false,
    },
})
