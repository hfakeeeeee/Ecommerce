import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Configure axios to use the token
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Verify token with backend
                await axios.get('http://localhost:8080/api/auth/verify');
                
                setIsAuthenticated(true);
                setUserEmail(localStorage.getItem('userEmail'));
            } catch (error) {
                // If token is invalid, clear it
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                delete axios.defaults.headers.common['Authorization'];
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });
            
            const { token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setIsAuthenticated(true);
            setUserEmail(email);
            navigate('/');
            
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to login'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUserEmail('');
        navigate('/login');
    };

    const register = async (userData) => {
        try {
            await axios.post('http://localhost:8080/api/auth/register', userData);
            navigate('/login');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to register'
            };
        }
    };

    const resetPassword = async (email) => {
        try {
            await axios.post('http://localhost:8080/api/auth/reset-password', { email });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to reset password'
            };
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userEmail,
            login,
            logout,
            register,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 