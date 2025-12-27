'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, AlertTriangle, Lightbulb, Trash2, MessageSquare, Copy, Check, RefreshCw, Unlink, Github } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FadeIn } from '@/components/ui/FadeIn';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const [userRole, setUserRole] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Slack integration state
    const [slackStatus, setSlackStatus] = useState<'loading' | 'unlinked' | 'pending' | 'linked'>('loading');
    const [slackLinkCode, setSlackLinkCode] = useState('');
    const [slackExpiresAt, setSlackExpiresAt] = useState('');
    const [slackLinkedAt, setSlackLinkedAt] = useState('');
    const [copiedCode, setCopiedCode] = useState(false);
    const [generatingCode, setGeneratingCode] = useState(false);

    // GitHub integration state
    const [githubStatus, setGithubStatus] = useState<'loading' | 'unlinked' | 'pending' | 'linked'>('loading');
    const [githubLinkCode, setGithubLinkCode] = useState('');
    const [githubExpiresAt, setGithubExpiresAt] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [githubLinkedAt, setGithubLinkedAt] = useState('');
    const [copiedGithubCode, setCopiedGithubCode] = useState(false);
    const [generatingGithubCode, setGeneratingGithubCode] = useState(false);

    // Fetch Slack link status on mount
    useEffect(() => {
        fetchSlackStatus();
        fetchGithubStatus();
    }, []);

    const fetchSlackStatus = async () => {
        try {
            const response = await fetch('/api/slack/link');
            if (response.ok) {
                const data = await response.json();
                setSlackStatus(data.status);
                if (data.link_code) setSlackLinkCode(data.link_code);
                if (data.expires_at) setSlackExpiresAt(data.expires_at);
                if (data.linked_at) setSlackLinkedAt(data.linked_at);
            }
        } catch (err) {
            console.error('Failed to fetch Slack status:', err);
            setSlackStatus('unlinked');
        }
    };

    const generateSlackCode = async () => {
        setGeneratingCode(true);
        try {
            const response = await fetch('/api/slack/link', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                setSlackStatus('pending');
                setSlackLinkCode(data.link_code);
                setSlackExpiresAt(data.expires_at);
                showToast('Link code generated!', 'success');
            } else {
                showToast('Failed to generate code', 'error');
            }
        } catch (err) {
            showToast('Failed to generate code', 'error');
        } finally {
            setGeneratingCode(false);
        }
    };

    const unlinkSlack = async () => {
        try {
            const response = await fetch('/api/slack/link', { method: 'DELETE' });
            if (response.ok) {
                setSlackStatus('unlinked');
                setSlackLinkCode('');
                setSlackLinkedAt('');
                showToast('Slack unlinked', 'success');
            }
        } catch (err) {
            showToast('Failed to unlink Slack', 'error');
        }
    };

    const copyLinkCode = () => {
        navigator.clipboard.writeText(slackLinkCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    // GitHub integration functions
    const fetchGithubStatus = async () => {
        try {
            const response = await fetch('/api/github/link');
            if (response.ok) {
                const data = await response.json();
                if (data.linked) {
                    setGithubStatus('linked');
                    setGithubUsername(data.githubUsername || '');
                    setGithubLinkedAt(data.linkedAt || '');
                } else if (data.linkCode) {
                    setGithubStatus('pending');
                    setGithubLinkCode(data.linkCode);
                    setGithubExpiresAt(data.linkCodeExpiresAt || '');
                } else {
                    setGithubStatus('unlinked');
                }
            } else {
                setGithubStatus('unlinked');
            }
        } catch (err) {
            console.error('Failed to fetch GitHub status:', err);
            setGithubStatus('unlinked');
        }
    };

    const generateGithubCode = async () => {
        setGeneratingGithubCode(true);
        try {
            const response = await fetch('/api/github/link', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                setGithubStatus('pending');
                setGithubLinkCode(data.code);
                setGithubExpiresAt(data.expiresAt);
                showToast('GitHub link code generated!', 'success');
            } else {
                showToast('Failed to generate code', 'error');
            }
        } catch (err) {
            showToast('Failed to generate code', 'error');
        } finally {
            setGeneratingGithubCode(false);
        }
    };

    const unlinkGithub = async () => {
        try {
            const response = await fetch('/api/github/link', { method: 'DELETE' });
            if (response.ok) {
                setGithubStatus('unlinked');
                setGithubLinkCode('');
                setGithubUsername('');
                setGithubLinkedAt('');
                showToast('GitHub unlinked', 'success');
            }
        } catch (err) {
            showToast('Failed to unlink GitHub', 'error');
        }
    };

    const copyGithubLinkCode = () => {
        navigator.clipboard.writeText(githubLinkCode);
        setCopiedGithubCode(true);
        setTimeout(() => setCopiedGithubCode(false), 2000);
    };

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
                showToast('Data exported successfully!', 'success');
            }
        } catch (err) {
            console.error('Export error:', err);
            showToast('Failed to export data', 'error');
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

            showToast('Password updated successfully!', 'success');
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
            await signOut();
            router.push('/');
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete account', 'error');
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
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="space-y-6">
                    {/* Profile Section */}
                    <FadeIn>
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
                    </FadeIn>

                    {/* Password Section */}
                    <FadeIn delay={0.1}>
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
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm"
                                    >
                                        {success}
                                    </motion.div>
                                )}

                                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                    <Button
                                        onClick={handlePasswordChange}
                                        disabled={saving}
                                        variant="primary"
                                    >
                                        {saving ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Export Data Section */}
                    <FadeIn delay={0.2}>
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 font-outfit">Export Data</h2>
                            <p className="text-slate-400 mb-4">
                                Download all your decisions and data as a JSON file.
                            </p>
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button onClick={handleExport} variant="secondary">
                                    <Download className="w-4 h-4 mr-2" /> Export All Data
                                </Button>
                            </motion.div>
                        </div>
                    </FadeIn>

                    {/* Slack Integration Section */}
                    <FadeIn delay={0.25}>
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-[#4A154B] rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white font-outfit">Slack Integration</h2>
                                    <p className="text-sm text-slate-400">Log decisions directly from Slack</p>
                                </div>
                            </div>

                            {slackStatus === 'loading' && (
                                <div className="text-slate-400">Loading...</div>
                            )}

                            {slackStatus === 'linked' && (
                                <div className="space-y-4">
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-green-400">
                                            <Check className="w-5 h-5" />
                                            <span className="font-medium">Connected to Slack</span>
                                        </div>
                                        <p className="text-sm text-green-300/70 mt-1">
                                            Linked {slackLinkedAt ? new Date(slackLinkedAt).toLocaleDateString() : 'recently'}
                                        </p>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        Use <code className="bg-slate-800 px-2 py-0.5 rounded text-violet-400">/logdecision</code> in Slack to log decisions.
                                    </p>
                                    <Button onClick={unlinkSlack} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                                        <Unlink className="w-4 h-4 mr-2" /> Unlink Slack
                                    </Button>
                                </div>
                            )}

                            {slackStatus === 'pending' && (
                                <div className="space-y-4">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                        <p className="text-amber-400 font-medium mb-2">Enter this code in Slack:</p>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-800 px-4 py-2 rounded-lg text-2xl font-mono text-white tracking-widest">
                                                {slackLinkCode}
                                            </code>
                                            <Button onClick={copyLinkCode} variant="ghost" size="sm">
                                                {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        <p className="text-sm text-amber-300/70 mt-2">
                                            Expires in {slackExpiresAt ? Math.max(0, Math.round((new Date(slackExpiresAt).getTime() - Date.now()) / 60000)) : 15} minutes
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-slate-300 text-sm">In Slack, type:</p>
                                        <code className="text-violet-400 text-sm">/logdecision link {slackLinkCode}</code>
                                    </div>
                                    <Button onClick={generateSlackCode} variant="outline" disabled={generatingCode}>
                                        <RefreshCw className={`w-4 h-4 mr-2 ${generatingCode ? 'animate-spin' : ''}`} />
                                        Generate New Code
                                    </Button>
                                </div>
                            )}

                            {slackStatus === 'unlinked' && (
                                <div className="space-y-4">
                                    <p className="text-slate-400">
                                        Connect your Slack account to log decisions with <code className="bg-slate-800 px-2 py-0.5 rounded text-violet-400">/logdecision</code>.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                        <Button onClick={generateSlackCode} variant="primary" disabled={generatingCode}>
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            {generatingCode ? 'Generating...' : 'Connect Slack'}
                                        </Button>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </FadeIn>

                    {/* GitHub Integration Section */}
                    <FadeIn delay={0.27}>
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <Github className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white font-outfit">GitHub Integration</h2>
                                    <p className="text-sm text-slate-400">Capture decisions from PR comments</p>
                                </div>
                            </div>

                            {githubStatus === 'loading' && (
                                <div className="text-slate-400">Loading...</div>
                            )}

                            {githubStatus === 'linked' && (
                                <div className="space-y-4">
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-green-400">
                                            <Check className="w-5 h-5" />
                                            <span className="font-medium">Connected to GitHub</span>
                                        </div>
                                        <p className="text-sm text-green-300/70 mt-1">
                                            @{githubUsername} • Linked {githubLinkedAt ? new Date(githubLinkedAt).toLocaleDateString() : 'recently'}
                                        </p>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        Comment <code className="bg-slate-800 px-2 py-0.5 rounded text-violet-400">@blackbox</code> on any PR to capture a decision.
                                    </p>
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-slate-300 text-sm mb-2">Example PR comment:</p>
                                        <code className="text-violet-400 text-xs">@blackbox Decided to use Redis for caching because...</code>
                                    </div>
                                    <Button onClick={unlinkGithub} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                                        <Unlink className="w-4 h-4 mr-2" /> Unlink GitHub
                                    </Button>
                                </div>
                            )}

                            {githubStatus === 'pending' && (
                                <div className="space-y-4">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                        <p className="text-amber-400 font-medium mb-2">Your link code:</p>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-800 px-4 py-2 rounded-lg text-2xl font-mono text-white tracking-widest">
                                                {githubLinkCode}
                                            </code>
                                            <Button onClick={copyGithubLinkCode} variant="ghost" size="sm">
                                                {copiedGithubCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        <p className="text-sm text-amber-300/70 mt-2">
                                            Expires in {githubExpiresAt ? Math.max(0, Math.round((new Date(githubExpiresAt).getTime() - Date.now()) / 60000)) : 15} minutes
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-slate-300 text-sm mb-2">To complete linking, use our Chrome extension on GitHub or call:</p>
                                        <code className="text-violet-400 text-xs block">POST /api/github/verify</code>
                                        <code className="text-slate-500 text-xs block mt-1">{'{ linkCode, githubUserId, githubUsername }'}</code>
                                    </div>
                                    <Button onClick={generateGithubCode} variant="outline" disabled={generatingGithubCode}>
                                        <RefreshCw className={`w-4 h-4 mr-2 ${generatingGithubCode ? 'animate-spin' : ''}`} />
                                        Generate New Code
                                    </Button>
                                </div>
                            )}

                            {githubStatus === 'unlinked' && (
                                <div className="space-y-4">
                                    <p className="text-slate-400">
                                        Connect your GitHub account to capture decisions when you comment <code className="bg-slate-800 px-2 py-0.5 rounded text-violet-400">@blackbox</code> on PRs and issues.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                        <Button onClick={generateGithubCode} variant="primary" disabled={generatingGithubCode}>
                                            <Github className="w-4 h-4 mr-2" />
                                            {generatingGithubCode ? 'Generating...' : 'Connect GitHub'}
                                        </Button>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </FadeIn>

                    {/* Danger Zone */}
                    <FadeIn delay={0.3}>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-red-400 mb-4 font-outfit flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Danger Zone
                            </h2>
                            <p className="text-red-300/70 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    variant="danger"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                                </Button>
                            </motion.div>
                        </div>
                    </FadeIn>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-md mx-4 shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-2 font-outfit flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" /> Delete Account?
                        </h3>
                        <p className="text-slate-400 mb-4">
                            This action cannot be undone. All your decisions and data will be permanently deleted.
                        </p>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                            <p className="text-sm text-amber-400 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                                <span><strong>Tip:</strong> Export your data first before deleting your account.</span>
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleDeleteAccount}
                                    variant="danger"
                                    size="lg"
                                    className="w-full"
                                >
                                    Yes, Delete Forever
                                </Button>
                            </motion.div>
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-white/10 text-slate-300 hover:bg-white/5"
                                >
                                    Cancel
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
