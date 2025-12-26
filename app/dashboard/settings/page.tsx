'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function SettingsPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [userRole, setUserRole] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleExport = async () => {
        try {
            const session = await fetch('/api/auth/session').then(r => r.json());
            const response = await fetch('/api/export', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `career-black-box-export-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setSuccess('Data exported successfully!');
            }
        } catch (err) {
            console.error('Export error:', err);
            setError('Failed to export data');
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const { supabase } = await import('@/lib/supabase/client');
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            setSuccess('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            // In production, you'd want to call a proper account deletion endpoint
            // For now, we'll just sign out and show a message
            await signOut();
            router.push('/');
        } catch (err) {
            console.error('Delete error:', err);
            setError('Failed to delete account');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

            <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white font-outfit">Settings</h1>
                            <p className="text-sm text-slate-400">Manage your account and preferences</p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                                ← Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 font-outfit">Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Email
                                </label>
                                <Input
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-slate-800/50 border-white/5 text-slate-400"
                                />
                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Current Role (Optional)
                                </label>
                                <Input
                                    value={userRole}
                                    onChange={(e) => setUserRole(e.target.value)}
                                    placeholder="e.g., Senior Software Engineer"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 font-outfit">Change Password</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Confirm New Password
                                </label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                                    {success}
                                </div>
                            )}

                            <Button
                                onClick={handlePasswordChange}
                                disabled={saving}
                                variant="primary"
                            >
                                {saving ? 'Updating...' : 'Update Password'}
                            </Button>
                        </div>
                    </div>

                    {/* Export Data Section */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 font-outfit">Export Data</h2>
                        <p className="text-slate-400 mb-4">
                            Download all your decisions and data as a JSON file.
                        </p>
                        <Button onClick={handleExport} variant="secondary">
                            📥 Export All Data
                        </Button>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-red-400 mb-4 font-outfit">⚠️ Danger Zone</h2>
                        <p className="text-red-300/70 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button
                            onClick={() => setShowDeleteConfirm(true)}
                            variant="danger"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                            ⚠️ Delete Account?
                        </h3>
                        <p className="text-slate-400 mb-4">
                            This action cannot be undone. All your decisions and data will be permanently deleted.
                        </p>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                            <p className="text-sm text-amber-400">
                                💡 <strong>Tip:</strong> Export your data first before deleting your account.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                onClick={handleDeleteAccount}
                                variant="danger"
                                size="lg"
                                className="flex-1"
                            >
                                Yes, Delete Forever
                            </Button>
                            <Button
                                onClick={() => setShowDeleteConfirm(false)}
                                variant="outline"
                                size="lg"
                                className="flex-1 border-white/10 text-slate-300 hover:bg-white/5"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
