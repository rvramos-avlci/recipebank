// Components/shared/FlashMessages.jsx
import { usePage } from '@inertiajs/react'
import { useEffect } from 'react'
import { useToast } from '@/hooks/useToast'

export function FlashMessages() {
    const { flash } = usePage().props
    const { toast } = useToast()

    useEffect(() => {
        if (flash?.success) toast(flash.success, 'success')
        if (flash?.error)   toast(flash.error,   'error')
    }, [flash])

    return null
}

// Components/shared/PageHeader.jsx
export function PageHeader({ title, children }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif">{title}</h2>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
}

// Components/shared/SearchBar.jsx
export function SearchBar({ children }) {
    return (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
            {children}
        </div>
    )
}
