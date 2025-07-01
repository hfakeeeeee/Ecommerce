import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCamera, FaSpinner, FaCheck, FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock, FaEdit, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

export default function UserProfilePage() {
    const { user, setUser, updateProfile, updatePassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef();

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordRules, setPasswordRules] = useState([
        { label: "At least 8 characters long", test: (pass) => pass.length >= 8 },
        { label: "Contains uppercase letter", test: (pass) => /[A-Z]/.test(pass) },
        { label: "Contains lowercase letter", test: (pass) => /[a-z]/.test(pass) },
        { label: "Contains number", test: (pass) => /[0-9]/.test(pass) },
        { label: "Contains special character (!@#$%^&*)", test: (pass) => /[!@#$%^&*]/.test(pass) }
    ]);

    const isPasswordValid = (password) => {
        return passwordRules.every(rule => rule.test(password));
    };

    const showToast = (message, type = 'success') => {
        setMessage({ text: message, type, visible: true });
        setTimeout(() => setMessage(prev => ({ ...prev, visible: false })), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/upload-avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload image');
            }

            const data = await response.json();
            setUser(prevUser => ({
                ...prevUser,
                imageUrl: data.imageUrl
            }));
            showToast('Profile picture updated successfully', 'success');

            const verifyResponse = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (verifyResponse.ok) {
                const userData = await verifyResponse.json();
                setUser(userData);
            }
        } catch (error) {
            console.error('Upload error:', error);
            showToast(error.message || 'Failed to upload image', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isChangingPassword) {
                // Validate current password is not empty
                if (!formData.currentPassword.trim()) {
                    showToast('Current password is required', 'error');
                    setLoading(false);
                    return;
                }

                // Validate new password meets requirements
                if (!isPasswordValid(formData.newPassword)) {
                    showToast('New password does not meet requirements', 'error');
                    setLoading(false);
                    return;
                }

                // Validate passwords match
                if (formData.newPassword !== formData.confirmPassword) {
                    showToast('New passwords do not match', 'error');
                    setLoading(false);
                    return;
                }

                // Try to update password
                const result = await updatePassword(formData.currentPassword, formData.newPassword);
                
                if (result.success) {
                    showToast('Password updated successfully', 'success');
                    setIsChangingPassword(false);
                    // Clear password fields
                    setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    }));
                } else {
                    showToast(result.error || 'Failed to update password', 'error');
                }
            } else {
                await updateProfile({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email
                });
                showToast('Profile updated successfully', 'success');
                setIsEditing(false);
            }
        } catch (error) {
            showToast(error.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
                        <div className="absolute -bottom-12 left-8">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 bg-white dark:bg-gray-700"
                                >
                                    {user?.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                const defaultIcon = document.createElement('div');
                                                defaultIcon.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500';
                                                defaultIcon.innerHTML = '<svg class="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
                                                e.target.parentElement.appendChild(defaultIcon);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                                            <FaUserCircle className="text-white w-16 h-16" />
                                        </div>
                                    )}
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                                    disabled={loading}
                                >
                                    <FaCamera size={16} />
                                </motion.button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-6 px-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                                    <FaEnvelope className="w-4 h-4 mr-2" />
                                    {user?.email}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                            >
                                <FaEdit className="w-4 h-4" />
                                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Message Toast */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-6 p-4 rounded-lg shadow-md ${
                                message.type === 'success' 
                                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}
                        >
                            <div className="flex items-center">
                                {message.type === 'success' ? (
                                    <FaCheck className="w-5 h-5 mr-2" />
                                ) : (
                                    <FaTimes className="w-5 h-5 mr-2" />
                                )}
                                {message.text}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Profile Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isChangingPassword ? (
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-between items-center pt-6">
                            {!isChangingPassword ? (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setIsChangingPassword(true)}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        <FaLock className="w-4 h-4 mr-2" />
                                        Change Password
                                    </motion.button>
                                    {isEditing && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <FaSpinner className="animate-spin w-5 h-5 mr-2" />
                                            ) : (
                                                <FaCheck className="w-5 h-5 mr-2" />
                                            )}
                                            Save Changes
                                        </motion.button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setFormData(prev => ({
                                                ...prev,
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: ''
                                            }));
                                        }}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <FaSpinner className="animate-spin w-5 h-5 mr-2" />
                                        ) : (
                                            <FaCheck className="w-5 h-5 mr-2" />
                                        )}
                                        Update Password
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>

            <Toast
                message={message.text}
                type={message.type}
                isVisible={message.visible}
                onClose={() => setMessage(prev => ({ ...prev, visible: false }))}
            />
        </div>
    );
} 