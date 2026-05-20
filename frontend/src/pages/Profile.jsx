//Profile.jsx
import { useState, useEffect } from "react";
import { User, X, Mail } from "lucide-react";
import { createPortal } from "react-dom";

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
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-400 transition hover:bg-indigo-500/20 border border-indigo-500/20"
                    >
                        <User size={16} />
                        Profile
                    </button>
                )
            )}

            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-slate-100">
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6 flex flex-col items-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/20 text-3xl font-bold text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                                {user ? (user.username || user.name || 'U').charAt(0).toUpperCase() : <User size={40} />}
                            </div>
                            <h2 className="text-xl font-semibold">User Profile</h2>
                        </div>

                        {user ? (
                            <div className="space-y-4">
                                <div className="rounded-xl border border-white/5 bg-slate-800/50 p-4">
                                    <div className="flex items-center gap-3 text-slate-300 mb-1">
                                        <User size={16} className="text-cyan-400" />
                                        <span className="text-xs uppercase tracking-wider text-slate-500">Username</span>
                                    </div>
                                    <p className="text-sm font-medium pl-7">{user.username || user.name}</p>
                                </div>
                                <div className="rounded-xl border border-white/5 bg-slate-800/50 p-4">
                                    <div className="flex items-center gap-3 text-slate-300 mb-1">
                                        <Mail size={16} className="text-cyan-400" />
                                        <span className="text-xs uppercase tracking-wider text-slate-500">Email Address</span>
                                    </div>
                                    <p className="text-sm font-medium pl-7">{user.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <p className="text-sm text-slate-400 mb-4">You are not logged in.</p>
                                <button
                                    onClick={handleClose}
                                    className="rounded-lg bg-indigo-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-indigo-400"
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
