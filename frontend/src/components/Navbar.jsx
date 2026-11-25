import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white font-display font-bold text-lg flex items-center justify-center shadow-sm shadow-pink-200">
            HD
          </span>
          <div>
            <span className="font-display font-bold text-xl text-stone-900 tracking-tight">
              HelpDesk
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
              Chamados
            </span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-600 hidden sm:inline">
              Olá, <strong className="text-pink-700 font-semibold">{user.nome}</strong>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 rounded-xl transition cursor-pointer"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
