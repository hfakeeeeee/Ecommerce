import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCamera, FaSpinner, FaCheck, FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock, FaEdit, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';
import { getImageUrl } from '../utils/imageUtils';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

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
            const response = await fetch(`${API_BASE_URL}/api/auth/upload-avatar`, {
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

            const verifyResponse = await fetch(`${API_BASE_URL}/api/auth/verify`, {
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2 sm:px-4 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="relative h-40 sm:h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
                        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 bg-white dark:bg-gray-700"
                                >
                                    {user?.imageUrl ? (
                                        <img
                                            src={getImageUrl(user.imageUrl)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
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
                                    className="absolute bottom-1 right-1 sm:bottom-0 sm:right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                    <div className="pt-20 sm:pt-16 pb-6 px-4 sm:px-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 text-center sm:text-left">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.firstName} {user?.lastName}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start mt-1 text-sm sm:text-base">
                                    <FaEnvelope className="w-4 h-4 mr-2" />
                                    {user?.email}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(!isEditing)}
                                className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto sm:mx-0 text-sm sm:text-base"
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
                            className={`mb-6 p-3 sm:p-4 rounded-lg shadow-md ${
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
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isChangingPassword ? (
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
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
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 text-sm sm:text-base"
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
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 text-sm sm:text-base"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50 text-sm sm:text-base"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4 sm:space-y-6"
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
                                            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white pr-10 text-sm sm:text-base"
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
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
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
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 sm:pt-6 gap-3 sm:gap-0">
                            {!isChangingPassword ? (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => setIsChangingPassword(true)}
                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-full sm:w-auto"
                                    >
                                        <FaLock className="w-4 h-4 mr-2" />
                                        Change Password
                                    </motion.button>
                                    {isEditing && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
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
                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-full sm:w-auto"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
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