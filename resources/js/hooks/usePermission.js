import { usePage } from '@inertiajs/react'

export function usePermission() {
    const { auth } = usePage().props

    const can = (permission) => {
        if (!auth?.user) return false
        if (auth.user.role?.name === 'admin') return true
        return auth.user.permissions?.includes(permission) ?? false
    }

    const canAny = (...permissions) => permissions.some(p => can(p))

    const isAdmin = auth?.user?.role?.name === 'admin'

    return { can, canAny, isAdmin, user: auth?.user }
}
