import { Head, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { FlashMessages, PageHeader } from '@/Components/shared/FlashMessages'
import { Card, Button, Input, FormGroup, Alert, Badge } from '@/Components/shared/UI'
import { usePage } from '@inertiajs/react'

export default function Profile() {
    const { auth } = usePage().props
    const user = auth.user

    const profileForm = useForm({ name: user.name, email: user.email })
    const passwordForm = useForm({ current_password: '', new_password: '', new_password_confirmation: '' })

    function submitProfile(e) {
        e.preventDefault()
        profileForm.put('/profile')
    }

    function submitPassword(e) {
        e.preventDefault()
        passwordForm.put('/profile', {
            onSuccess: () => passwordForm.reset(),
        })
    }

    return (
        <AppLayout title="My Profile">
            <Head title="My Profile" />
            <FlashMessages />
            <PageHeader title="My Profile" />

            <div className="max-w-2xl space-y-5">
                {/* Profile info card */}
                <Card>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 rounded-full bg-brand-500/15 border-2 border-brand-500/30 text-brand-500 flex items-center justify-center text-2xl font-serif">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-serif">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="mt-1.5">
                                {user.role ? <Badge status={user.role.name}>{user.role.display_name}</Badge> : <span className="text-xs text-[var(--text-muted)]">No role assigned</span>}
                            </div>
                        </div>
                    </div>

                    <h4 className="text-[11px] uppercase tracking-widest font-semibold text-gray-500 mb-4">My Profile</h4>
                    <form onSubmit={submitProfile} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormGroup label="Full Name" error={profileForm.errors.name}>
                                <Input value={profileForm.data.name} onChange={e => profileForm.setData('name', e.target.value)} disabled />
                            </FormGroup>
                            <FormGroup label="Email Address" error={profileForm.errors.email}>
                                <Input type="email" value={profileForm.data.email} onChange={e => profileForm.setData('email', e.target.value)} disabled/>
                            </FormGroup>
                        </div>
                        {/* <Button variant="primary" type="submit" loading={profileForm.processing}>Save Profile</Button> */}
                    </form>
                </Card>

                {/* Change password */}
                <Card>
                    <h4 className="text-[11px] uppercase tracking-widest font-semibold text-gray-500 mb-4">Change Password</h4>
                    <form onSubmit={submitPassword} className="space-y-4">
                        <FormGroup label="Current Password" error={passwordForm.errors.current_password}>
                            <Input type="password" value={passwordForm.data.current_password}
                                onChange={e => passwordForm.setData('current_password', e.target.value)}
                                placeholder="Enter current password" />
                        </FormGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <FormGroup label="New Password" error={passwordForm.errors.new_password}>
                                <Input type="password" value={passwordForm.data.new_password}
                                    onChange={e => passwordForm.setData('new_password', e.target.value)}
                                    placeholder="Min. 8 characters" />
                            </FormGroup>
                            <FormGroup label="Confirm New Password" error={passwordForm.errors.new_password_confirmation}>
                                <Input type="password" value={passwordForm.data.new_password_confirmation}
                                    onChange={e => passwordForm.setData('new_password_confirmation', e.target.value)}
                                    placeholder="Repeat new password" />
                            </FormGroup>
                        </div>
                        <Button variant="primary" type="submit" loading={passwordForm.processing}>Change Password</Button>
                    </form>
                </Card>

                {/* Permissions */}
                <Card>
                    <h4 className="text-[11px] uppercase tracking-widest font-semibold text-gray-500 mb-4">
                        My Permissions
                        <span className="ml-2 font-normal normal-case tracking-normal text-[var(--text-muted)]">
                            ({user.permission_details?.length || 0} total)
                        </span>
                    </h4>

                    {user.role?.name === 'admin' && (
                        <div className="mb-3">
                            <Alert type="error">You are an Administrator with unrestricted access to all features.</Alert>
                        </div>
                    )}

                    {user.permission_details?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {user.permission_details.map(perm => (
                                <span key={perm.name} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-brand-500/10 text-brand-500 dark:text-brand-400 border border-brand-500/20">
                                    {perm.display_name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--text-muted)]">No permissions assigned.</p>
                    )}
                </Card>
            </div>
        </AppLayout>
    )
}
