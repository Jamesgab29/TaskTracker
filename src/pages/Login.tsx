import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { Loader2 } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response: any = await authService.login({ email, password });
            login(response.token);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-light items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
                {/* Left Side - Empty/Image area based on wireframe */}
                <div className="hidden md:block w-1/2 bg-gray-50 border-r border-gray-100">
                    {/* Can add an illustration here later */}
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto space-y-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-black text-dark tracking-tight">LOGIN</h2>
                        </div>

                        {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex justify-center items-center"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login'}
                                </button>
                            </div>
                        </form>

                        <p className="text-center text-sm font-medium text-gray-600 mt-8">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#6366f1] hover:text-[#4f46e5] transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
