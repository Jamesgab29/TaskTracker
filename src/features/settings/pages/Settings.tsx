import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { profileService } from '../services/profileService';
import type { UserProfile } from '../types';
import { ArrowLeft, Camera, User, Mail, Phone, Loader2, Check, X, Lock, Eye, EyeOff } from 'lucide-react';

const Settings: React.FC = () => {
    const { userId } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (userId) {
            loadProfile();
        }
    }, [userId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.getProfile(userId!);
            setProfile(data);
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setEmail(data.email || '');
            setContactNumber(data.contactNumber || '');
            if (data.hasProfilePicture) {
                setPhotoPreview(`/api/profile/${userId}/photo?t=${Date.now()}`);
            }
        } catch {
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setSaving(true);
        setMessage(null);

        try {
            await profileService.updateProfile(userId, {
                firstName,
                lastName,
                contactNumber,
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setContactNumber(profile.contactNumber || '');
        }
        setMessage(null);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        // Validation
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setSavingPassword(true);
        setMessage(null);

        try {
            await profileService.updatePassword(userId, newPassword);
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setMessage(null), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update password' });
        } finally {
            setSavingPassword(false);
        }
    };

    const handlePasswordCancel = () => {
        setNewPassword('');
        setConfirmPassword('');
        setMessage(null);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        // Show preview
        const reader = new FileReader();
        reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
        reader.readAsDataURL(file);

        try {
            await profileService.uploadPhoto(userId, file);
            setMessage({ type: 'success', text: 'Photo updated!' });
            setTimeout(() => setMessage(null), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Photo upload failed' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-dark">Account Information</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-teal-600 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Go Back
                </button>
            </div>

            {/* Toast Message */}
            {message && (
                <div
                    className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in ${
                        message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                >
                    {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
                    {message.text}
                </div>
            )}

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Profile Header */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shadow-md ring-4 ring-primary/10">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-white" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-7 h-7 bg-secondary text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-all hover:scale-110"
                            >
                                <Camera size={14} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-dark">
                                {firstName || lastName
                                    ? `${firstName} ${lastName}`.trim()
                                    : 'Your Name'}
                            </h2>
                            <p className="text-sm text-gray-400">{email}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdate} className="p-8 space-y-5">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-1.5">
                            First Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-1.5">
                            Last Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                            />
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-1.5">
                            Contact Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                placeholder="Enter your contact number"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 bg-primary hover:bg-teal-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-60"
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check size={16} />
                            )}
                            Update Info
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2.5 bg-secondary hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="px-8 pt-8 pb-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                        <Lock size={20} className="text-primary" />
                        Change Password
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Update your password to keep your account secure</p>
                </div>

                <form onSubmit={handlePasswordChange} className="p-8 space-y-5">
                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-1.5">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {newPassword.length > 0 && newPassword.length < 6 && (
                            <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-dark mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={savingPassword || newPassword.length < 6 || newPassword !== confirmPassword}
                            className="px-6 py-2.5 bg-primary hover:bg-teal-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {savingPassword ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check size={16} />
                            )}
                            Update Password
                        </button>
                        <button
                            type="button"
                            onClick={handlePasswordCancel}
                            className="px-6 py-2.5 bg-secondary hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
