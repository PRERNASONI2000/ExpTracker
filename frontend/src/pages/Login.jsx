//Login.jsx
import { useState } from "react";
import axios from "axios";
import { LogIn, X } from "lucide-react";
import { createPortal } from "react-dom";

const API_URL = import.meta.env.VITE_API_URL

function Login({ trigger, isOpen: controlledIsOpen, onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post(
                // "http://localhost:5000/api/auth/login",
                `${API_URL}/api/auth/login`,
                formData
            );

            // Store token in local storage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setMessage({ type: 'success', text: "Logged in Successfully!" });
            setTimeout(() => {
                if (onClose) onClose();
                else setIsOpen(false);
                setMessage(null);
                setFormData({ email: "", password: "" });
                window.location.reload(true);
            }, 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || "Login failed" });
        } finally {
            setLoading(false);
        }
    };

    const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

    const handleClose = () => {
        if (onClose) onClose();
        setIsOpen(false);
    };

    return (
        <>
            {controlledIsOpen === undefined && (
                trigger ? (
                    <div onClick={() => setIsOpen(true)} className="w-full text-left">
                        {trigger}
                    </div>
                ) : (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-400 transition hover:bg-indigo-500/20 border border-indigo-500/20 cursor-pointer"
                    >
                        <LogIn size={16} />
                        Login
                    </button>
                )
            )}

            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-md rounded-2xl glass-modal p-6 text-zinc-100 shadow-2xl overflow-hidden">
                        {/* Ambient glowing auroras */}
                        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl -z-10 animate-pulse" />

                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white transition duration-150 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2.5 text-white">
                                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
                                    <LogIn size={18} />
                                </div>
                                Welcome Back
                            </h2>
                            <p className="text-xs text-zinc-400 mt-1.5">Log in to manage and review your expenses.</p>
                        </div>

                        {message && (
                            <div className={`mb-4 rounded-xl p-3 text-xs font-semibold border ${
                                message.type === 'success' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="block">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-500 focus:border-indigo-500 focus:bg-zinc-950/80 focus:ring-2 focus:ring-indigo-500/10"
                                    required
                                />
                            </div>

                            <div className="block">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-500 focus:border-indigo-500 focus:bg-zinc-950/80 focus:ring-2 focus:ring-indigo-500/10"
                                    required
                                />
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/15 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                                >
                                    {loading ? "Authenticating..." : "Login"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Login;
