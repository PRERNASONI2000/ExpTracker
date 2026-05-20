//Register.jsx
import { useState } from "react";
import axios from "axios";
import { UserPlus, X } from "lucide-react";
import { createPortal } from "react-dom";

const API_URL = import.meta.env.VITE_API_URL

function Register({ trigger, isOpen: controlledIsOpen, onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
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
                // "http://localhost:5000/api/auth/register",
                `${API_URL}/api/auth/register`,
                formData
            );
            setMessage({ type: 'success', text: "User Registered Successfully!" });
            setTimeout(() => {
                if (onClose) onClose();
                else setIsOpen(false);
                setMessage(null);
                setFormData({ username: "", email: "", password: "" });
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || "Registration failed" });
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
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20 border border-cyan-500/20 cursor-pointer"
                    >
                        <UserPlus size={16} />
                        Register Account
                    </button>
                )
            )}

            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-md rounded-2xl glass-modal p-6 text-zinc-100 shadow-2xl overflow-hidden">
                        {/* Radiant blur highlights */}
                        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl -z-10 animate-pulse" />

                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white transition duration-150 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2.5 text-white">
                                <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20">
                                    <UserPlus size={18} />
                                </div>
                                Create Account
                            </h2>
                            <p className="text-xs text-zinc-400 mt-1.5">Join SpendFlow today to start tracking your expenses.</p>
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
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="John Doe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:bg-zinc-950/80 focus:ring-2 focus:ring-cyan-500/10"
                                    required
                                />
                            </div>

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
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:bg-zinc-950/80 focus:ring-2 focus:ring-cyan-500/10"
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
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-3.5 py-2.5 text-sm text-white outline-none transition duration-200 placeholder:text-zinc-500 focus:border-cyan-500 focus:bg-zinc-950/80 focus:ring-2 focus:ring-cyan-500/10"
                                    required
                                    minLength="6"
                                />
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/15 transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                                >
                                    {loading ? "Creating Profile..." : "Sign Up"}
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

export default Register;