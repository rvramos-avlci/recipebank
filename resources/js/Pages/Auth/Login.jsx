import { useForm, Head } from '@inertiajs/react'
import { useTheme } from '@/hooks/useTheme'
import { Button, Input, FormGroup, Alert } from '@/Components/shared/UI'

const DEMO_ACCOUNTS = [
    { email: 'admin@softdev.com',      password: 'password', role: 'Admin',         color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
    { email: 'viewer@softdev.com',     password: 'password', role: 'Viewer',        color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
]

export default function Login() {
    const { isDark, toggle } = useTheme()
    const { data, setData, post, processing, errors } = useForm({
        email: '', password: '', remember: false,
    })

    function submit(e) {
        e.preventDefault()
        post('/login')
    }

    function prefill(account) {
        setData({ email: account.email, password: account.password, remember: false })
    }

    return (
        <>
            <Head title="Sign In" />
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] p-6 relative">
                {/* Theme toggle */}
                <button
                    onClick={toggle}
                    className="fixed top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-gray-500 hover:bg-[var(--bg-hover)] transition-colors text-lg"
                >
                    {isDark ? '☀' : '◑'}
                </button>

                <div className="w-full max-w-[420px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-10 shadow-2xl">
                    {/* Brand */}
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-brand-500 text-2xl">◈</span>
                        <span className="font-serif text-2xl">SoftDev</span>
                    </div>

                    <h1 className="text-xl font-serif mb-1">Sign in to your account</h1>
                    <p className="text-sm text-[var(--text-muted)] mb-7">Billing Management System</p>

                    {errors.email && (
                        <div className="mb-5">
                            <Alert type="error">{errors.email}</Alert>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <FormGroup label="Email address" error={errors.email}>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="you@company.com"
                                autoComplete="email"
                                disabled={processing}
                            />
                        </FormGroup>

                        <FormGroup label="Password" error={errors.password}>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                disabled={processing}
                            />
                        </FormGroup>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full justify-center mt-2"
                            loading={processing}
                            disabled={processing}
                        >
                            Sign in
                        </Button>
                    </form>

                </div>
            </div>
        </>
    )
}
