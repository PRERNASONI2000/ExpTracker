//Profile.jsx
import { useState, useEffect } from "react";
import { User, X, Mail } from "lucide-react";
import { createPortal } from "react-dom";

const API_URL = import.meta.env.VITE_API_URL

function Profile({ trigger, isOpen: controlledIsOpen, onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);

    const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

    useEffect(() => {
        if (isModalOpen) {
            try {
                const saved = localStorage.getItem('user');
                if (saved) {
                    setUser(JSON.parse(saved));
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            }
        }
    }, [isModalOpen]);

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
                        <User size={16} />
                        Profile
                    </button>
                )
            )}

            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-sm rounded-2xl glass-modal p-6 text-zinc-100 shadow-2xl overflow-hidden">
                        {/* Ambient glowing layers */}
                        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl -z-10 animate-pulse" />

                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white transition duration-150 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-6 flex flex-col items-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-3xl font-bold text-white border border-white/10 shadow-lg shadow-indigo-500/20">
                                {user ? (user.username || user.name || 'U').charAt(0).toUpperCase() : <User size={40} />}
                            </div>
                            <h2 className="text-xl font-bold text-white">User Profile</h2>
                            <p className="text-xs text-zinc-400 mt-1">Manage cloud-linked credential scopes.</p>
                        </div>

                        {user ? (
                            <div className="space-y-4">
                                <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-4">
                                    <div className="flex items-center gap-3 text-zinc-300 mb-1">
                                        <User size={16} className="text-cyan-400" />
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Username</span>
                                    </div>
                                    <p className="text-sm font-semibold pl-7 text-white">{user.username || user.name}</p>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-4">
                                    <div className="flex items-center gap-3 text-zinc-300 mb-1">
                                        <Mail size={16} className="text-cyan-400" />
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Email Address</span>
                                    </div>
                                    <p className="text-sm font-semibold pl-7 text-white">{user.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <p className="text-sm text-zinc-400 mb-4">You are not logged in.</p>
                                <button
                                    onClick={handleClose}
                                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99] cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Profile;
