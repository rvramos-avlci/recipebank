import { useState, useEffect } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { FlashMessages, PageHeader } from '@/Components/shared/FlashMessages'
import { Card, Button, Modal, Input, FormGroup, Textarea, Alert } from '@/Components/shared/UI'
import { usePermission } from '@/hooks/usePermission'

function PermChip({ active, children }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border transition-colors ${
            active
                ? 'bg-brand-500/15 border-brand-500/30 text-brand-500 dark:text-brand-400'
                : 'bg-[var(--bg-hover)] border-[var(--border)] text-[var(--text-muted)]'
        }`}>
            <span>{active ? '✓' : '○'}</span>
            {children}
        </span>
    )
}

function RoleModal({ open, onClose, role, allPermissions }) {
    const isEdit = !!role
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        display_name: '',
        description: '',
        permissions: [],
    })
    useEffect(() => {
        if (!open) return
        setData({
            name: role?.name ?? '',
            display_name: role?.display_name ?? '',
            description: role?.description ?? '',
            permissions: role?.permissions?.map(p => p.name) ?? [],
        })
    }, [open, role])
    const allPermsFlat = Object.values(allPermissions).flat()

    function togglePerm(permName) {
        setData('permissions', data.permissions.includes(permName)
            ? data.permissions.filter(p => p !== permName)
            : [...data.permissions, permName]
        )
    }

    function toggleGroup(perms, checked) {
        const names = perms.map(p => p.name)
        if (checked) {
            const merged = [...new Set([...data.permissions, ...names])]
            setData('permissions', merged)
        } else {
            setData('permissions', data.permissions.filter(p => !names.includes(p)))
        }
    }

    function selectAll()  { setData('permissions', allPermsFlat.map(p => p.name)) }
    function clearAll()   { setData('permissions', []) }

    function submit(e) {
        e.preventDefault()
        if (isEdit) {
            put(`/roles/${role.id}`, { onSuccess: () => { onClose(); reset() } })
        } else {
            post('/roles', { onSuccess: () => { onClose(); reset() } })
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Role' : 'New Role'} size="xl"
            footer={<>
                <span className="flex-1 text-sm text-[var(--text-muted)]">{data.permissions.length} permission(s) selected</span>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={submit} loading={processing}>{isEdit ? 'Update Role' : 'Create Role'}</Button>
            </>}
        >
            <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="Role Name *" error={errors.name} hint={isEdit ? undefined : 'Slug: lowercase, no spaces'}>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. billing_manager" disabled={isEdit} />
                    </FormGroup>
                    <FormGroup label="Display Name *" error={errors.display_name}>
                        <Input value={data.display_name} onChange={e => setData('display_name', e.target.value)} placeholder="e.g. Billing Manager" />
                    </FormGroup>
                </div>
                <FormGroup label="Description">
                    <Input value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Brief description…" />
                </FormGroup>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">Permissions</p>
                        <div className="flex gap-2">
                            <Button type="button" size="sm" variant="secondary" onClick={selectAll}>Select All</Button>
                            <Button type="button" size="sm" variant="secondary" onClick={clearAll}>Clear All</Button>
                        </div>
                    </div>
                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                        {Object.entries(allPermissions).map(([group, perms]) => {
                            const checked = perms.every(p => data.permissions.includes(p.name))
                            const indeterminate = !checked && perms.some(p => data.permissions.includes(p.name))
                            return (
                                <div key={group}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            ref={el => { if (el) el.indeterminate = indeterminate }}
                                            onChange={e => toggleGroup(perms, e.target.checked)}
                                            className="accent-brand-500 w-3.5 h-3.5"
                                        />
                                        <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-500">{group}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pl-5">
                                        {perms.map(perm => (
                                            <label key={perm.name} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs cursor-pointer border transition-all ${
                                                data.permissions.includes(perm.name)
                                                    ? 'bg-brand-500/15 border-brand-500/30 text-brand-500 dark:text-brand-400'
                                                    : 'bg-[var(--bg-surface)] border-[var(--border)] text-gray-500 hover:bg-[var(--bg-hover)]'
                                            }`}>
                                                <input type="checkbox" className="sr-only" checked={data.permissions.includes(perm.name)} onChange={() => togglePerm(perm.name)} />
                                                <span>{data.permissions.includes(perm.name) ? '✓' : '○'}</span>
                                                {perm.display_name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default function RolesIndex({ roles, permissions: allPermissions }) {
    const { can } = usePermission()
    const [selectedRole, setSelectedRole] = useState(roles[0] ?? null)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing]     = useState(null)

    function openCreate() { setEditing(null); setShowModal(true) }
    function openEdit(r)  { setEditing(r);    setShowModal(true) }

    function deleteRole(r) {
        if (!confirm(`Delete role "${r.display_name}"?`)) return
        router.delete(`/roles/${r.id}`, { onSuccess: () => setSelectedRole(roles[0] ?? null) })
    }

    const hasPermission = (role, name) => {
        if (role?.name === 'admin') return true
        return role?.permissions?.some(p => p.name === name)
    }

    return (
        <AppLayout title="Roles & Permissions">
            <Head title="Roles & Permissions" />
            <FlashMessages />
            <PageHeader title="Roles & Permissions">
                {can('roles.manage') && <Button variant="primary" onClick={openCreate}>+ New Role</Button>}
            </PageHeader>

            <div className="grid gap-5" style={{ gridTemplateColumns: '280px 1fr', alignItems: 'start' }}>
                {/* Role list */}
                <Card className="p-0 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--border)] text-[11px] uppercase tracking-widest font-semibold text-[var(--text-muted)]">Roles</div>
                    {roles.map(role => (
                        <button key={role.id} onClick={() => setSelectedRole(role)}
                            className={`w-full text-left px-4 py-3 border-b border-[var(--border)] last:border-0 transition-colors ${
                                selectedRole?.id === role.id
                                    ? 'bg-brand-500/10 border-l-2 border-brand-500 pl-3.5'
                                    : 'hover:bg-[var(--bg-hover)]'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{role.display_name}</p>
                                    <p className="text-xs text-[var(--text-muted)] font-mono">{role.name}</p>
                                </div>
                                <span className="text-xs text-[var(--text-muted)]">{role.users_count} user{role.users_count !== 1 ? 's' : ''}</span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-1">{role.permissions?.length || 0} permissions</p>
                        </button>
                    ))}
                </Card>

                {/* Role detail */}
                {selectedRole ? (
                    <Card>
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h3 className="font-serif text-xl mb-1">{selectedRole.display_name}</h3>
                                <p className="text-xs text-[var(--text-muted)] font-mono">{selectedRole.name}</p>
                                {selectedRole.description && <p className="text-sm text-gray-500 mt-1">{selectedRole.description}</p>}
                            </div>
                            {can('roles.manage') && selectedRole.name !== 'admin' && (
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => openEdit(selectedRole)}>Edit Role</Button>
                                    <Button size="sm" variant="danger" onClick={() => deleteRole(selectedRole)} disabled={selectedRole.users_count > 0}>Delete</Button>
                                </div>
                            )}
                        </div>

                        {selectedRole.name === 'admin' && (
                            <div className="mb-5">
                                <Alert type="warning">The Admin role has all permissions and cannot be modified.</Alert>
                            </div>
                        )}

                        {/* Permissions by group */}
                        {Object.entries(allPermissions).map(([group, perms]) => (
                            <div key={group} className="mb-5">
                                <div className="flex items-center gap-3 mb-2.5">
                                    <span className="text-[11px] uppercase tracking-widest font-semibold text-[var(--text-muted)]">{group}</span>
                                    <div className="flex-1 h-px bg-[var(--border)]" />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {perms.map(perm => (
                                        <PermChip key={perm.name} active={hasPermission(selectedRole, perm.name)}>
                                            {perm.display_name}
                                        </PermChip>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Card>
                ) : (
                    <Card className="flex items-center justify-center h-48">
                        <div className="text-center text-[var(--text-muted)]">
                            <div className="text-3xl mb-2">⊛</div>
                            <p className="text-sm">Select a role to view permissions</p>
                        </div>
                    </Card>
                )}
            </div>

            <RoleModal open={showModal} onClose={() => setShowModal(false)} role={editing} allPermissions={allPermissions} />
        </AppLayout>
    )
}
