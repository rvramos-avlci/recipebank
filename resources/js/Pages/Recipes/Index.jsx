import { useRef, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { FlashMessages, PageHeader, SearchBar } from '@/Components/shared/FlashMessages'
import { Card, Table, Badge, Button, Input, Select, Pagination } from '@/Components/shared/UI'
import { usePermission } from '@/hooks/usePermission'

export default function RecipesIndex({ recipes, filters }) {
    const { can } = usePermission()
    const [search, setSearch] = useState(filters.search ?? '')
    const [isActive, setIsActive] = useState(filters.is_active ?? '')
    const [importing, setImporting] = useState(false)
    const fileInputRef = useRef(null)

    function applyFilter(overrides = {}) {
        router.get('/recipes', { search, is_active: isActive, ...overrides }, { preserveState: true, replace: true })
    }

    function handleDelete(recipe) {
        if (!confirm(`Delete recipe ${recipe.code}?`)) return
        router.delete(`/recipes/${recipe.id}`)
    }

    function handleImportChange(e) {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        setImporting(true)
        router.post('/recipes/import', formData, {
            forceFormData: true,
            onFinish: () => {
                setImporting(false)
                e.target.value = ''
            },
        })
    }

    return (
        <AppLayout title="Recipes">
            <Head title="Recipes" />
            <FlashMessages />
            <PageHeader title="Recipes">
                {can('recipes.view') && (
                    <a href={`/recipes/export?${new URLSearchParams({ search, is_active: isActive })}`}>
                        <Button variant="secondary">Export CSV</Button>
                    </a>
                )}
                {can('recipes.create') && (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onChange={handleImportChange}
                        />
                        <Button variant="secondary" loading={importing} onClick={() => fileInputRef.current?.click()}>
                            Import CSV
                        </Button>
                        <Link href="/recipes/create">
                            <Button variant="primary">+ New Recipe</Button>
                        </Link>
                    </>
                )}
            </PageHeader>

            <SearchBar>
                <Input
                    className="max-w-[240px]"
                    placeholder="Search recipe code…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilter()}
                />
                <Select
                    className="max-w-[160px]"
                    value={isActive}
                    onChange={e => { setIsActive(e.target.value); applyFilter({ is_active: e.target.value }) }}
                >
                    <option value="">All Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </Select>
                <Button variant="secondary" onClick={() => applyFilter()}>Search</Button>
            </SearchBar>

            <Card className="p-0 overflow-hidden">
                <Table
                    columns={[
                        { label: 'Code', render: r => <Link href={`/recipes/${r.id}`} className="font-mono text-xs text-brand-500 hover:underline">{r.code}</Link> },
                        { label: 'Description', render: r => r.description },
                        { label: 'Status', render: r => <Badge status={r.is_active ? 'active' : 'inactive'} /> },
                        { label: 'Actions', render: r => (
                            <div className="flex items-center gap-1.5">
                                <Link href={`/recipes/${r.id}`}><Button size="sm">View</Button></Link>
                                {can('recipes.edit') && <Link href={`/recipes/${r.id}/edit`}><Button size="sm">Edit</Button></Link>}
                                {can('recipes.delete') && <Button size="sm" variant="danger" onClick={() => handleDelete(r)}>Del</Button>}
                            </div>
                        )},
                    ]}
                    data={recipes.data}
                    empty="No recipes found."
                />

                <div className="px-4 pb-4">
                <Pagination
                    meta={recipes}
                    onPage={p =>
                    router.get('/recipes', { ...filters, page : p})
                    }
                    labels={{
                    previous: 'Previous',
                    next: 'Next',
                    first: 'First',
                    last: 'Last',
                    }}
                    className="space-x-2"
                />
                </div>                
            </Card>
        </AppLayout>
    )
}
