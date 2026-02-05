import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AiAssist } from '../ai/AiAssist';
import { Sparkles } from 'lucide-react';

export const MainLayout = () => {
    const [isAiOpen, setIsAiOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="main-content flex-1 overflow-y-auto" style={{ padding: '48px' }}>
                <div className="container mx-auto">
                    <Outlet />
                </div>
                <footer style={{
                    marginTop: '4rem',
                    padding: '2rem 0',
                    borderTop: '1px solid #E2E8F0',
                    color: '#94A3B8',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                }}>
                    <p>© 2024 UGT EnForma - Panell d'Administració. Tots els drets reservats.</p>
                </footer>
            </main>

            {/* Floating AI Toggle */}
            <button
                onClick={() => setIsAiOpen(true)}
                style={{
                    position: 'fixed',
                    right: '25px',
                    bottom: '25px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#E30613',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgba(227, 6, 19, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 999
                }}
                title="Assistència IA"
            >
                <Sparkles size={24} />
            </button>

            <AiAssist isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </div>
    );
};
