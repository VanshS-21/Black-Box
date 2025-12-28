'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Copy, Check, UserPlus, Crown, LogOut, RefreshCw, Activity, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useToast } from '@/components/ui/Toast';
import { TeamPulseDashboard } from '@/components/TeamPulseDashboard';

interface Team {
    id: string;
    name: string;
    description?: string;
    join_token: string;
    owner_id: string;
    team_members?: { count: number }[];
}

interface MemberTeam {
    team_id: string;
    role: string;
    joined_at: string;
    teams: Team;
}

export function TeamManager() {
    const [ownedTeams, setOwnedTeams] = useState<Team[]>([]);
    const [memberTeams, setMemberTeams] = useState<MemberTeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [joinToken, setJoinToken] = useState('');
    const [copiedToken, setCopiedToken] = useState<string | null>(null);
    const [viewingPulseTeamId, setViewingPulseTeamId] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await fetch('/api/teams');
            const data = await response.json();
            if (response.ok) {
                setOwnedTeams(data.owned || []);
                setMemberTeams(data.member || []);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeamName.trim()) {
            showToast('Team name is required', 'error');
            return;
        }

        setCreating(true);
        try {
            const response = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTeamName.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast(`Team "${data.name}" created!`, 'success');
                setNewTeamName('');
                setShowCreate(false);
                fetchTeams();
            } else {
                showToast(data.error || 'Failed to create team', 'error');
            }
        } catch (error) {
            showToast('Something went wrong', 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleJoinTeam = async () => {
        if (joinToken.length !== 8) {
            showToast('Token must be 8 characters', 'error');
            return;
        }

        setJoining(true);
        try {
            const response = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: joinToken.toUpperCase() }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast(data.message, 'success');
                setJoinToken('');
                setShowJoin(false);
                fetchTeams();
            } else {
                showToast(data.error || 'Failed to join team', 'error');
            }
        } catch (error) {
            showToast('Something went wrong', 'error');
        } finally {
            setJoining(false);
        }
    };

    const copyToken = (token: string) => {
        navigator.clipboard.writeText(token);
        setCopiedToken(token);
        showToast('Token copied! Share it with your team.', 'success');
        setTimeout(() => setCopiedToken(null), 2000);
    };

    if (loading) {
        return (
            <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white font-outfit">Team Management</h3>
                </div>
                <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                </div>
            </div>
        );
    }

    const hasTeams = ownedTeams.length > 0 || memberTeams.length > 0;

    return (
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-white font-outfit">Team Management</h3>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowJoin(!showJoin)}
                        className="text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Join
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCreate(!showCreate)}
                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Create
                    </Button>
                </div>
            </div>

            {/* Create Team Form */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                            <h4 className="font-medium text-emerald-300 mb-3">Create New Team</h4>
                            <div className="flex gap-2">
                                <Input
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    placeholder="Team name (e.g., 'Platform Team')"
                                    className="bg-black/30 border-white/10 text-white"
                                />
                                <Button
                                    onClick={handleCreateTeam}
                                    disabled={creating}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                >
                                    {creating ? <LoadingSpinner size="sm" /> : 'Create'}
                                </Button>
                            </div>
                            <p className="text-xs text-emerald-200/60 mt-2">
                                You'll get a shareable token to invite team members.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Join Team Form */}
            <AnimatePresence>
                {showJoin && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 overflow-hidden"
                    >
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h4 className="font-medium text-blue-300 mb-3">Join a Team</h4>
                            <div className="flex gap-2">
                                <Input
                                    value={joinToken}
                                    onChange={(e) => setJoinToken(e.target.value.toUpperCase().slice(0, 8))}
                                    placeholder="Enter 8-character token"
                                    className="bg-black/30 border-white/10 text-white font-mono uppercase tracking-wider"
                                    maxLength={8}
                                />
                                <Button
                                    onClick={handleJoinTeam}
                                    disabled={joining || joinToken.length !== 8}
                                    className="bg-blue-600 hover:bg-blue-500 text-white"
                                >
                                    {joining ? <LoadingSpinner size="sm" /> : 'Join'}
                                </Button>
                            </div>
                            <p className="text-xs text-blue-200/60 mt-2">
                                Ask your team lead for the join token.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Teams List */}
            {!hasTeams ? (
                <div className="text-center py-8 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="mb-2">No teams yet</p>
                    <p className="text-sm text-slate-500">Create a team to share decisions with your colleagues.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Owned Teams */}
                    {ownedTeams.map((team) => (
                        <div
                            key={team.id}
                            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-emerald-500/30 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-amber-400" />
                                        <h4 className="font-semibold text-white">{team.name}</h4>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {team.team_members?.[0]?.count || 1} member(s) • You're the owner
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-slate-800 rounded text-sm font-mono text-emerald-400">
                                        {team.join_token}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToken(team.join_token)}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        {copiedToken === team.join_token ? (
                                            <Check className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewingPulseTeamId(team.id)}
                                        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                    >
                                        <Activity className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Member Teams */}
                    {memberTeams.map((membership) => (
                        <div
                            key={membership.team_id}
                            className="bg-white/5 border border-white/10 rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-semibold text-white">{membership.teams.name}</h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Joined {new Date(membership.joined_at).toLocaleDateString()} • {membership.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-slate-500 mt-4">
                💡 Team members can view each other's shared decisions. Great for knowledge transfer!
            </p>

            {/* Team Pulse Modal */}
            <AnimatePresence>
                {viewingPulseTeamId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setViewingPulseTeamId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                    <span className="text-lg font-bold text-white font-outfit">Team Pulse</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewingPulseTeamId(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <TeamPulseDashboard teamId={viewingPulseTeamId} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
