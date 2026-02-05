import React, { useState, useEffect } from 'react';

// --- COMPONENTS ---

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
            {/* Footer links removed as per user request */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Original Dashboard Code (Strict Copy)
const Dashboard = ({ onNavigate }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-ugt.png" alt="UGT Formació" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UGT <span className="text-[#E30613]">Formació</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center px-4 py-3 bg-[#E30613]/10 text-[#E30613] rounded-lg font-bold transition-all" href="#">
            <span className="material-icons-outlined mr-3 text-2xl">dashboard</span>
            Tauler de Control
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate && onNavigate('active-courses')}>
            <span className="material-icons-outlined mr-3 text-2xl">school</span>
            Cursos Actius
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate && onNavigate('students')}>
            <span className="material-icons-outlined mr-3 text-2xl">people</span>
            Alumnat
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate && onNavigate('certificates')}>
            <span className="material-icons-outlined mr-3 text-2xl">assignment</span>
            Certificats
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate && onNavigate('reports')}>
            <span className="material-icons-outlined mr-3 text-2xl">analytics</span>
            Informes
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={toggleDarkMode}
          >
            <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
            Mode Nit
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10 transition-all duration-200">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Panell d'Administració</h1>
            <p className="text-slate-500 dark:text-slate-400">Gestió global de la formació sindical</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-64 transition-all"
                placeholder="Buscar cursos, alumnes..."
                type="text"
              />
            </div>
            <button
              className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              onClick={() => onNavigate && onNavigate('create-course')}
            >
              <span className="material-icons-outlined mr-2">add</span>
              Nou Curs
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-primary rounded-lg">
                <span className="material-icons-outlined">library_books</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Cursos Actius</h3>
            <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">42</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                <span className="material-icons-outlined">groups</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+5.4%</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Inscripcions Totals</h3>
            <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">1,284</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                <span className="material-icons-outlined">pending_actions</span>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Pendent</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Certificats Pendents</h3>
            <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">156</p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                <span className="material-icons-outlined">star</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Mitjana</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Valoració Mitjana</h3>
            <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">4.8/5</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-lg flex items-center text-slate-800 dark:text-white">
                  <span className="material-icons-outlined mr-2 text-primary">calendar_month</span>
                  Calendari Setmanal de Formació
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-400"><span className="material-icons-outlined">chevron_left</span></button>
                  <span className="text-sm font-medium px-2 text-slate-600 dark:text-slate-300">Setmana 24 - Juny 2024</span>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-400"><span className="material-icons-outlined">chevron_right</span></button>
                </div>
              </div>
              <div className="calendar-grid">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dl 10</div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dm 11</div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dx 12</div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dj 13</div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 text-center text-xs font-bold uppercase text-slate-500">Dv 14</div>
                <div className="bg-white dark:bg-card-dark p-2 min-h-[160px] relative">
                  <div className="bg-primary/10 border-l-4 border-primary p-2 text-xs rounded mb-2">
                    <p className="font-bold text-primary">Delegats Prevenció</p>
                    <p className="text-[10px] text-slate-500">09:00 - 14:00</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-2 min-h-[160px]">
                  <div className="bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 p-2 text-xs rounded mb-2">
                    <p className="font-bold text-blue-700 dark:text-blue-300">Dret Laboral I</p>
                    <p className="text-[10px] text-slate-500">10:30 - 13:30</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-2 min-h-[160px]">
                  <div className="bg-orange-100 dark:bg-orange-900/40 border-l-4 border-orange-500 p-2 text-xs rounded mb-2">
                    <p className="font-bold text-orange-700 dark:text-orange-300">Tècniques Negociació</p>
                    <p className="text-[10px] text-slate-500">16:00 - 20:00</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-2 min-h-[160px]">
                  <div className="bg-primary/10 border-l-4 border-primary p-2 text-xs rounded mb-2">
                    <p className="font-bold text-primary">Delegats Prevenció</p>
                    <p className="text-[10px] text-slate-500">09:00 - 14:00</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-card-dark p-2 min-h-[160px]">
                  <div className="bg-green-100 dark:bg-green-900/40 border-l-4 border-green-500 p-2 text-xs rounded mb-2">
                    <p className="font-bold text-green-700 dark:text-green-300">Taller Habilitats</p>
                    <p className="text-[10px] text-slate-500">09:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Cursos en fase d'inscripció</h2>
                <a className="text-primary text-sm font-medium hover:underline" href="#">Veure tots</a>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <span className="material-icons-outlined text-slate-400">gavel</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Igualtat a l'empresa</h4>
                      <p className="text-xs text-slate-500">Edició Barcelona · 25 places disponibles</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[80%]"></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">80% ple</span>
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                      <span className="material-icons-outlined text-sm text-slate-500">more_vert</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <span className="material-icons-outlined text-slate-400">language</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Anglès Nivell A2 (Bàsic)</h4>
                      <p className="text-xs text-slate-500">Online · 4 places disponibles</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[92%]"></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">92% ple</span>
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                      <span className="material-icons-outlined text-sm text-slate-500">more_vert</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <span className="material-icons-outlined text-slate-400">terminal</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-white">Ofimàtica de Gestió</h4>
                      <p className="text-xs text-slate-500">Tarragona · 12 places disponibles</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[45%]"></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">45% ple</span>
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                      <span className="material-icons-outlined text-sm text-slate-500">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="font-bold text-lg flex items-center text-slate-800 dark:text-white">
                  <span className="material-icons-outlined mr-2 text-slate-400">bolt</span>
                  Activitat Recents
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Nova inscripció</p>
                      <p className="text-xs text-slate-500 mt-1">Joan Garcia s'ha inscrit a "Dret Laboral I"</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">Fa 5 minuts</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 mt-1.5 bg-primary rounded-full mr-4 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Certificat Generat</p>
                      <p className="text-xs text-slate-500 mt-1">Es can generar 15 certificats del curs "Salut Laboral"</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">Fa 42 minuts</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Nou curs publicat</p>
                      <p className="text-xs text-slate-500 mt-1">"Intel·ligència Artificial per a Delegats" ja és visible</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">Fa 2 hores</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 mt-1.5 bg-orange-400 rounded-full mr-4 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">Modificació d'Horari</p>
                      <p className="text-xs text-slate-500 mt-1">Aula canviada per al curs de Negociació del dijous</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">Fa 5 hores</p>
                    </div>
                  </li>
                </ul>
                <button className="w-full mt-6 py-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                  Veure tot l'historial
                </button>
              </div>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Objectiu del Trimestre</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-white">78%</span>
                <span className="text-xs text-slate-500">1,560 / 2,000 alumnes</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[78%]"></div>
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                Estem un 5% per sobre de l'objectiu respecte al mateix període de l'any anterior.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="flex flex-col items-center space-y-2">
          <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
          <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
        </div>
      </footer>
    </div>
  );
};

// New CreateCourse Component (Wizard Style - Strict User Code + Global Fixes)
const CreateCourse = ({ onBack, toggleDarkMode, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [activeSection, setActiveSection] = useState(1); // For Step 1 (Sub-steps 1 & 2)

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Sidebar Helper Component
  const SidebarStep = ({ number, title, isActive, isCompleted, onClick }) => {
    let baseClasses = "flex items-center group cursor-pointer p-3 rounded-lg transition-all border-l-4";
    let activeClasses = "bg-white dark:bg-card-dark border-primary shadow-sm";
    let inactiveClasses = "hover:bg-white dark:hover:bg-card-dark border-transparent opacity-60"; // Inactive/Future

    // If completed (but not active), maybe show checkmark or green? Keeping it simple for now based on request.
    const divClasses = isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
    const circleClasses = isActive
      ? "w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mr-4"
      : "w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm mr-4";

    const textClasses = isActive
      ? "font-semibold text-slate-900 dark:text-white"
      : "font-medium text-slate-500";

    return (
      <div className={divClasses} onClick={onClick}>
        <div className={circleClasses}>{number}</div>
        <span className={textClasses}>{title}</span>
      </div>
    );
  };

  // Step 1: Dades Generals i Planificació
  if (step === 1) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
        <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <img src="/logo-ugt.png" alt="UGT Formació" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UGT <span className="text-[#E30613]">Formació</span></span>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('dashboard')}>
              <span className="material-icons-outlined mr-3 text-2xl">dashboard</span>
              Tauler de Control
            </a>
            <a className="flex items-center px-4 py-3 bg-[#E30613]/10 text-[#E30613] rounded-lg font-bold transition-all" href="#">
              <span className="material-icons-outlined mr-3 text-2xl">school</span>
              Cursos Actius
            </a>
            <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('students')}>
              <span className="material-icons-outlined mr-3 text-2xl">people</span>
              Alumnat
            </a>
            <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('certificates')}>
              <span className="material-icons-outlined mr-3 text-2xl">assignment</span>
              Certificats
            </a>
            <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('reports')}>
              <span className="material-icons-outlined mr-3 text-2xl">analytics</span>
              Informes
            </a>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={toggleDarkMode}
            >
              <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
              Mode Nit
            </button>
          </div>
        </aside>

        <main className="lg:ml-64 p-6 lg:p-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <nav aria-label="Breadcrumb" className="flex mb-2 text-sm text-slate-500">
                <ol className="inline-flex items-center space-x-1">
                  <li className="inline-flex items-center">
                    <a className="hover:text-primary transition-colors" href="#" onClick={onBack}>Cursos Actius</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                    <span className="font-medium text-slate-900 dark:text-white">Nou Curs</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Crear Nou Curs</h1>
              <p className="text-slate-500 dark:text-slate-400">Configura la nova acció formativa de la UGT de Catalunya</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-5 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-card-dark shadow-sm">
                Desa com a Esborrany
              </button>
              <button
                className="px-6 py-2.5 bg-primary hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-md flex items-center"
                onClick={() => setStep(2)}
              >
                Següent
                <span className="material-icons-outlined ml-2 text-[20px]">arrow_forward</span>
              </button>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="lg:w-72 shrink-0">
              <nav className="sticky top-10 flex flex-col space-y-2">
                <SidebarStep number="1" title="Dades Generals" isActive={activeSection === 1} onClick={() => { setActiveSection(1); document.getElementById('gen-info')?.scrollIntoView({ behavior: 'smooth' }); }} />
                <SidebarStep number="2" title="Planificació" isActive={activeSection === 2} onClick={() => { setActiveSection(2); document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' }); }} />
                <SidebarStep number="3" title="Docència i Documentació" isActive={false} />
                <SidebarStep number="4" title="Inscripció" isActive={false} />
              </nav>
            </aside>

            <div className="flex-1 max-w-4xl space-y-10">
              <section id="gen-info" className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                onClick={() => setActiveSection(1)} onFocus={() => setActiveSection(1)}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                    <span className="material-icons-outlined mr-2 text-primary">info</span>
                    1. Dades Generals
                  </h2>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="nom_curs">Nom del Curs</label>
                      <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="nom_curs" placeholder="Ex: Taller de Mediació i Resolució de Conflictes" type="text" onFocus={() => setActiveSection(1)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="categoria">Categoria</label>
                      <select className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="categoria" onFocus={() => setActiveSection(1)}>
                        <option value="">Selecciona una categoria</option>
                        <option>Dret Laboral</option>
                        <option>Prevenció de Riscos</option>
                        <option>Habilitats Sindicals</option>
                        <option>Igualtat i Gènere</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="contrasenya">Contrasenya d'accés (opcional)</label>
                      <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="contrasenya" placeholder="••••••••" type="password" onFocus={() => setActiveSection(1)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Hero / Portada</label>
                    <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 transition-colors hover:border-primary/50 text-center"
                      onClick={() => setActiveSection(1)}>
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                          <span className="material-icons-outlined text-slate-400 group-hover:text-primary text-3xl">add_photo_alternate</span>
                        </div>
                        <div>
                          <button className="text-primary font-bold hover:underline">Puja una imatge</button>
                          <span className="text-slate-500 dark:text-slate-400"> o arrossega i deixa anar</span>
                        </div>
                        <p className="text-xs text-slate-400">Format PNG, JPG o WEBP recomanat (màxim 5MB)</p>
                      </div>
                      <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" onFocus={() => setActiveSection(1)} />
                    </div>
                  </div>
                </div>
              </section>

              <section id="planning" className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                onClick={() => setActiveSection(2)} onFocus={() => setActiveSection(2)}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                    <span className="material-icons-outlined mr-2 text-primary">calendar_month</span>
                    2. Planificació
                  </h2>
                </div>
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">Tipus de sessions</span>
                      <span className="text-xs text-slate-500">Defineix si el curs té una o múltiples dates</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-500">Sessió Única</span>
                      <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                        <input className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300" id="toggle" name="toggle" type="checkbox" onFocus={() => setActiveSection(2)} />
                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer" htmlFor="toggle"></label>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Sessions Múltiples</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data d'inici</label>
                      <div className="relative">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">event</span>
                        <input className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" type="date" onFocus={() => setActiveSection(2)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data de finalització</label>
                      <div className="relative">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">event</span>
                        <input className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" type="date" onFocus={() => setActiveSection(2)} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="num_places">Número de Places</label>
                      <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="num_places" type="number" defaultValue="25" onFocus={() => setActiveSection(2)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="professor">Professor/a</label>
                    <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="professor" placeholder="Nom del docent" type="text" onFocus={() => setActiveSection(2)} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Llistat de Sessions</h3>
                      <button className="text-xs font-bold text-primary flex items-center hover:opacity-80" onClick={() => setActiveSection(2)}>
                        <span className="material-icons-outlined text-sm mr-1">add_circle</span>
                        AFEGIR SESSIÓ
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg text-sm">
                        <div className="w-8 font-bold text-slate-400">01</div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="font-medium">15/10/2024</div>
                          <div className="text-slate-500">09:00 - 14:00</div>
                          <div className="text-slate-500 hidden md:block">Aula 402 - BCN</div>
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-slate-400 hover:text-slate-600"><span className="material-icons-outlined text-[20px]">edit</span></button>
                            <button className="p-1 text-slate-400 hover:text-red-600"><span className="material-icons-outlined text-[20px]">delete</span></button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg text-sm">
                        <div className="w-8 font-bold text-slate-400">02</div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="font-medium">16/10/2024</div>
                          <div className="text-slate-500">09:00 - 14:00</div>
                          <div className="text-slate-500 hidden md:block">Aula 402 - BCN</div>
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-slate-400 hover:text-slate-600"><span className="material-icons-outlined text-[20px]">edit</span></button>
                            <button className="p-1 text-slate-400 hover:text-red-600"><span className="material-icons-outlined text-[20px]">delete</span></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-between items-center pt-4">
                <button className="px-8 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center" onClick={onBack}>
                  <span className="material-icons-outlined mr-2">close</span>
                  Cancel·lar
                </button>
                <div className="flex space-x-4">
                  <button
                    className="px-8 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-md flex items-center"
                    onClick={() => setStep(2)}
                  >
                    Següent
                    <span className="material-icons-outlined ml-2">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="flex flex-col items-center space-y-2">
              <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
              <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // Step 2: Docència i Documentació
  if (step === 2) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
        <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <img src="/logo-ugt.png" alt="UGT Formació" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UGT <span className="text-[#E30613]">Formació</span></span>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('dashboard')}>
              <span className="material-icons-outlined mr-3 text-2xl">dashboard</span>
              Tauler de Control
            </a>
            <a className="flex items-center px-4 py-3 bg-[#E30613]/10 text-[#E30613] rounded-lg font-bold transition-all" href="#">
              <span className="material-icons-outlined mr-3 text-2xl">school</span>
              Cursos Actius
            </a>
            <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('students')}>
              <span className="material-icons-outlined mr-3 text-2xl">people</span>
              Alumnat
            </a>
            <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('certificates')}>
              <span className="material-icons-outlined mr-3 text-2xl">assignment</span>
              Certificats
            </a>
            <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('reports')}>
              <span className="material-icons-outlined mr-3 text-2xl">analytics</span>
              Informes
            </a>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={toggleDarkMode}
            >
              <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
              Mode Nit
            </button>
          </div>
        </aside>

        <main className="lg:ml-64 p-6 lg:p-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <nav aria-label="Breadcrumb" className="flex mb-2 text-sm text-slate-500">
                <ol className="inline-flex items-center space-x-1">
                  <li className="inline-flex items-center">
                    <a className="hover:text-primary transition-colors" href="#" onClick={onBack}>Cursos Actius</a>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                    <span className="font-medium text-slate-900 dark:text-white">Nou Curs</span>
                  </li>
                  <li className="flex items-center">
                    <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                    <span className="font-medium text-slate-900 dark:text-white">Docència i Documentació</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Crear Nou Curs</h1>
              <p className="text-slate-500 dark:text-slate-400">Configura l'equip docent i els materials del curs</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-5 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-card-dark shadow-sm">
                Desa com a Esborrany
              </button>
              <button
                className="px-6 py-2.5 bg-primary hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-md flex items-center"
                onClick={() => setStep(3)}
              >
                Següent
                <span className="material-icons-outlined ml-2 text-[20px]">arrow_forward</span>
              </button>
            </div>
          </header>
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="lg:w-72 shrink-0">
              <nav className="sticky top-10 flex flex-col space-y-2">
                <SidebarStep number="1" title="Dades Generals" isActive={false} isCompleted={true} />
                <SidebarStep number="2" title="Planificació" isActive={false} isCompleted={true} />
                <SidebarStep number="3" title="Docència i Documentació" isActive={true} />
                <SidebarStep number="4" title="Inscripció" isActive={false} />
              </nav>
            </aside>
            <div className="flex-1 max-w-4xl space-y-10">
              <section className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                    <span className="material-icons-outlined mr-2 text-primary">groups</span>
                    Equip Docent
                  </h2>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="docent_principal">Docent Principal</label>
                      <div className="relative">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">person</span>
                        <select className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="docent_principal">
                          <option value="">Selecciona un docent</option>
                          <option>Jordi Garcia (Dret Laboral)</option>
                          <option>Marta Vila (Igualtat)</option>
                          <option>Pere Soler (Riscos Laborals)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="equip_docent">Equip Docent Auxiliar</label>
                      <div className="relative">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">group_add</span>
                        <input className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" id="equip_docent" placeholder="Cerca i afegeix col·laboradors..." type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                    <span className="material-icons-outlined mr-2 text-primary">upload_file</span>
                    Materials del Curs
                  </h2>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 transition-colors hover:border-primary/50 text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                          <span className="material-icons-outlined text-slate-400 group-hover:text-primary text-3xl">picture_as_pdf</span>
                        </div>
                        <div>
                          <button className="text-primary font-bold hover:underline">Adjunta fitxers</button>
                          <span className="text-slate-500 dark:text-slate-400"> o arrossega i deixa anar</span>
                        </div>
                        <p className="text-xs text-slate-400">Materials de lectura, guies i exercicis (PDF, DOCX, PPTX fins a 20MB)</p>
                      </div>
                      <input className="absolute inset-0 opacity-0 cursor-pointer" multiple="" type="file" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Fitxers Seleccionats</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center">
                          <span className="material-icons-outlined text-primary mr-3">description</span>
                          <div>
                            <p className="text-sm font-medium">Guia_Sindical_2024.pdf</p>
                            <p className="text-[10px] text-slate-400 uppercase">2.4 MB • PDF</p>
                          </div>
                        </div>
                        <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                          <span className="material-icons-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                    <span className="material-icons-outlined mr-2 text-primary">link</span>
                    Gestió de Continguts i Enllaços
                  </h2>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Descripció o instruccions addicionals</label>
                    <textarea className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3 min-h-[120px]" placeholder="Afegeix instruccions per als alumnes o una breu descripció dels materials..."></textarea>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Enllaços d'interès</h3>
                      <button className="text-xs font-bold text-primary flex items-center hover:opacity-80">
                        <span className="material-icons-outlined text-sm mr-1">add_circle</span>
                        AFEGIR ENLLAÇ
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center justify-between group">
                        <div className="flex items-center truncate">
                          <span className="material-icons-outlined text-slate-400 mr-3">link</span>
                          <div className="truncate">
                            <p className="text-sm font-semibold truncate">Estatuts UGT Catalunya</p>
                            <p className="text-xs text-slate-400 truncate">https://www.ugt.cat/estatuts...</p>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all">
                          <span className="material-icons-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="flex justify-between items-center pt-4">
                <button
                  className="px-8 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center"
                  onClick={() => setStep(1)}
                >
                  <span className="material-icons-outlined mr-2">arrow_back</span>
                  Enrere
                </button>
                <div className="flex space-x-4">
                  <button
                    className="px-8 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-md flex items-center"
                    onClick={() => setStep(3)}
                  >
                    Següent
                    <span className="material-icons-outlined ml-2">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="flex flex-col items-center space-y-2">
              <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
              <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // Step 3: Inscripció
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-ugt.png" alt="UGT Formació" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UGT <span className="text-[#E30613]">Formació</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('dashboard')}>
            <span className="material-icons-outlined mr-3 text-2xl">dashboard</span>
            Tauler de Control
          </a>
          <a className="flex items-center px-4 py-3 bg-[#E30613]/10 text-[#E30613] rounded-lg font-bold transition-all" href="#">
            <span className="material-icons-outlined mr-3 text-2xl">school</span>
            Cursos Actius
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('students')}>
            <span className="material-icons-outlined mr-3 text-2xl">people</span>
            Alumnat
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('certificates')}>
            <span className="material-icons-outlined mr-3 text-2xl">assignment</span>
            Certificats
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('reports')}>
            <span className="material-icons-outlined mr-3 text-2xl">analytics</span>
            Informes
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={toggleDarkMode}
          >
            <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
            Mode Nit
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <nav aria-label="Breadcrumb" className="flex mb-2 text-sm text-slate-500">
              <ol className="inline-flex items-center space-x-1">
                <li className="inline-flex items-center">
                  <a className="hover:text-primary transition-colors" href="#" onClick={onBack}>Cursos Actius</a>
                </li>
                <li className="flex items-center">
                  <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                  <span className="font-medium text-slate-900 dark:text-white">Nou Curs</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons-outlined text-sm mx-1">chevron_right</span>
                  <span className="font-medium text-slate-900 dark:text-white">Inscripció</span>
                </li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pas 4: Inscripció</h1>
            <p className="text-slate-500 dark:text-slate-400">Finalitza la configuració del procés d'inscripció i publica el curs</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-5 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-card-dark shadow-sm">
              Desa com a Esborrany
            </button>
            <button
              className="px-6 py-2.5 bg-primary hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-md flex items-center"
              onClick={() => onNavigate('dashboard')}
            >
              Publicar Curs
              <span className="material-icons-outlined ml-2 text-[20px]">publish</span>
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-72 shrink-0">
            <nav className="sticky top-10 flex flex-col space-y-2">
              <SidebarStep number="1" title="Dades Generals" isActive={false} isCompleted={true} />
              <SidebarStep number="2" title="Planificació" isActive={false} isCompleted={true} />
              <SidebarStep number="3" title="Docència i Documentació" isActive={false} isCompleted={true} />
              <SidebarStep number="4" title="Inscripció" isActive={true} />
            </nav>
          </aside>

          <div className="flex-1 max-w-4xl space-y-10">
            <section className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                  <span className="material-icons-outlined mr-2 text-primary">app_registration</span>
                  4. Paràmetres d'Inscripció
                </h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Data límit d'inscripció</label>
                    <div className="relative">
                      <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">event_busy</span>
                      <input className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3" type="date" />
                    </div>
                    <p className="mt-2 text-xs text-slate-400 italic">Després d'aquesta data, el formulari quedarà tancat automàticament.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Control d'aforament</label>
                    <div className="relative">
                      <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">groups</span>
                      <select className="w-full pl-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all p-3">
                        <option>Limitar per nombre de places (25)</option>
                        <option>Sense límit d'inscripció</option>
                        <option>Validació manual administrativa</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white">Llista d'espera automàtica</span>
                    <span className="text-xs text-slate-500">Permet seguir rebent inscripcions un cop esgotades les places</span>
                  </div>
                  <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                    <input className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300" id="espera" name="espera" type="checkbox" defaultChecked />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer" htmlFor="espera"></label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Camps personalitzats del formulari</h3>
                    <button className="text-xs font-bold text-primary flex items-center hover:opacity-80">
                      <span className="material-icons-outlined text-sm mr-1">add_circle</span>
                      AFEGIR CAMP
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                      <span className="material-icons-outlined text-slate-400 mr-3">drag_indicator</span>
                      <div className="flex-1 text-sm font-medium">DNI / NIE</div>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 uppercase">Obligatori</span>
                        <button className="p-1 text-slate-400 hover:text-slate-600"><span className="material-icons-outlined text-[20px]">edit</span></button>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                      <span className="material-icons-outlined text-slate-400 mr-3">drag_indicator</span>
                      <div className="flex-1 text-sm font-medium">Empresa / Centre de treball</div>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 uppercase">Obligatori</span>
                        <button className="p-1 text-slate-400 hover:text-slate-600"><span className="material-icons-outlined text-[20px]">edit</span></button>
                        <button className="p-1 text-slate-400 hover:text-red-600"><span className="material-icons-outlined text-[20px]">delete</span></button>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg opacity-60">
                      <span className="material-icons-outlined text-slate-400 mr-3">drag_indicator</span>
                      <div className="flex-1 text-sm font-medium">Observacions de dieta</div>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 uppercase">Opcional</span>
                        <button className="p-1 text-slate-400 hover:text-slate-600"><span className="material-icons-outlined text-[20px]">edit</span></button>
                        <button className="p-1 text-slate-400 hover:text-red-600"><span className="material-icons-outlined text-[20px]">delete</span></button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Previsualització de l'enllaç públic</label>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-3 group border border-slate-200 dark:border-slate-800">
                    <span className="material-icons-outlined text-slate-400 mr-2 text-sm">link</span>
                    <code className="text-xs text-primary font-mono flex-1 truncate">https://formacio.ugt.cat/inscripcio/taller-mediacio-2024</code>
                    <button className="ml-2 text-slate-500 hover:text-primary transition-colors">
                      <span className="material-icons-outlined text-sm">content_copy</span>
                    </button>
                    <button className="ml-2 text-slate-500 hover:text-primary transition-colors">
                      <span className="material-icons-outlined text-sm">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-between items-center pt-4">
              <button
                className="px-8 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center"
                onClick={() => setStep(2)}
              >
                <span className="material-icons-outlined mr-2">arrow_back</span>
                Enrere
              </button>
              <div className="flex space-x-4">
                <button
                  className="px-8 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-md flex items-center"
                  onClick={() => onNavigate('dashboard')}
                >
                  Publicar Curs
                  <span className="material-icons-outlined ml-2">check_circle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <div className="flex flex-col items-center space-y-2">
            <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
            <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

// ActiveCourses Component (Strict User Code + Global Fixes)
const ActiveCourses = ({ onNavigate, toggleDarkMode }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-ugt.png" alt="UGT Formació" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UGT <span className="text-[#E30613]">Formació</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('dashboard')}>
            <span className="material-icons-outlined mr-3 text-2xl">dashboard</span>
            Tauler de Control
          </a>
          <a className="flex items-center px-4 py-3 bg-[#E30613]/10 text-[#E30613] rounded-lg font-bold transition-all" href="#">
            <span className="material-icons-outlined mr-3 text-2xl">school</span>
            Cursos Actius
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('students')}>
            <span className="material-icons-outlined mr-3 text-2xl">people</span>
            Alumnat
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('certificates')}>
            <span className="material-icons-outlined mr-3 text-2xl">assignment</span>
            Certificats
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('reports')}>
            <span className="material-icons-outlined mr-3 text-2xl">analytics</span>
            Informes
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={toggleDarkMode}
          >
            <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
            Mode Nit
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Cursos Actius</h1>
            <p className="text-slate-500 dark:text-slate-400">Monitorització de la formació en curs i inscripcions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input className="pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-64 transition-all" placeholder="Buscar per curs, tutor..." type="text" />
            </div>
            <button
              className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
              onClick={() => onNavigate('create-course')}
            >
              <span className="material-icons-outlined mr-2 text-[20px]">add</span>
              Nou Curs
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <button className="px-4 py-1.5 text-sm font-medium bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-full shadow-sm">Tots els cursos</button>
                <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">En curs</button>
                <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">Inscripcions</button>
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <span className="mr-2 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">ORDENAT PER:</span>
                <select className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-700 dark:text-slate-300">
                  <option>Data d'inici</option>
                  <option>Ocupació</option>
                  <option>Ordre alfabètic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">INSCRIPCIONS OBERTES</span>
                    <button className="text-slate-400 hover:text-slate-600"><span className="material-icons-outlined">more_horiz</span></button>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white leading-tight">Dret Laboral i Sindical per a Delegats</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="material-icons-outlined text-sm mr-2">calendar_today</span>
                      15 Set - 20 Oct 2024
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="material-icons-outlined text-sm mr-2">location_on</span>
                      Presencial - Barcelona
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase">OCUPACIÓ</span>
                      <span className="text-xs font-bold text-primary">22/25 places</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[88%]"></div>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-xl flex justify-between items-center">
                  <a className="text-sm font-semibold text-primary flex items-center hover:underline" href="#">
                    <span className="material-icons-outlined text-sm mr-1.5">fact_check</span>
                    Assistència
                  </a>
                  <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900">Detalls</button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">EN CURS</span>
                    <button className="text-slate-400 hover:text-slate-600"><span className="material-icons-outlined">more_horiz</span></button>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white leading-tight">Negociació Col·lectiva a l'Empresa</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="material-icons-outlined text-sm mr-2">calendar_today</span>
                      01 Jun - 15 Jul 2024
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="material-icons-outlined text-sm mr-2">laptop</span>
                      Aula Virtual (Online)
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase">OCUPACIÓ</span>
                      <span className="text-xs font-bold text-primary">30/30 places</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[100%]"></div>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-xl flex justify-between items-center">
                  <a className="text-sm font-semibold text-primary flex items-center hover:underline" href="#">
                    <span className="material-icons-outlined text-sm mr-1.5">fact_check</span>
                    Assistència
                  </a>
                  <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900">Detalls</button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">INSCRIPCIONS OBERTES</span>
                    <button className="text-slate-400 hover:text-slate-600"><span className="material-icons-outlined">more_horiz</span></button>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white leading-tight">Salut Laboral i Prevenció Avançada</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="material-icons-outlined text-sm mr-2">calendar_today</span>
                      20 Oct - 30 Nov 2024
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="material-icons-outlined text-sm mr-2">location_on</span>
                      Presencial - Tarragona
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase">OCUPACIÓ</span>
                      <span className="text-xs font-bold text-primary">12/20 places</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[60%]"></div>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-xl flex justify-between items-center">
                  <a className="text-sm font-semibold text-primary flex items-center hover:underline" href="#">
                    <span className="material-icons-outlined text-sm mr-1.5">fact_check</span>
                    Assistència
                  </a>
                  <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900">Detalls</button>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">EN CURS</span>
                    <button className="text-slate-400 hover:text-slate-600"><span className="material-icons-outlined">more_horiz</span></button>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white leading-tight">Digitalització i Canvi Tecnològic</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="material-icons-outlined text-sm mr-2">calendar_today</span>
                      05 Jun - 28 Jun 2024
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <span className="material-icons-outlined text-sm mr-2">location_on</span>
                      Presencial - Lleida
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase">OCUPACIÓ</span>
                      <span className="text-xs font-bold text-primary">15/15 places</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[100%]"></div>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-xl flex justify-between items-center">
                  <a className="text-sm font-semibold text-primary flex items-center hover:underline" href="#">
                    <span className="material-icons-outlined text-sm mr-1.5">fact_check</span>
                    Assistència
                  </a>
                  <button className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900">Detalls</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center">
                <span className="material-icons-outlined mr-2 text-primary">analytics</span>
                Estadístiques
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">OCUPACIÓ MITJANA</p>
                  <div className="flex items-end justify-between mb-1.5">
                    <span className="text-2xl font-bold">84%</span>
                    <span class="text-xs text-green-600 font-bold">+3.2% ↑</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[84%]"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">CURSOS ACTIUS</p>
                    <p className="text-xl font-bold">18</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">INSCRIPCIONS</p>
                    <p className="text-xl font-bold">428</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h2 className="font-bold text-lg mb-6 flex items-center">
                <span className="material-icons-outlined mr-2 text-primary">notifications_active</span>
                Alertes Recents
              </h2>
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="material-icons-outlined text-primary text-lg">group_add</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Curs prop del límit</p>
                    <p className="text-[11px] text-slate-500 mt-1">"Dret Laboral" té només 3 places lliures (Barcelona).</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Fa 10 minuts</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="material-icons-outlined text-orange-600 text-lg">event_busy</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Sessió sense llista</p>
                    <p className="text-[11px] text-slate-500 mt-1">Falta registrar l'assistència d'ahir a "Negociació Col·lectiva".</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Fa 1 hora</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="material-icons-outlined text-green-600 text-lg">verified</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Inscripció aprovada</p>
                    <p className="text-[11px] text-slate-500 mt-1">Validat nou alumne al curs de Salut Laboral (Tarragona).</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Fa 3 hores</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2.5 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider">
                VEURE TOTES LES ALERTES
              </button>
            </div>
          </div>
        </div>

        <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <div className="flex flex-col items-center space-y-2">
            <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
            <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Students Component (Strict User Code + Global Fixes)
const Students = ({ onNavigate, toggleDarkMode }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-ugt.png" alt="UGT Formació" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UGT <span className="text-[#E30613]">Formació</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('dashboard')}>
            <span className="material-icons-outlined mr-3 text-2xl">dashboard</span>
            Tauler de Control
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('active-courses')}>
            <span className="material-icons-outlined mr-3 text-2xl">school</span>
            Cursos Actius
          </a>
          <a className="flex items-center px-4 py-3 bg-[#E30613]/10 text-[#E30613] rounded-lg font-bold transition-all" href="#">
            <span className="material-icons-outlined mr-3 text-2xl">group</span>
            Alumnat
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('certificates')}>
            <span className="material-icons-outlined mr-3 text-2xl">assignment</span>
            Certificats
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('reports')}>
            <span className="material-icons-outlined mr-3 text-2xl">analytics</span>
            Informes
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={toggleDarkMode}
          >
            <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
            Mode Nit
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestió d'Alumnat</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Administració centralitzada de participants i inscripcions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input className="pl-10 pr-4 py-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-72 transition-all text-sm" placeholder="Buscar per nom o DNI..." type="text" />
            </div>
            <button className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm">
              <span className="material-icons-outlined mr-2 text-[20px]">person_add</span>
              Inscriure Alumne
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Alumnes Actius</h3>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-primary rounded-lg">
                <span className="material-icons-outlined text-[20px]">groups</span>
              </div>
            </div>
            <p className="text-3xl font-bold">842</p>
            <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
              <span className="material-icons-outlined text-[14px] mr-1">trending_up</span>
              +3.2% vs mes anterior
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Noves Inscripcions (Mes)</h3>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                <span className="material-icons-outlined text-[20px]">assignment_ind</span>
              </div>
            </div>
            <p className="text-3xl font-bold">128</p>
            <div className="flex items-center mt-2 text-xs text-green-600 font-medium">
              <span className="material-icons-outlined text-[14px] mr-1">trending_up</span>
              15 inscripcions avui
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Taxa d'Abandonament</h3>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                <span className="material-icons-outlined text-[20px]">person_off</span>
              </div>
            </div>
            <p className="text-3xl font-bold">4.2%</p>
            <div className="flex items-center mt-2 text-xs text-slate-500 font-medium">
              <span className="material-icons-outlined text-[14px] mr-1">horizontal_rule</span>
              Estable des de maig
            </div>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-bold text-lg">Llistat detallat d'alumnat</h2>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-icons-outlined mr-1.5 text-[18px]">filter_list</span>
                Filtres
              </button>
              <button className="flex items-center px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-icons-outlined mr-1.5 text-[18px]">download</span>
                Exportar CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumne/a</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Curs</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estat</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Accions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold mr-3">JG</div>
                      <div>
                        <p className="font-semibold text-sm">Joan Garcia i Martí</p>
                        <p className="text-xs text-slate-500">46882231-K</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">Dret Laboral I</p>
                    <p className="text-xs text-slate-500">Inici: 10/06/2024</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">En curs</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors" title="Veure perfil">
                        <span className="material-icons-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors" title="Contactar WhatsApp">
                        <span className="material-icons-outlined text-[20px]">chat</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Editar">
                        <span className="material-icons-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold mr-3">MR</div>
                      <div>
                        <p className="font-semibold text-sm">Maria Rodríguez Soler</p>
                        <p className="text-xs text-slate-500">38991244-S</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">Salut Laboral Avançada</p>
                    <p className="text-xs text-slate-500">Inici: 15/05/2024</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">Finalitzat</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-icons-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                        <span className="material-icons-outlined text-[20px]">chat</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-icons-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold mr-3">AL</div>
                      <div>
                        <p className="font-semibold text-sm">Andreu Lopez Vila</p>
                        <p className="text-xs text-slate-500">51229003-L</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">Tècniques de Negociació</p>
                    <p className="text-xs text-slate-500">Pendent inici</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">Inscrit</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-icons-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                        <span className="material-icons-outlined text-[20px]">chat</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-icons-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold mr-3">CM</div>
                      <div>
                        <p className="font-semibold text-sm">Carla Mestre Mas</p>
                        <p className="text-xs text-slate-500">47663211-M</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">Igualtat a l'empresa</p>
                    <p className="text-xs text-slate-500">Inici: 12/06/2024</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">En curs</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-icons-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                        <span className="material-icons-outlined text-[20px]">chat</span>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-icons-outlined text-[20px]">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Mostrant 1-4 de 842 alumnes</span>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50" disabled="">
                <span className="material-icons-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800">
                <span className="material-icons-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <div className="flex flex-col items-center space-y-2">
            <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
            <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Certificates Component (Strict User Code + Global Fixes)
const Certificates = ({ onNavigate, toggleDarkMode }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-ugt.png" alt="UGT Formació" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UGT <span className="text-[#E30613]">Formació</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('dashboard')}>
            <span className="material-icons-outlined mr-3 text-2xl">dashboard</span>
            Tauler de Control
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('active-courses')}>
            <span className="material-icons-outlined mr-3 text-2xl">school</span>
            Cursos Actius
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('students')}>
            <span className="material-icons-outlined mr-3 text-2xl">people</span>
            Alumnat
          </a>
          <a className="flex items-center px-4 py-3 bg-[#E30613]/10 text-[#E30613] rounded-lg font-bold transition-all" href="#">
            <span className="material-icons-outlined mr-3 text-2xl">assignment_turned_in</span>
            Certificats
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('reports')}>
            <span className="material-icons-outlined mr-3 text-2xl">analytics</span>
            Informes
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={toggleDarkMode}
          >
            <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
            Mode Nit
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestió de Certificats</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Emissió i seguiment de les titulacions oficials</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-primary hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center shadow-sm">
              <span className="material-icons-outlined mr-2 text-[20px]">dynamic_feed</span>
              Generar en Bloc
            </button>
          </div>
        </header>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                <span className="material-icons-outlined mr-2 text-primary">pending_actions</span>
                Cursos Pendents de Certificació
              </h2>
              <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider">3 cursos pendents</span>
            </div>
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nom del Curs</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Data Finalització</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Alumnes a Certificar</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Accions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 text-primary flex items-center justify-center mr-3">
                            <span className="material-icons-outlined text-lg">gavel</span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">Delegats Prevenció I</p>
                            <p className="text-xs text-slate-500">Barcelona · Presencial</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-sm text-slate-600 dark:text-slate-400">12/06/2024</td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-bold">18</span>
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <span className="material-icons-outlined text-sm mr-1.5">picture_as_pdf</span> Generar PDF
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-md hover:bg-red-700 transition-colors">
                          <span className="material-icons-outlined text-sm mr-1.5">send</span> Enviar Email
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mr-3">
                            <span className="material-icons-outlined text-lg">language</span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">Anglès per a la Negociació</p>
                            <p className="text-xs text-slate-500">Online</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-sm text-slate-600 dark:text-slate-400">14/06/2024</td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-bold">12</span>
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <span className="material-icons-outlined text-sm mr-1.5">picture_as_pdf</span> Generar PDF
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-md hover:bg-red-700 transition-colors">
                          <span className="material-icons-outlined text-sm mr-1.5">send</span> Enviar Email
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mr-3">
                            <span className="material-icons-outlined text-lg">psychology</span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">Taller de Resolució de Conflictes</p>
                            <p className="text-xs text-slate-500">Tarragona · Presencial</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-sm text-slate-600 dark:text-slate-400">15/06/2024</td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-bold">25</span>
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <span className="material-icons-outlined text-sm mr-1.5">picture_as_pdf</span> Generar PDF
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-md hover:bg-red-700 transition-colors">
                          <span className="material-icons-outlined text-sm mr-1.5">send</span> Enviar Email
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-white">
                <span className="material-icons-outlined mr-2 text-slate-400">history</span>
                Historial de Certificats Enviats
              </h2>
              <div className="relative">
                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">filter_list</span>
                <input className="pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-lg outline-none w-48 transition-all" placeholder="Filtrar historial..." type="text" />
              </div>
            </div>
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
                      <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">Dret Laboral i Sindicalització</p>
                      <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                        <span className="material-icons-outlined text-[12px] mr-1">mail</span> 14 certificats enviats correctament
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Avui, 09:45</p>
                    <button className="text-xs text-primary font-semibold hover:underline mt-1">Detalls</button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
                      <span className="material-icons-outlined text-xl leading-none">task_alt</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">Igualtat a l'Empresa</p>
                      <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                        <span className="material-icons-outlined text-[12px] mr-1">mail</span> 22 certificats enviats correctament
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Ahir, 16:30</p>
                    <button className="text-xs text-primary font-semibold hover:underline mt-1">Detalls</button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full">
                      <span className="material-icons-outlined text-xl leading-none">warning</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">Riscos Laborals Avançat</p>
                      <p className="text-[11px] text-slate-500 uppercase tracking-tighter flex items-center">
                        <span className="material-icons-outlined text-[12px] mr-1">mail</span> 8/10 enviats (2 errors)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">10 Juny, 11:20</p>
                    <button className="text-xs text-primary font-semibold hover:underline mt-1 text-orange-600">Reintentar</button>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-200 dark:border-slate-800">
                <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center justify-center w-full">
                  CARREGAR MÉS REGISTRES <span className="material-icons-outlined text-xs ml-1">expand_more</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <div className="flex flex-col items-center space-y-2">
            <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
            <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Reports Component (Strict User Code + Global Fixes)
const Reports = ({ onNavigate, toggleDarkMode }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-ugt.png" alt="UGT Formació" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">UGT <span className="text-[#E30613]">Formació</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('dashboard')}>
            <span className="material-icons-outlined mr-3 text-2xl">dashboard</span>
            Tauler de Control
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('active-courses')}>
            <span className="material-icons-outlined mr-3 text-2xl">school</span>
            Cursos Actius
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('students')}>
            <span className="material-icons-outlined mr-3 text-2xl">groups</span>
            Alumnat
          </a>
          <a className="flex items-center px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors" href="#" onClick={() => onNavigate('certificates')}>
            <span className="material-icons-outlined mr-3 text-2xl">verified</span>
            Certificats
          </a>
          <a className="flex items-center px-4 py-3 bg-[#E30613]/10 text-[#E30613] rounded-lg font-bold transition-all" href="#">
            <span className="material-icons-outlined mr-3 text-2xl">analytics</span>
            Informes
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#E30613] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={toggleDarkMode}
          >
            <span className="material-icons-outlined mr-3 text-xl">dark_mode</span>
            Mode Nit
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Informes i Estadístiques</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Anàlisi detallada de la formació i participació sindical</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center shadow-sm">
              <span className="material-icons-outlined mr-2 text-xl">download</span>
              Exportar (Excel/PDF)
            </button>
          </div>
        </header>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Rang de Dates</label>
              <div className="relative">
                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                <select className="pl-10 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm transition-all">
                  <option>Darrers 12 mesos</option>
                  <option>Aquest any (2024)</option>
                  <option>Any anterior (2023)</option>
                  <option>Personalitzat...</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Departament / Federació</label>
              <select className="px-4 py-2 w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm transition-all">
                <option>Tots els departaments</option>
                <option>Serveis Públics</option>
                <option>Indústria i Construcció</option>
                <option>Comerç i Hostaleria</option>
                <option>Transport</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Modalitat</label>
              <select className="px-4 py-2 w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary text-sm transition-all">
                <option>Totes</option>
                <option>Presencial</option>
                <option>Online</option>
                <option>Híbrid</option>
              </select>
            </div>
            <div className="flex justify-end lg:justify-start">
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors w-full md:w-auto shadow-sm">
                Aplicar Filtres
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Evolució d'Inscripcions</h3>
              <span className="text-xs text-slate-500 font-medium">Inscripcions per mes</span>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2 px-2">
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative h-32 transition-all duration-300 group-hover:bg-primary/20">
                  <div className="absolute bottom-0 w-full bg-primary/40 rounded-t-sm h-[60%]"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 uppercase">Gen</span>
              </div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative h-32 transition-all duration-300 group-hover:bg-primary/20">
                  <div className="absolute bottom-0 w-full bg-primary/60 rounded-t-sm h-[75%]"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 uppercase">Feb</span>
              </div>
              {/* ... manually mapped bars for visual consistency ... */}
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative h-32 transition-all duration-300 group-hover:bg-primary/20">
                  <div className="absolute bottom-0 w-full bg-primary/50 rounded-t-sm h-[40%]"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 uppercase">Mar</span>
              </div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative h-32 transition-all duration-300 group-hover:bg-primary/20">
                  <div className="absolute bottom-0 w-full bg-primary/80 rounded-t-sm h-[90%]"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 uppercase">Abr</span>
              </div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative h-32 transition-all duration-300 group-hover:bg-primary/20">
                  <div className="absolute bottom-0 w-full bg-primary/70 rounded-t-sm h-[85%]"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 uppercase">Mai</span>
              </div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative h-32 transition-all duration-300 group-hover:bg-primary/20">
                  <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[100%]"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 uppercase">Jun</span>
              </div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm relative h-32 transition-all duration-300 group-hover:bg-primary/20">
                  <div className="absolute bottom-0 w-full bg-primary/60 rounded-t-sm h-[65%]"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 uppercase">Jul</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded-sm mr-2"></div>
                <span className="text-xs text-slate-500">Enguany</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-sm mr-2"></div>
                <span className="text-xs text-slate-500">Previst</span>
              </div>
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Tipologia de Cursos</h3>
              <span className="text-xs text-slate-500 font-medium">Distribució sectorial</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-around h-64">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle className="text-slate-100 dark:text-slate-800" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="20"></circle>
                  <circle className="text-primary" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="62.8" strokeWidth="20"></circle>
                  <circle className="text-slate-400 dark:text-slate-600" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="20"></circle>
                  <circle className="text-slate-700 dark:text-slate-300" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="220" strokeWidth="20"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">142</span>
                  <span className="text-[10px] text-slate-500 uppercase">Cursos</span>
                </div>
              </div>
              <div className="space-y-3 mt-6 md:mt-0">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sindical</span>
                  <span className="text-xs text-slate-500">(45%)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Transversal</span>
                  <span className="text-xs text-slate-500">(30%)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-slate-700 dark:bg-slate-300 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tècnica</span>
                  <span className="text-xs text-slate-500">(25%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-6 min-w-max">
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Densitat d'Hores de Formació</h3>
              <p className="text-xs text-slate-500">Distribució d'hores per franja horària i dia de la setmana</p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span>Menys hores</span>
              <div className="flex space-x-1">
                <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
                <div className="w-4 h-4 bg-primary/20 rounded-sm"></div>
                <div className="w-4 h-4 bg-primary/40 rounded-sm"></div>
                <div className="w-4 h-4 bg-primary/60 rounded-sm"></div>
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
              </div>
              <span>Més hores</span>
            </div>
          </div>
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="h-8"></div>
              <div className="h-8 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">Dilluns</div>
              <div className="h-8 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">Dimarts</div>
              <div className="h-8 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">Dimecres</div>
              <div className="h-8 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">Dijous</div>
              <div className="h-8 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">Divendres</div>
              <div className="h-8 flex items-center justify-center text-xs font-bold text-slate-400 uppercase text-slate-300">Dissabte</div>
              <div className="h-8 flex items-center justify-center text-xs font-bold text-slate-400 uppercase text-slate-300">Diumenge</div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-8 gap-2">
                <div className="flex items-center text-xs font-medium text-slate-500">08:00 - 10:00</div>
                <div className="aspect-square rounded-sm bg-primary/20"></div>
                <div className="aspect-square rounded-sm bg-primary/40"></div>
                <div className="aspect-square rounded-sm bg-primary/20"></div>
                <div className="aspect-square rounded-sm bg-primary/60"></div>
                <div className="aspect-square rounded-sm bg-primary/40"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div className="grid grid-cols-8 gap-2">
                <div className="flex items-center text-xs font-medium text-slate-500">10:00 - 12:00</div>
                <div className="aspect-square rounded-sm bg-primary/60"></div>
                <div className="aspect-square rounded-sm bg-primary"></div>
                <div className="aspect-square rounded-sm bg-primary/80"></div>
                <div className="aspect-square rounded-sm bg-primary"></div>
                <div className="aspect-square rounded-sm bg-primary/60"></div>
                <div className="aspect-square rounded-sm bg-primary/20"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div className="grid grid-cols-8 gap-2">
                <div className="flex items-center text-xs font-medium text-slate-500">12:00 - 14:00</div>
                <div className="aspect-square rounded-sm bg-primary/40"></div>
                <div className="aspect-square rounded-sm bg-primary/60"></div>
                <div className="aspect-square rounded-sm bg-primary/40"></div>
                <div className="aspect-square rounded-sm bg-primary/60"></div>
                <div className="aspect-square rounded-sm bg-primary/40"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div className="grid grid-cols-8 gap-2">
                <div className="flex items-center text-xs font-medium text-slate-500">16:00 - 18:00</div>
                <div className="aspect-square rounded-sm bg-primary/20"></div>
                <div className="aspect-square rounded-sm bg-primary/40"></div>
                <div className="aspect-square rounded-sm bg-primary/60"></div>
                <div className="aspect-square rounded-sm bg-primary/40"></div>
                <div className="aspect-square rounded-sm bg-primary/20"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div className="grid grid-cols-8 gap-2">
                <div className="flex items-center text-xs font-medium text-slate-500">18:00 - 20:00</div>
                <div className="aspect-square rounded-sm bg-primary/10"></div>
                <div className="aspect-square rounded-sm bg-primary/20"></div>
                <div className="aspect-square rounded-sm bg-primary/40"></div>
                <div className="aspect-square rounded-sm bg-primary/20"></div>
                <div className="aspect-square rounded-sm bg-primary/10"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                <div className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-tight">Taxa de Finalització</h4>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">92.4%</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+1.2% vs 2023</span>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-tight">Hores per Alumne</h4>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">14.8h</span>
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-600 dark:text-slate-300">Mitjana global</span>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-tight">Satisfacció</h4>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">4.8/5</span>
              <div className="flex text-orange-400">
                <span className="material-icons-outlined text-sm">star</span>
                <span className="material-icons-outlined text-sm">star</span>
                <span className="material-icons-outlined text-sm">star</span>
                <span className="material-icons-outlined text-sm">star</span>
                <span className="material-icons-outlined text-sm">star_half</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="lg:ml-64 p-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <div className="flex flex-col items-center space-y-2">
            <img alt="UGT Catalunya Logo" className="h-8 opacity-50 grayscale dark:invert" src="/logo-ugt.png" />
            <p className="text-xs text-slate-400">© 2026 UGT de Catalunya - Àrea de Formació i Educació Sindical</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

// --- APP COMPONENT ---

function App() {
  const [view, setView] = useState('splash'); // 'splash', 'login', 'dashboard', 'create-course', 'active-courses'

  const handleSplashFinish = () => {
    setView('login');
  };

  const handleLogin = () => {
    setView('dashboard');
  };

  const navigateTo = (viewName) => {
    setView(viewName);
  }

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {view === 'splash' && <SplashScreen onFinish={handleSplashFinish} />}
      {view === 'login' && <Login onLogin={handleLogin} />}
      {view === 'dashboard' && <Dashboard onNavigate={navigateTo} toggleDarkMode={toggleDarkMode} />}
      {view === 'create-course' && <CreateCourse onBack={() => navigateTo('dashboard')} onNavigate={navigateTo} toggleDarkMode={toggleDarkMode} />}
      {view === 'active-courses' && <ActiveCourses onNavigate={navigateTo} toggleDarkMode={toggleDarkMode} />}
      {view === 'students' && <Students onNavigate={navigateTo} />}
      {view === 'certificates' && <Certificates onNavigate={navigateTo} />}
      {view === 'reports' && <Reports onNavigate={navigateTo} />}
    </>
  );
}

export default App;

