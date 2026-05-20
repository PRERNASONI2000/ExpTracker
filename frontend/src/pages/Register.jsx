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
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400/20 border border-cyan-400/20"
                    >
                        <UserPlus size={16} />
                        Register Account
                    </button>
                )
            )}

            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-slate-100">
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <UserPlus className="text-cyan-400" size={24} />
                                Create Account
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Join to start tracking your expenses</p>
                        </div>

                        {message && (
                            <div className={`mb-4 rounded-lg p-3 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block text-sm text-slate-300">
                                Name
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="John Doe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-lg border border-white/15 bg-slate-800/80 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400 placeholder:text-slate-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm text-slate-300">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-lg border border-white/15 bg-slate-800/80 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400 placeholder:text-slate-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm text-slate-300">
                                Password
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-2 w-full rounded-lg border border-white/15 bg-slate-800/80 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400 placeholder:text-slate-500"
                                    required
                                    minLength="6"
                                />
                            </label>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-70"
                                >
                                    {loading ? "Creating..." : "Register"}
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