import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { FlashMessages, PageHeader } from '@/Components/shared/FlashMessages'
import { Card, Badge, Button, Table } from '@/Components/shared/UI'
import { usePermission } from '@/hooks/usePermission'

export default function RecipeShow({ recipe }) {
    const { can } = usePermission()

    const handleDelete = () => {
        if (!confirm('Delete this recipe?')) return
        router.delete(`/recipes/${recipe.id}`)
    }

    return (
        <AppLayout title={recipe.code}>
            <Head title={recipe.code} />
            <FlashMessages />

            <PageHeader title={
                <div className="flex items-center gap-3">
                    <Link href="/recipes"><Button variant="secondary">← Back</Button></Link>
                    <span className="font-serif text-2xl">{recipe.code}</span>
                    <Badge status={recipe.is_active ? 'active' : 'inactive'} />
                </div>
            }>
                <div className="flex gap-2">
                    {can('recipes.edit') && <Link href={`/recipes/${recipe.id}/edit`}><Button variant="secondary">Edit</Button></Link>}
                    {can('recipes.delete') && <Button variant="danger" onClick={handleDelete}>Delete</Button>}
                </div>
            </PageHeader>

            <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 300px', alignItems: 'start' }}>
                <div className="space-y-4">
                    {/* Recipe details */}
                    <Card>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Description</p>
                                <p className="text-sm">{recipe.description || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Status</p>
                                <p className="text-sm">{recipe.is_active ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Ingredients */}
                    <Card>
                        <h3 className="font-serif text-base mb-4">Ingredients</h3>
                        <Table
                            columns={[
                                { label: 'Code', render: r => <span className="font-mono text-xs">{r.code}</span> },
                                { label: 'Description', render: r => r.description },
                                { label: 'Quantity', render: r => r.quantity },
                                { label: 'UOM', render: r => r.uom },
                            ]}
                            data={recipe.ingredients || []}
                            empty="No ingredients added."
                        />
                    </Card>

                    {/* Methods */}
                    <Card>
                        <h3 className="font-serif text-base mb-4">Method Steps</h3>
                        <Table
                            columns={[
                                { label: 'Step', render: r => r.sequence },
                                { label: 'Instruction', render: r => r.method },
                            ]}
                            data={recipe.methods || []}
                            empty="No methods defined."
                        />
                    </Card>
                </div>

            </div>
        </AppLayout>
    )
}