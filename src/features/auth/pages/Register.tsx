import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Loader2, User, Mail, Lock } from 'lucide-react';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.firstName.trim() || !formData.lastName.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
            setError("All fields are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { confirmPassword, ...registerData } = formData;
            await authService.register(registerData);
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#2DD4BF] items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
                {/* Left Side */}
                <div className="hidden md:flex w-1/2 bg-white items-center justify-center border-r border-gray-100 p-8">
                    <img src="/register-illustration.png" alt="Registration Illustration" className="max-w-full max-h-full object-contain" />
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="max-w-md w-full mx-auto space-y-6">
                        <div className="text-left mb-6">
                            <h2 className="text-3xl font-bold text-dark tracking-tight">Sign Up</h2>
                        </div>

                        {error && <div className="text-red-500 text-sm text-left bg-red-50 p-3 rounded-lg">{error}</div>}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Enter First Name"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-300 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] transition-all"
                                    />
                                </div>
                                
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Enter Last Name"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-300 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-300 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter Password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-300 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-md bg-white border border-gray-300 text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF] transition-all"
                                    />
                                </div>

                                <div className="flex items-center mt-2">
                                    <input type="checkbox" id="agree" className="w-4 h-4 text-[#2DD4BF] bg-gray-100 border-gray-300 rounded focus:ring-[#2DD4BF] focus:ring-2" />
                                    <label htmlFor="agree" className="ml-2 text-xs font-medium text-gray-600">I agree to all terms</label>
                                </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-32 bg-[#2DD4BF] hover:bg-[#14b8a6] text-white font-medium py-2 rounded-md transition-all shadow-sm flex justify-center items-center"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Register'}
                                </button>
                            </div>
                        </form>

                        <p className="text-left text-xs font-medium text-gray-600 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#3b82f6] hover:text-[#2563eb] transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
