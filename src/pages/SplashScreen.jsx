import React, { useEffect } from 'react';

const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 3000); // 3 seconds duration
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="bg-primary overflow-hidden h-screen w-screen flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] w-[150%] h-[150%]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" fill="none" r="80" stroke="white" strokeWidth="0.5"></circle>
                    <circle cx="100" cy="100" fill="none" r="60" stroke="white" strokeWidth="0.5"></circle>
                    <circle cx="100" cy="100" fill="none" r="40" stroke="white" strokeWidth="0.5"></circle>
                    <path d="M100 20 L100 180 M20 100 L180 100" stroke="white" strokeWidth="0.2"></path>
                </svg>
            </div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-5 mb-12">
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-2xl p-2">
                        <img src="/logo-ugt.png" alt="UGT Formació" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-white">
                        <h1 className="font-bold text-5xl tracking-tight leading-none mb-1">UGT Formació</h1>
                        <p className="text-sm uppercase tracking-[0.3em] font-medium opacity-80">Gestió de Formació Sindical</p>
                    </div>
                </div>
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <div className="absolute bottom-16 z-10 text-center flex flex-col items-center gap-4">
                <p className="text-white font-medium text-lg tracking-wide">
                    Preparant l'espai de formació...
                </p>
                <div className="flex flex-col items-center opacity-70">
                    <div className="h-px w-12 bg-white/40 mb-4"></div>
                    <span className="text-white text-xs uppercase tracking-widest font-semibold">
                        Secretaria de Formació — UGT Catalunya
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
