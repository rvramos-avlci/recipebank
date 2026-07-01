import { useState, useRef, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ToastProvider } from '@/hooks/useToast'
import { useTheme } from '@/hooks/useTheme'
import { usePermission } from '@/hooks/usePermission'

const SIDEBAR_COLLAPSED_KEY = 'app.sidebar.collapsed'

const NavItem = ({ href, icon, label, collapsed }) => {
    const { url } = usePage()
    const active = url.startsWith(href) && href !== '/recipes'
        ? true
        : url === '/recipes' && href === '/recipes'

    return (
        <Link href={href} title={collapsed ? label : undefined}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 overflow-hidden whitespace-nowrap
                ${active
                    ? 'bg-brand-500/15 text-brand-500 dark:text-brand-400 border-l-2 border-brand-500 pl-2.5'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-[var(--bg-hover)] hover:text-gray-900 dark:hover:text-gray-100'
                }`}
        >
            <span className="text-base flex-shrink-0">{icon}</span>
            {!collapsed && <span>{label}</span>}
        </Link>
    )
}

export default function AppLayout({ children, title }) {
    const [collapsed, setCollapsed]   = useState(() => {
        if (typeof window === 'undefined') return false
        return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
    })
    const [userMenu,  setUserMenu]    = useState(false)
    const { isDark, toggle }          = useTheme()
    const { can, user }               = usePermission()
    const menuRef                     = useRef(null)

    useEffect(() => {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
    }, [collapsed])

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <ToastProvider>
            <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">

                {/* ── Sidebar ─────────────────────────────────────────── */}
                <aside className={`flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border)] transition-all duration-200 flex-shrink-0 z-20
                    ${collapsed ? 'w-[60px]' : 'w-[220px]'}`}>

                    {/* Brand */}
                    <div className="flex items-center justify-between h-[60px] px-3.5 border-b border-[var(--border)]">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="text-brand-500 text-xl flex-shrink-0">◈</span>
                            {!collapsed && <span className="font-serif text-lg whitespace-nowrap">Recipe Bank</span>}
                        </div>
                        <button onClick={() => setCollapsed(prev => !prev)}
                            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded border border-[var(--border)] text-gray-400 hover:bg-[var(--bg-hover)] hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors">
                            {collapsed ? '›' : '‹'}
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-0.5">
                        {can('recipes.view')    && <NavItem href="/recipes"      icon="⊙" label="Recipes"      collapsed={collapsed} />}
                        <div className="my-2 border-t border-[var(--border)]" />
                        {can('users.view')      && <NavItem href="/users"        icon="◎" label="Users"        collapsed={collapsed} />}
                        {can('roles.manage')    && <NavItem href="/roles"        icon="⊛" label="Roles"        collapsed={collapsed} />}
                    </nav>

                    {/* User foot */}
                    {!collapsed && (
                        <div className="border-t border-[var(--border)] p-3">
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">Version 1.0.0</p>
                                <p className="text-[11px] text-[var(--text-muted)] truncate">by SoftDev</p>
                            </div>
                        </div>
                    )}
                </aside>

                {/* ── Main ────────────────────────────────────────────── */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Topbar */}
                    <header className="h-[60px] bg-[var(--bg-surface)] border-b border-[var(--border)] flex items-center justify-between px-6 flex-shrink-0">
                        <h1 className="text-xl font-serif">{title}</h1>

                        <div className="flex items-center gap-2">
                            {/* Theme toggle */}
                            <button onClick={toggle}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-gray-500 hover:bg-[var(--bg-hover)] hover:text-gray-800 dark:hover:text-gray-100 transition-colors text-base"
                                title={isDark ? 'Light mode' : 'Dark mode'}>
                                {isDark ? '☀' : '◑'}
                            </button>

                            {/* User menu */}
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setUserMenu(!userMenu)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-hover)] hover:bg-[var(--border)] transition-colors text-sm">
                                    <div className="w-6 h-6 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-500 flex items-center justify-center text-xs font-semibold">
                                        {user?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-medium leading-tight">{user?.name}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] leading-tight">{user?.role?.display_name}</p>
                                    </div>
                                    <span className={`text-gray-400 text-sm transition-transform ${userMenu ? 'rotate-90' : ''}`}>›</span>
                                </button>

                                {userMenu && (
                                    <div className="absolute top-full right-0 mt-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl min-w-[170px] py-1 z-50">
                                        <Link href="/profile" onClick={() => setUserMenu(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--bg-hover)] transition-colors">
                                            <span>⊙</span> My Profile
                                        </Link>
                                        <div className="border-t border-[var(--border)] my-1" />
                                        <Link href="/logout" method="post" as="button"
                                            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <span>→</span> Sign Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 overflow-y-auto p-6 page-enter">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    )
}
