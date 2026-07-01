import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { usePage } from '@inertiajs/react'

export default function Forbidden() {
    const { auth } = usePage().props

    return (
        <AppLayout title="Access Denied">
            <Head title="403 – Access Denied" />
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-10 py-14">
                    <div className="font-serif text-8xl text-red-400/30 mb-4 leading-none">403</div>
                    <h2 className="font-serif text-2xl mb-3">Access Denied</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        You don't have permission to view this page.<br />
                        Contact your administrator if you believe this is a mistake.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => window.history.back()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--bg-hover)] hover:bg-[var(--border)] border border-[var(--border)] rounded-md text-sm font-medium transition-colors">
                            ← Go Back
                        </button>
                        <Link href="/dashboard"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-md text-sm font-medium transition-colors">
                            Dashboard
                        </Link>
                    </div>
                    {auth?.user?.role && (
                        <p className="mt-6 text-xs text-[var(--text-muted)]">
                            Your role: <strong>{auth.user.role.display_name}</strong>
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
