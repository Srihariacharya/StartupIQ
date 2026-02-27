import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, X } from 'lucide-react';

const LimitModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0f172a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl relative animate-fade-in-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center mt-4">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-extrabold text-white mb-3">Daily Limit Reached</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        You've hit your free trial limit of 5 AI analyses for today. Create an account or sign in to unlock unlimited access!
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            to="/signup"
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-orange-500/25"
                        >
                            Unlock Unlimited Access
                        </Link>
                        <Link
                            to="/login"
                            onClick={onClose}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl border border-gray-700 transition-all"
                        >
                            Sign In to Your Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LimitModal;
