// Components/shared/UI.jsx  – reusable primitives
import { forwardRef } from 'react'

/* ── Badge ─────────────────────────────────────────────────────────────── */
const badgeMap = {
    draft:               'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    sent:                'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    paid:                'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
    partially_paid:      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400',
    overdue:             'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    cancelled:           'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
    pending:             'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    confirmed:           'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    unallocated:         'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400',
    partially_allocated: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    fully_allocated:     'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
    active:              'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
    inactive:            'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
    admin:               'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    accountant:          'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    billing_clerk:       'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    viewer:              'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
}

export function Badge({ status, children }) {
    const cls = badgeMap[status] || 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${cls}`}>
            {children ?? status?.replace(/_/g, ' ')}
        </span>
    )
}

/* ── Button ────────────────────────────────────────────────────────────── */
const btnVariants = {
    primary:   'bg-brand-500 hover:bg-brand-600 text-white',
    secondary: 'bg-[var(--bg-hover)] hover:bg-[var(--border)] text-gray-800 dark:text-gray-100 border border-[var(--border)]',
    danger:    'bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-400 dark:bg-red-900/20 dark:hover:bg-red-500',
    success:   'bg-green-50 hover:bg-green-500 text-green-600 hover:text-white border border-green-500 dark:bg-green-900/20 dark:hover:bg-green-500',
    ghost:     'hover:bg-[var(--bg-hover)] text-gray-600 dark:text-gray-300',
}
const btnSizes = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-1.5',
    lg: 'px-5 py-2.5 text-sm gap-2',
}

export function Button({ variant='secondary', size='md', className='', disabled, loading, children, ...rest }) {
    return (
        <button
            {...rest}
            disabled={disabled || loading}
            className={`inline-flex items-center rounded-md font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-400/50 disabled:opacity-40 disabled:cursor-not-allowed
                ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
        >
            {loading && <span className="spinner" />}
            {children}
        </button>
    )
}

/* ── Input / Select / Textarea ─────────────────────────────────────────── */
const inputBase = `w-full rounded-md border border-[var(--border)] bg-[var(--bg-surface)]
    px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-[var(--text-muted)]
    focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-400/25
    transition-colors duration-150`

export const Input = forwardRef(({ className='', ...rest }, ref) => (
    <input ref={ref} className={`${inputBase} ${className}`} {...rest} />
))
Input.displayName = 'Input'

export const Select = forwardRef(({ className='', children, ...rest }, ref) => (
    <select ref={ref} className={`${inputBase} ${className}`} {...rest}>
        {children}
    </select>
))
Select.displayName = 'Select'

export const Textarea = forwardRef(({ className='', rows=3, ...rest }, ref) => (
    <textarea ref={ref} rows={rows} className={`${inputBase} resize-y ${className}`} {...rest} />
))
Textarea.displayName = 'Textarea'

export function FormGroup({ label, error, children, hint }) {
    return (
        <div>
            {label && (
                <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {label}
                </label>
            )}
            {children}
            {hint && <p className="mt-1 text-xs text-[var(--text-muted)]">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}

/* ── Card ──────────────────────────────────────────────────────────────── */
export function Card({ className='', children }) {
    return (
        <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 ${className}`}>
            {children}
        </div>
    )
}

/* ── Stat Card ─────────────────────────────────────────────────────────── */
export function StatCard({ label, value, sub, color='text-gray-900 dark:text-gray-100' }) {
    return (
        <Card>
            <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">{label}</p>
            <p className={`text-2xl font-serif ${color}`}>{value}</p>
            {sub && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{sub}</p>}
        </Card>
    )
}

/* ── Modal ─────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, size='md', children, footer }) {
    if (!open) return null
    const widths = { sm:'max-w-md', md:'max-w-xl', lg:'max-w-3xl', xl:'max-w-5xl' }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm" onClick={(e) => e.target===e.currentTarget && onClose()}>
            <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full ${widths[size]} max-h-[90vh] flex flex-col shadow-2xl animate-[modalIn_180ms_ease-out]`}
                style={{animation:'modalIn 180ms ease-out'}}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] flex-shrink-0">
                    <h3 className="text-lg font-serif">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none transition-colors">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">{children}</div>
                {footer && <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)] flex-shrink-0">{footer}</div>}
            </div>
        </div>
    )
}

/* ── Table ─────────────────────────────────────────────────────────────── */
export function Table({ columns, data, empty='No records found.' }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className={`px-4 py-2.5 text-left text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] border-b border-[var(--border)] ${col.className||''}`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {!data?.length ? (
                        <tr><td colSpan={columns.length} className="text-center py-16 text-[var(--text-muted)] text-sm">{empty}</td></tr>
                    ) : data.map((row, ri) => (
                        <tr key={ri} className="hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--border)] last:border-0">
                            {columns.map((col, ci) => (
                                <td key={ci} className={`px-4 py-3 text-sm ${col.tdClassName||''}`}>
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

/* ── Alert ─────────────────────────────────────────────────────────────── */
export function Alert({ type='info', children }) {
    const styles = {
        info:    'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300',
        warning: 'bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-500 dark:text-yellow-300',
        error:   'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300',
        success: 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300',
    }
    const icons = { info:'ℹ', warning:'⚠', error:'✕', success:'✓' }
    return (
        <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border text-sm ${styles[type]}`}>
            <span>{icons[type]}</span>
            <span>{children}</span>
        </div>
    )
}

/* ── Empty State ───────────────────────────────────────────────────────── */
export function EmptyState({ icon='◻', text }) {
    return (
        <div className="text-center py-16 text-[var(--text-muted)]">
            <div className="text-4xl mb-3">{icon}</div>
            <p className="text-sm">{text}</p>
        </div>
    )
}

/* ── Pagination ────────────────────────────────────────────────────────── */
export function Pagination({ meta, onPage }) {
    if (!meta || meta.last_page <= 1) return null
    return (
        <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-muted)]">
            <span>Showing {meta.from}–{meta.to} of {meta.total}</span>
            <div className="flex gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => onPage(p)}
                        className={`w-7 h-7 rounded text-xs border transition-colors ${
                            p === meta.current_page
                                ? 'bg-brand-500 text-white border-brand-500'
                                : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-gray-600 dark:text-gray-300'
                        }`}
                    >{p}</button>
                ))}
            </div>
        </div>
    )
}

/* ── Amount formatter ──────────────────────────────────────────────────── */
export function fmt(v) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(v || 0)
}

export function Amount({ value, positive, negative, className='' }) {
    const color = positive ? 'text-green-500' : negative ? 'text-red-400' : ''
    return <span className={`tabular-nums ${color} ${className}`}>{fmt(value)}</span>
}
