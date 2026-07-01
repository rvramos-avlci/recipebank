import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { FlashMessages } from '@/Components/shared/FlashMessages'
import { Card, StatCard, Badge, Table, Amount, fmt } from '@/Components/shared/UI'
import { usePermission } from '@/hooks/usePermission'

export default function Dashboard({ stats }) {
    const { can, user } = usePermission()
    const today = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const firstName = user?.name?.split(' ')[0]

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />
            <FlashMessages />

            {/* Greeting */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-serif">Welcome back, {firstName} 👋</h2>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">{today}</p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Recipes"
                    value="0"
                    sub=""
                    color="text-red-400"
                />
                <StatCard
                    label="1"
                    value=""
                    sub=""
                    color="text-green-500"
                />
                <StatCard
                    label="2"
                    value=""
                    sub=""
                    color="text-red-400"
                />
                <StatCard
                    label="3"
                    value=""
                    sub=""
                    color="text-brand-500"
                />
            </div>
        </AppLayout>
    )
}
