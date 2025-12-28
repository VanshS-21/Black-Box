'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Link2, Users, Bell, AlertTriangle, Download, Trash2, MessageSquare, Copy, Check, RefreshCw, Unlink, Github, Mail, Lightbulb } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { TeamManager } from '@/components/TeamManager';
import { DashboardHeader } from '@/components/DashboardHeader';

type SettingsTab = 'profile' | 'security' | 'integrations' | 'teams' | 'notifications' | 'danger';

const TABS: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

export default function SettingsPage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { showToast } = useToast();

    // Active tab state - check URL hash for direct navigation
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    useEffect(() => {
        const hash = window.location.hash.replace('#', '') as SettingsTab;
        if (TABS.some(t => t.id === hash)) {
            setActiveTab(hash);
        }
    }, []);

    // Profile state
    const [userRole, setUserRole] = useState('');

    // Security state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

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

    // Email digest preferences
    const [digestEnabled, setDigestEnabled] = useState(true);
    const [digestTime, setDigestTime] = useState<'friday_9am' | 'monday_9am' | 'disabled'>('friday_9am');

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch integrations on mount
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
                headers: { 'Authorization': `Bearer ${session.access_token}` },
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
        try {
            const { supabase } = await import('@/lib/supabase/client');
            const { error } = await supabase.auth.updateUser({ password: newPassword });
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
            showToast('Failed to delete account', 'error');
        }
    };

    const handleTabChange = (tabId: SettingsTab) => {
        setActiveTab(tabId);
        window.history.replaceState(null, '', `#${tabId}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 selection:bg-violet-500/30 text-slate-200">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-violet-900/10 blur-[100px] pointer-events-none" />

            <DashboardHeader showBack pageTitle="Settings" pageSubtitle="Manage your account and preferences" />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-56 flex-shrink-0">
                        <nav className="space-y-1 sticky top-24">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                const isDanger = tab.id === 'danger';
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? isDanger
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            : isDanger
                                                ? 'text-red-400/60 hover:text-red-400 hover:bg-red-500/5'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Profile Tab */}
                                {activeTab === 'profile' && (
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                                        <h2 className="text-xl font-semibold text-white mb-6 font-outfit">Profile Settings</h2>
                                        <div className="space-y-6 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                                <Input
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="bg-slate-800/50 border-white/5 text-slate-400"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Current Role</label>
                                                <Input
                                                    value={userRole}
                                                    onChange={(e) => setUserRole(e.target.value)}
                                                    placeholder="e.g., Senior Software Engineer"
                                                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Used for AI coaching context</p>
                                            </div>
                                            <div className="pt-4 border-t border-white/5">
                                                <h3 className="text-sm font-medium text-slate-300 mb-3">Export Your Data</h3>
                                                <Button onClick={handleExport} variant="secondary" className="bg-slate-800 border-white/10">
                                                    <Download className="w-4 h-4 mr-2" /> Export All Data (JSON)
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security Tab */}
                                {activeTab === 'security' && (
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                                        <h2 className="text-xl font-semibold text-white mb-6 font-outfit">Security</h2>
                                        <div className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                                                <Input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Enter new password"
                                                    className="bg-black/20 border-white/10 text-white placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
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
                                            <Button onClick={handlePasswordChange} disabled={saving} variant="primary">
                                                {saving ? 'Updating...' : 'Update Password'}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Integrations Tab */}
                                {activeTab === 'integrations' && (
                                    <div className="space-y-6">
                                        {/* Slack */}
                                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-[#4A154B] rounded-lg flex items-center justify-center">
                                                    <MessageSquare className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white font-outfit">Slack</h3>
                                                    <p className="text-sm text-slate-400">Log decisions with /logdecision</p>
                                                </div>
                                            </div>
                                            {slackStatus === 'loading' && <div className="text-slate-400">Loading...</div>}
                                            {slackStatus === 'linked' && (
                                                <div className="space-y-3">
                                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-400" />
                                                        <span className="text-green-400 text-sm">Connected</span>
                                                    </div>
                                                    <Button onClick={unlinkSlack} variant="outline" size="sm" className="text-red-400 border-red-500/20 hover:bg-red-500/10">
                                                        <Unlink className="w-4 h-4 mr-2" /> Unlink
                                                    </Button>
                                                </div>
                                            )}
                                            {slackStatus === 'pending' && (
                                                <div className="space-y-3">
                                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                                        <p className="text-amber-400 text-sm mb-2">Enter this code in Slack:</p>
                                                        <div className="flex items-center gap-2">
                                                            <code className="bg-slate-800 px-4 py-2 rounded-lg text-xl font-mono text-white">{slackLinkCode}</code>
                                                            <Button onClick={copyLinkCode} variant="ghost" size="sm">
                                                                {copiedCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {slackStatus === 'unlinked' && (
                                                <Button onClick={generateSlackCode} disabled={generatingCode}>
                                                    <MessageSquare className="w-4 h-4 mr-2" />
                                                    {generatingCode ? 'Generating...' : 'Connect Slack'}
                                                </Button>
                                            )}
                                        </div>

                                        {/* GitHub */}
                                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                                                    <Github className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white font-outfit">GitHub</h3>
                                                    <p className="text-sm text-slate-400">Capture decisions from PR comments</p>
                                                </div>
                                            </div>
                                            {githubStatus === 'loading' && <div className="text-slate-400">Loading...</div>}
                                            {githubStatus === 'linked' && (
                                                <div className="space-y-3">
                                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-400" />
                                                        <span className="text-green-400 text-sm">Connected as @{githubUsername}</span>
                                                    </div>
                                                    <Button onClick={unlinkGithub} variant="outline" size="sm" className="text-red-400 border-red-500/20 hover:bg-red-500/10">
                                                        <Unlink className="w-4 h-4 mr-2" /> Unlink
                                                    </Button>
                                                </div>
                                            )}
                                            {githubStatus === 'pending' && (
                                                <div className="space-y-3">
                                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                                        <p className="text-amber-400 text-sm mb-2">Your link code:</p>
                                                        <div className="flex items-center gap-2">
                                                            <code className="bg-slate-800 px-4 py-2 rounded-lg text-xl font-mono text-white">{githubLinkCode}</code>
                                                            <Button onClick={copyGithubLinkCode} variant="ghost" size="sm">
                                                                {copiedGithubCode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {githubStatus === 'unlinked' && (
                                                <Button onClick={generateGithubCode} disabled={generatingGithubCode}>
                                                    <Github className="w-4 h-4 mr-2" />
                                                    {generatingGithubCode ? 'Generating...' : 'Connect GitHub'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Teams Tab */}
                                {activeTab === 'teams' && (
                                    <TeamManager />
                                )}

                                {/* Notifications Tab */}
                                {activeTab === 'notifications' && (
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-white font-outfit">Email Notifications</h2>
                                                <p className="text-sm text-slate-400">Weekly digest of your decisions</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 max-w-md">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">Weekly Digest</p>
                                                    <p className="text-sm text-slate-400">Receive a summary each week</p>
                                                </div>
                                                <button
                                                    onClick={() => setDigestEnabled(!digestEnabled)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${digestEnabled ? 'bg-violet-600' : 'bg-slate-600'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${digestEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                            {digestEnabled && (
                                                <div className="space-y-2">
                                                    <label className="block text-sm text-slate-300">Delivery Time</label>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setDigestTime('friday_9am')}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${digestTime === 'friday_9am' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                                        >
                                                            Friday 9am
                                                        </button>
                                                        <button
                                                            onClick={() => setDigestTime('monday_9am')}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${digestTime === 'monday_9am' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                                        >
                                                            Monday 9am
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Danger Zone Tab */}
                                {activeTab === 'danger' && (
                                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                                        <h2 className="text-xl font-semibold text-red-400 mb-4 font-outfit flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" /> Danger Zone
                                        </h2>
                                        <p className="text-red-300/70 mb-6">
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                                            <p className="text-sm text-amber-400 flex items-center gap-2">
                                                <Lightbulb className="w-4 h-4" />
                                                <span><strong>Tip:</strong> Export your data first before deleting.</span>
                                            </p>
                                        </div>
                                        <Button onClick={() => setShowDeleteConfirm(true)} variant="danger">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
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
                        className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-md shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-2 font-outfit flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" /> Delete Account?
                        </h3>
                        <p className="text-slate-400 mb-4">
                            This action cannot be undone. All your data will be permanently deleted.
                        </p>
                        <div className="flex gap-4">
                            <Button onClick={handleDeleteAccount} variant="danger" className="flex-1">
                                Yes, Delete Forever
                            </Button>
                            <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="flex-1 border-white/10 text-slate-300">
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
