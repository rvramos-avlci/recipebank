import { useState, useEffect } from 'react'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { FlashMessages, PageHeader, SearchBar } from '@/Components/shared/FlashMessages'
import { Card, Table, Badge, Button, Input, Select, FormGroup, Modal } from '@/Components/shared/UI'
import { usePermission } from '@/hooks/usePermission'

function UserAvatar({ name }) {
    return (
        <div className="w-8 h-8 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-500 flex items-center justify-center text-sm font-semibold">
            {name?.[0]?.toUpperCase()}
        </div>
    )
}

function UserModal({ open, onClose, user, roles }) {
    const isEdit = !!user
    const { data, setData, post, put, processing, errors, reset } = useForm({        
        name: '', 
        email: '', 
        role_id: '',
        password: '', 
        password_confirmation: '', 
        is_active:  true,
    })
    useEffect(() => {
        if (!open) return

        setData({
            name: user?.name ?? '',
            email: user?.email ?? '',
            role_id: user?.role_id ?? '',
            password: '',
            password_confirmation: '',
            is_active: user?.is_active ?? true,
        })
    }, [open, user])

    function submit(e) {
        e.preventDefault()
        if (isEdit) {
            put(`/users/${user.id}`, { onSuccess: () => { onClose(); reset() } })
        } else {
            post('/users', { onSuccess: () => { onClose(); reset() } })
        }
    }
    return (
        <Modal open={open}
            onClose={onClose}
            footer={<>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={submit} loading={processing}>{isEdit ? 'Update User' : 'Create User'}</Button>
            </>}
        >
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="Full Name *" error={errors.name}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Jane Doe" />
                    </FormGroup>
                    <FormGroup label="Email Address *" error={errors.email}>
                        <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="jane@company.com" />
                    </FormGroup>
                </div>
                <FormGroup label="Role *" error={errors.role_id}>
                    <Select value={data.role_id} onChange={e => setData('role_id', e.target.value)}>
                        <option value="">Select role…</option>
                        {roles.map(r => <option key={r.id} value={r.id}>{r.display_name}</option>)}
                    </Select>
                </FormGroup>
                <div className="grid grid-cols-2 gap-4">
                    <FormGroup label={isEdit ? 'New Password (blank = keep)' : 'Password *'} error={errors.password}>
                        <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min. 8 characters" />
                    </FormGroup>
                    <FormGroup label="Confirm Password" error={errors.password_confirmation}>
                        <Input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat password" />
                    </FormGroup>
                </div>
                {isEdit && (
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="accent-brand-500" />
                        Account is active
                    </label>
                )}
            </form>
        </Modal>
    )
}

export default function UsersIndex({ users, roles, filters }) {
    const { can } = usePermission()
    const { auth } = usePage().props
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]     = useState(null)
    const [search, setSearch]       = useState(filters.search ?? '')
    const [roleId, setRoleId]       = useState(filters.role_id ?? '')

    function applyFilter(overrides = {}) {
        router.get('/users', { search, role_id: roleId, ...overrides }, { preserveState: true, replace: true })
    }

    function openCreate() { setEditing(null); setShowModal(true) }
    function openEdit(u)  { setEditing(u);    setShowModal(true) }

    function toggleActive(u) {
        router.post(`/users/${u.id}/toggle-active`)
    }

    function deleteUser(u) {
        if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return
        router.delete(`/users/${u.id}`)
    }

    return (
        <AppLayout title="User Management">
            <Head title="Users" />
            <FlashMessages />
            <PageHeader title="User Management">
                {can('users.create') && <Button variant="primary" onClick={openCreate}>+ New User</Button>}
            </PageHeader>

            <SearchBar>
                <Input className="max-w-[260px]" placeholder="Search users…" value={search}
                    onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyFilter()} />
                <Select className="max-w-[160px]" value={roleId} onChange={e => { setRoleId(e.target.value); applyFilter({ role_id: e.target.value }) }}>
                    <option value="">All Roles</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.display_name}</option>)}
                </Select>
                <Button variant="secondary" onClick={() => applyFilter()}>Search</Button>
            </SearchBar>

            <Card className="p-0 overflow-hidden">
                <Table
                    columns={[
                        { label: 'Name', render: u => (
                            <div className="flex items-center gap-2.5">
                                <UserAvatar name={u.name} />
                                <div>
                                    <p className="font-medium">{u.name} {u.id === auth.user?.id && <span className="text-xs text-[var(--text-muted)]">(you)</span>}</p>
                                </div>
                            </div>
                        )},
                        { label: 'Email', render: u => <span className="font-mono text-xs">{u.email}</span> },
                        { label: 'Role',  render: u => u.role ? <Badge status={u.role.name}>{u.role.display_name}</Badge> : <span className="text-[var(--text-muted)] text-xs">—</span> },
                        { label: 'Status', render: u => <Badge status={u.is_active ? 'active' : 'inactive'}>{u.is_active ? 'Active' : 'Inactive'}</Badge> },
                        { label: 'Last Login', render: u => <span className="text-xs text-gray-500">{u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}</span> },
                        { label: 'Actions', render: u => (
                            <div className="flex items-center gap-1.5">
                                {can('users.edit') && <Button size="sm" onClick={() => openEdit(u)}>Edit</Button>}
                                {can('users.edit') && u.id !== auth.user?.id && (
                                    <Button size="sm" variant={u.is_active ? 'danger' : 'success'} onClick={() => toggleActive(u)}>
                                        {u.is_active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                )}
                                {can('users.delete') && u.id !== auth.user?.id && (
                                    <Button size="sm" variant="danger" onClick={() => deleteUser(u)}>Del</Button>
                                )}
                            </div>
                        )},
                    ]}
                    data={users.data}
                    empty="No users found."
                />
            </Card>

            <UserModal open={showModal} onClose={() => setShowModal(false)} user={editing} roles={roles} />
        </AppLayout>
    )
}
