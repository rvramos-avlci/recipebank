import { useState, useCallback } from 'react'

export function useTheme() {
    const [isDark, setIsDark] = useState(() =>
        document.documentElement.classList.contains('dark')
    )

    const toggle = useCallback(() => {
        const next = !document.documentElement.classList.contains('dark')
        document.documentElement.classList.toggle('dark', next)
        localStorage.setItem('bf_theme', next ? 'dark' : 'light')
        setIsDark(next)
    }, [])

    return { isDark, toggle }
}
