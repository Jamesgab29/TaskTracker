import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { Loader2, User, Lock } from 'lucide-react';

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
        
        if (!email.trim() || !password.trim()) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response: any = await authService.login({ email, password });
            login(response.token);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#2DD4BF] items-center justify-center p-4" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%2314b8a6\\' fill-opacity=\\'0.15\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white order-2 md:order-1">
                    <div className="max-w-md w-full mx-auto space-y-6">
                        <div className="text-left">
                            <h2 className="text-3xl font-bold text-dark tracking-tight">Sign In</h2>
                        </div>

                        {error && <div className="text-red-500 text-sm text-left bg-red-50 p-3 rounded-lg">{error}</div>}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-300 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-300 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] transition-all"
                                    />
                                </div>
                                
                                <div className="flex items-center mt-2">
                                    <input type="checkbox" id="remember" className="w-4 h-4 text-[#2DD4BF] bg-gray-100 border-gray-300 rounded focus:ring-[#2DD4BF] focus:ring-2" />
                                    <label htmlFor="remember" className="ml-2 text-xs font-medium text-gray-600">Remember Me</label>
                                </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-32 bg-[#2DD4BF] hover:bg-[#14b8a6] text-white font-medium py-2 rounded-md transition-all shadow-sm flex justify-center items-center"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login'}
                                </button>
                            </div>
                        </form>

                        <p className="text-left text-xs font-medium text-gray-600 mt-6">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                                Create One
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Side - Image area */}
                <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-8 order-1 md:order-2">
                     <img src="/login-illustration.svg" alt="Login Illustration" className="max-w-full max-h-full object-contain" />
                </div>
            </div>
        </div>
    );
};

export default Login;
