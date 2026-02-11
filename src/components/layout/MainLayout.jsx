import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { AiAssist } from '../ai/AiAssist';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const MainLayout = ({ currentView, onNavigate }) => {
    const [isAiOpen, setIsAiOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Navigational Sidebar */}
            <Sidebar currentView={currentView} onNavigate={onNavigate} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
                {/* Global Application Header */}
                <Header />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
                        <Outlet />
                    </div>

                    {/* Integrated Footer */}
                    <footer className="mt-12 p-8 border-t border-slate-200 text-slate-400 text-xs text-center font-medium bg-white/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3">
                            <img src="/logo-ugt.png" alt="UGT Catalunya" className="h-6 opacity-30 grayscale" />
                            <p>{t('footer.copyright', "© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical. Tots els drets reservats.")}</p>
                        </div>
                    </footer>
                </main>
            </div>

            {/* Floating AI Assistant Toggle */}
            <button
                onClick={() => setIsAiOpen(true)}
                className="fixed right-8 bottom-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/20"
                title="Assistència IA"
            >
                <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            <AiAssist isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </div>
    );
};

export default MainLayout;
