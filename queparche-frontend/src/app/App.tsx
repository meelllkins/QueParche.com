import React, { useState } from 'react';
import { Logo } from './components/Logo';
import { RF06RegistroCompleto } from './components/RF06-RegistroCompleto';
import { RF02RegistroSimple } from './components/RF02-RegistroSimple';
import { RF07Footer } from './components/RF07-Footer';
import { RF03Contacto } from './components/RF03-Contacto';
import { RF10InformacionServicio } from './components/RF10-InformacionServicio';
import { Menu, X, UserPlus, MessageSquare, ClipboardList, LayoutGrid } from 'lucide-react';

type Screen = 'home' | 'rf06' | 'rf02' | 'rf03-contacto' | 'rf10' | 'rf07';

const screens = [
  { id: 'rf06' as Screen, name: 'RF06 - Registro Completo', icon: UserPlus, description: 'Registro completo de emprendedor (2 pasos)' },
  { id: 'rf02' as Screen, name: 'RF02 - Registro Simple', icon: UserPlus, description: 'Registro rápido de emprendedor' },
  { id: 'rf03-contacto' as Screen, name: 'RF03 - Contacto', icon: MessageSquare, description: 'Formulario de contacto y soporte' },
  { id: 'rf10' as Screen, name: 'RF10 - Publicar Servicio', icon: ClipboardList, description: 'Publica información de tu servicio' },
  { id: 'rf07' as Screen, name: 'RF07 - Footer', icon: LayoutGrid, description: 'Pie de página con navegación y redes' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'rf06': return <RF06RegistroCompleto />;
      case 'rf02': return <RF02RegistroSimple />;
      case 'rf03-contacto': return <RF03Contacto />;
      case 'rf10': return <RF10InformacionServicio />;
      case 'rf07': return <RF07Footer />;
      default: return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen !== 'home' && (
        <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={() => setCurrentScreen('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Logo variant="icon" size="sm" />
              <span className="hidden md:block font-bold text-foreground text-lg">QueParche</span>
            </button>
            <div className="hidden md:flex items-center gap-2">
              {screens.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => setCurrentScreen(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${currentScreen === s.id ? 'bg-[var(--queparche-violet)] text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-[var(--queparche-gray)]'}`}>
                    <Icon size={16} />
                    {s.name.split(' - ')[0]}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-[var(--queparche-gray)] transition-colors">
              {menuOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden bg-card border-t border-border px-4 py-3 space-y-2">
              {screens.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => { setCurrentScreen(s.id); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${currentScreen === s.id ? 'bg-[var(--queparche-violet)] text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-[var(--queparche-gray)]'}`}>
                    <Icon size={18} />
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}
        </nav>
      )}
      <div>{renderScreen()}</div>
    </div>
  );
}

function Home({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const colors = ['bg-[var(--queparche-violet)]', 'bg-[var(--queparche-magenta)]', 'bg-[var(--queparche-cyan)]'];
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8"><Logo variant="full" size="lg" /></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[var(--queparche-violet)]">QueParche</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Visibilizando la gastronomía callejera de Medellín</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screens.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => onNavigate(s.id)}
                className="bg-card rounded-2xl p-6 border border-border hover:border-[var(--queparche-violet)] transition-colors text-left">
                <div className={`w-14 h-14 rounded-xl ${colors[i % 3]} flex items-center justify-center mb-4`}>
                  <Icon size={28} className="text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
