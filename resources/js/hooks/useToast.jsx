import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const toast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3500)
    }, [])

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium min-w-[260px] shadow-xl pointer-events-auto border ${
                            t.type === 'success'
                                ? 'bg-[var(--bg-card)] border-green-500 text-green-500'
                                : t.type === 'error'
                                    ? 'bg-[var(--bg-card)] border-red-400 text-red-400'
                                    : 'bg-[var(--bg-card)] border-blue-400 text-blue-400'
                        }`}
                    >
                        <span className="text-base">
                            {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
                        </span>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext)
}
