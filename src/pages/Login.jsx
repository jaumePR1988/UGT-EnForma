import React from 'react';

const Login = ({ onLogin }) => {
    return (
        <div className="flex min-h-screen font-sans">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-12 overflow-hidden">
                <svg className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4" height="600" viewBox="0 0 200 200" width="600">
                    <circle cx="100" cy="100" fill="white" r="80"></circle>
                </svg>
                <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none -translate-x-1/4 translate-y-1/4">
                    <svg height="400" viewBox="0 0 200 200" width="400">
                        <rect fill="white" height="100" width="100" x="50" y="50"></rect>
                    </svg>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1">
                            <img src="/logo-ugt.png" alt="UGT Formació" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-2xl leading-tight">UGT Formació</h1>
                            <p className="text-[11px] uppercase tracking-widest text-white/80 font-semibold">Gestió de Formació Sindical</p>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 mb-12">
                    <h2 className="text-5xl font-extrabold text-white leading-tight max-w-lg mb-6">
                        Formació per a la classe treballadora.
                    </h2>
                    <div className="h-1.5 w-24 bg-white/30 rounded-full mb-6"></div>
                    <p className="text-white/80 text-lg max-w-md font-medium">
                        Accedeix a la plataforma de gestió formativa de la Unió General de Treballadores i Treballadors de Catalunya.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-4 text-white/60 text-sm">
                    <span>UGT Catalunya © 2026</span>
                    <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                    <span>Secretaria de Formació</span>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-slate-50 lg:bg-white text-slate-900">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-md p-1">
                                <img src="/logo-ugt.png" alt="UGT Formació" className="w-full h-full object-contain" />
                            </div>
                            <h1 className="text-slate-900 font-bold text-xl">UGT Formació</h1>
                        </div>
                    </div>
                    <div className="bg-white lg:bg-transparent p-8 lg:p-0 rounded-2xl shadow-xl lg:shadow-none border border-slate-100 lg:border-none">
                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Benvingut de nou</h2>
                            <p className="text-slate-500 font-medium">Introdueix les teves credencials per accedir al CRM.</p>
                        </div>
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">Correu electrònic</label>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                                    <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" id="email" placeholder="usuari@ugt.cat" required type="email" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Contrasenya</label>
                                </div>
                                <div className="relative">
                                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                                    <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" id="password" placeholder="••••••••" required type="password" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer" id="remember" type="checkbox" />
                                    <label className="ml-2 block text-sm text-slate-600 cursor-pointer select-none" htmlFor="remember">Recorda'm</label>
                                </div>
                                <a className="text-sm font-semibold text-primary hover:text-red-700 transition-colors" href="#">Has oblidat la contrasenya?</a>
                            </div>
                            <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-red-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 group" type="submit">
                                <span>INICIAR SESSIÓ</span>
                                <span className="material-icons-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
