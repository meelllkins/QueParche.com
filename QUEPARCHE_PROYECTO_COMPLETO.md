# 🌮 QueParche - Proyecto Completo de Mockups

**Proyecto PPI**: Plataforma web para visibilizar y promocionar lugares de comida callejera en Medellín, Colombia.

---

## 📁 Estructura del Proyecto


```
queparche/
├── src/
│   ├── app/
│   │   ├── App.tsx                          # Aplicación principal con navegación
│   │   └── components/
│   │       ├── Logo.tsx                     # Logo QueParche
│   │       ├── RF06-RegistroCompleto.tsx    # Formulario registro completo
│   │       ├── RF02-RegistroSimple.tsx      # Formulario registro simple
│   │       ├── RF03-Contacto.tsx            # Formulario de contacto
│   │       ├── RF10-InformacionServicio.tsx # Información del servicio
│   │       └── RF07-Footer.tsx              # Footer
│   └── styles/
│       ├── index.css                        # Imports principales
│       ├── fonts.css                        # Tipografías Google Fonts
│       ├── tailwind.css                     # Tailwind base
│       └── theme.css                        # Sistema de colores
├── package.json
└── GUIA_DISENO_QUEPARCHE.md                # Guía de diseño completa
```



---

## 📦 package.json


```json
{
  "name": "@figma/my-make-file",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "build": "vite build"
  },
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "@mui/icons-material": "7.3.5",
    "@mui/material": "7.3.5",
    "@popperjs/core": "2.11.8",
    "@radix-ui/react-accordion": "1.2.3",
    "@radix-ui/react-alert-dialog": "1.1.6",
    "@radix-ui/react-aspect-ratio": "1.1.2",
    "@radix-ui/react-avatar": "1.1.3",
    "@radix-ui/react-checkbox": "1.1.4",
    "@radix-ui/react-collapsible": "1.1.3",
    "@radix-ui/react-context-menu": "2.2.6",
    "@radix-ui/react-dialog": "1.1.6",
    "@radix-ui/react-dropdown-menu": "2.1.6",
    "@radix-ui/react-hover-card": "1.1.6",
    "@radix-ui/react-label": "2.1.2",
    "@radix-ui/react-menubar": "1.1.6",
    "@radix-ui/react-navigation-menu": "1.2.5",
    "@radix-ui/react-popover": "1.1.6",
    "@radix-ui/react-progress": "1.1.2",
    "@radix-ui/react-radio-group": "1.2.3",
    "@radix-ui/react-scroll-area": "1.2.3",
    "@radix-ui/react-select": "2.1.6",
    "@radix-ui/react-separator": "1.1.2",
    "@radix-ui/react-slider": "1.2.3",
    "@radix-ui/react-slot": "1.1.2",
    "@radix-ui/react-switch": "1.1.3",
    "@radix-ui/react-tabs": "1.1.3",
    "@radix-ui/react-toggle-group": "1.1.2",
    "@radix-ui/react-toggle": "1.1.2",
    "@radix-ui/react-tooltip": "1.1.8",
    "canvas-confetti": "1.9.4",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cmdk": "1.1.1",
    "date-fns": "3.6.0",
    "embla-carousel-react": "8.6.0",
    "input-otp": "1.4.2",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "next-themes": "0.4.6",
    "react-day-picker": "8.10.1",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-hook-form": "7.55.0",
    "react-popper": "2.3.0",
    "react-resizable-panels": "2.1.7",
    "react-responsive-masonry": "2.7.1",
    "react-router": "7.13.0",
    "react-slick": "0.31.0",
    "recharts": "2.15.2",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0",
    "tw-animate-css": "1.3.8",
    "vaul": "1.1.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "vite": "6.3.5"
  },
  "peerDependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```



---

## 🎨 ESTILOS

### src/styles/index.css


```css
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
```



### src/styles/tailwind.css


```css
@import "tailwindcss";
```



### src/styles/fonts.css


```css
/* QueParche Typography - Medellín Nocturna */

/* Montserrat Bold - Headers (impacto urbano) */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');

/* Space Grotesk - Acentos (tech-urbano) */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');

/* Inter - Body text (legibilidad moderna) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

/* Typography System */
:root {
  --font-heading: 'Montserrat', sans-serif;
  --font-accent: 'Space Grotesk', monospace;
  --font-body: 'Inter', sans-serif;
}

body {
  font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.text-accent, .accent-text {
  font-family: var(--font-accent);
  font-weight: 600;
}
```



### src/styles/theme.css


```css
@custom-variant dark (&:is(.dark *));

:root {
  /* QueParche - Medellín Nocturna Design System */
  --font-size: 16px;

  /* Base Colors */
  --background: #0A0A0A;
  --foreground: #F5F5F5;

  /* Card & Surfaces */
  --card: #1A1A1A;
  --card-foreground: #F5F5F5;
  --popover: #1A1A1A;
  --popover-foreground: #F5F5F5;

  /* Primary - Violeta Neón */
  --primary: #B026FF;
  --primary-foreground: #F5F5F5;

  /* Secondary - Magenta */
  --secondary: #FF006E;
  --secondary-foreground: #F5F5F5;

  /* Accent - Cian */
  --accent: #00F5FF;
  --accent-foreground: #0A0A0A;

  /* Muted/Subtle */
  --muted: #2D2D2D;
  --muted-foreground: #9CA3AF;

  /* Destructive */
  --destructive: #FF006E;
  --destructive-foreground: #F5F5F5;

  /* Borders & Inputs */
  --border: rgba(255, 255, 255, 0.1);
  --input: transparent;
  --input-background: #1A1A1A;
  --switch-background: #2D2D2D;

  /* Typography */
  --font-weight-medium: 600;
  --font-weight-normal: 400;

  /* Ring/Focus */
  --ring: #B026FF;

  /* Charts */
  --chart-1: #B026FF;
  --chart-2: #FF006E;
  --chart-3: #00F5FF;
  --chart-4: #8B5CF6;
  --chart-5: #EC4899;

  /* Border Radius */
  --radius: 0.75rem;

  /* Sidebar */
  --sidebar: #0A0A0A;
  --sidebar-foreground: #F5F5F5;
  --sidebar-primary: #B026FF;
  --sidebar-primary-foreground: #F5F5F5;
  --sidebar-accent: #1A1A1A;
  --sidebar-accent-foreground: #F5F5F5;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #B026FF;

  /* QueParche Custom Colors */
  --queparche-violet: #B026FF;
  --queparche-violet-light: #8B5CF6;
  --queparche-magenta: #FF006E;
  --queparche-magenta-light: #EC4899;
  --queparche-cyan: #00F5FF;
  --queparche-cyan-dark: #06B6D4;
  --queparche-black: #0A0A0A;
  --queparche-gray-dark: #1A1A1A;
  --queparche-gray: #2D2D2D;
  --queparche-white: #F5F5F5;
}

.dark {
  /* Dark mode uses same tokens as QueParche is dark by default */
  --background: #0A0A0A;
  --foreground: #F5F5F5;
  --card: #1A1A1A;
  --card-foreground: #F5F5F5;
  --popover: #1A1A1A;
  --popover-foreground: #F5F5F5;
  --primary: #B026FF;
  --primary-foreground: #F5F5F5;
  --secondary: #FF006E;
  --secondary-foreground: #F5F5F5;
  --muted: #2D2D2D;
  --muted-foreground: #9CA3AF;
  --accent: #00F5FF;
  --accent-foreground: #0A0A0A;
  --destructive: #FF006E;
  --destructive-foreground: #F5F5F5;
  --border: rgba(255, 255, 255, 0.1);
  --input: #1A1A1A;
  --ring: #B026FF;
  --font-weight-medium: 600;
  --font-weight-normal: 400;
  --chart-1: #B026FF;
  --chart-2: #FF006E;
  --chart-3: #00F5FF;
  --chart-4: #8B5CF6;
  --chart-5: #EC4899;
  --sidebar: #0A0A0A;
  --sidebar-foreground: #F5F5F5;
  --sidebar-primary: #B026FF;
  --sidebar-primary-foreground: #F5F5F5;
  --sidebar-accent: #1A1A1A;
  --sidebar-accent-foreground: #F5F5F5;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #B026FF;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }

  html {
    font-size: var(--font-size);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h3 {
    font-size: var(--text-lg);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h4 {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  label {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  button {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  input {
    font-size: var(--text-base);
    font-weight: var(--font-weight-normal);
    line-height: 1.5;
  }
}
```



---

## ⚛️ COMPONENTES REACT

### src/app/App.tsx


```tsx
import React, { useState } from 'react';
import { Logo } from './components/Logo';
import { RF06RegistroCompleto } from './components/RF06-RegistroCompleto';
import { RF02RegistroSimple } from './components/RF02-RegistroSimple';
import { RF07Footer } from './components/RF07-Footer';
import { RF03Contacto } from './components/RF03-Contacto';
import { RF10InformacionServicio } from './components/RF10-InformacionServicio';
import { Menu, X, FileText, UserPlus, MessageSquare, ClipboardList, LayoutGrid } from 'lucide-react';

type Screen = 'home' | 'rf06' | 'rf02' | 'rf03-contacto' | 'rf10' | 'rf07';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const screens = [
    { id: 'rf06' as Screen, name: 'RF06 - Registro Completo', icon: UserPlus, description: 'Formulario de datos personales del emprendedor' },
    { id: 'rf02' as Screen, name: 'RF02 - Registro Simple', icon: UserPlus, description: 'Registro rápido de emprendedor' },
    { id: 'rf03-contacto' as Screen, name: 'RF03 - Contacto', icon: MessageSquare, description: 'Formulario de contacto y soporte' },
    { id: 'rf10' as Screen, name: 'RF10 - Información', icon: ClipboardList, description: 'Información del servicio' },
    { id: 'rf07' as Screen, name: 'RF07 - Footer', icon: LayoutGrid, description: 'Pie de página con navegación y redes' },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'rf06':
        return <RF06RegistroCompleto />;
      case 'rf02':
        return <RF02RegistroSimple />;
      case 'rf03-contacto':
        return <RF03Contacto />;
      case 'rf10':
        return <RF10InformacionServicio />;
      case 'rf07':
        return <RF07Footer />;
      default:
        return <Home onNavigate={setCurrentScreen} screens={screens} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen !== 'home' && (
        <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Logo variant="icon" size="sm" />
              <span className="hidden md:block font-bold text-foreground text-lg">
                QueParche Mockups
              </span>
            </button>

            <div className="hidden md:flex items-center gap-4">
              {screens.map((screen) => {
                const IconComponent = screen.icon;
                return (
                  <button
                    key={screen.id}
                    onClick={() => setCurrentScreen(screen.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentScreen === screen.id
                        ? 'bg-[var(--queparche-violet)] text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-[var(--queparche-gray)]'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="text-sm font-medium">{screen.name.split(' - ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--queparche-gray)] transition-colors"
            >
              {menuOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden bg-card border-t border-border">
              <div className="px-4 py-3 space-y-2">
                {screens.map((screen) => {
                  const IconComponent = screen.icon;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => {
                        setCurrentScreen(screen.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        currentScreen === screen.id
                          ? 'bg-[var(--queparche-violet)] text-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-[var(--queparche-gray)]'
                      }`}
                    >
                      <IconComponent size={20} />
                      <span className="text-sm font-medium">{screen.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      )}

      <div>{renderScreen()}</div>
    </div>
  );
}

function Home({ onNavigate, screens }: { onNavigate: (screen: Screen) => void; screens: any[] }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Logo variant="full" size="lg" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[var(--queparche-violet)]">
            Mockups de Wireframes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
            Visibilizando la gastronomía callejera de Medellín
          </p>
          <p className="text-sm text-muted-foreground">
            Selecciona un wireframe para ver su mockup de alta fidelidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {screens.map((screen, index) => {
            const IconComponent = screen.icon;
            const colors = ['violet', 'magenta', 'cyan'];
            const color = colors[index % colors.length];
            const bgColor =
              color === 'violet'
                ? 'bg-[var(--queparche-violet)]'
                : color === 'magenta'
                ? 'bg-[var(--queparche-magenta)]'
                : 'bg-[var(--queparche-cyan)]';

            return (
              <button
                key={screen.id}
                onClick={() => onNavigate(screen.id)}
                className="group bg-card rounded-2xl p-6 border border-border hover:border-[var(--queparche-violet)] transition-colors text-left"
              >
                <div className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
                  <IconComponent size={28} className="text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {screen.name}
                </h3>
                <p className="text-sm text-muted-foreground">{screen.description}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            📋 Proyecto PPI - QueParche
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Estética:</h3>
              <p>Urbana, moderna y minimalista inspirada en la Comuna 13 y la vida nocturna paisa</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Paleta:</h3>
              <p>Medellín Nocturna - Violeta neón, Magenta, Cian sobre negro mate</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Tipografía:</h3>
              <p>Montserrat Bold, Space Grotesk, Inter</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Objetivo:</h3>
              <p>Visibilizar emprendedores de comida callejera en Medellín</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```



### src/app/components/Logo.tsx


```tsx
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', variant = 'full', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-32 h-8',
    md: 'w-48 h-12',
    lg: 'w-64 h-16',
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizeClasses[size]} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B026FF" />
            <stop offset="50%" stopColor="#FF006E" />
            <stop offset="100%" stopColor="#00F5FF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="#1A1A1A" stroke="url(#iconGradient)" strokeWidth="3" />
        <path
          d="M50 25 C35 25 25 35 25 50 C25 65 35 75 50 75 C52 75 54 74.5 56 74 L52 78 L58 76 C68 72 75 62 75 50 C75 35 65 25 50 25Z M50 35 C59 35 65 41 65 50 C65 59 59 65 50 65 C41 65 35 59 35 50 C35 41 41 35 50 35Z"
          fill="url(#iconGradient)"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 300 80"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B026FF" />
          <stop offset="50%" stopColor="#FF006E" />
          <stop offset="100%" stopColor="#00F5FF" />
        </linearGradient>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform="translate(10, 15)">
        <circle cx="25" cy="25" r="24" fill="#1A1A1A" stroke="url(#logoGradient)" strokeWidth="3" />
        <path
          d="M25 10 C17 10 10 17 10 25 C10 33 17 40 25 40 C26 40 27 39.8 28 39.5 L26 42 L29 41 C35 38 40 32 40 25 C40 17 33 10 25 10Z M25 16 C30 16 34 20 34 25 C34 30 30 34 25 34 C20 34 16 30 16 25 C16 20 20 16 25 16Z"
          fill="url(#logoGradient)"
        />
      </g>
      <g filter="url(#neonGlow)">
        <text
          x="65"
          y="50"
          fontFamily="Montserrat, sans-serif"
          fontWeight="800"
          fontSize="36"
          fill="url(#logoGradient)"
          letterSpacing="-1"
        >
          Que<tspan fill="#00F5FF">Parche</tspan>
        </text>
      </g>
      <line x1="65" y1="58" x2="280" y2="58" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
```



### src/app/components/RF06-RegistroCompleto.tsx


```tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function RF06RegistroCompleto() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-violet)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[var(--queparche-violet)]">
            Formulario de Datos Personales (RF06)
          </h1>
          <p className="text-muted-foreground text-center">
            Crea tu perfil de emprendedor en QueParche
          </p>
        </div>
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Datos Personales</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Nombre Completo</label>
              <input type="text" placeholder="Ingresa tu nombre completo" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Número de cédula</label>
              <input type="text" placeholder="1234567890" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Correo electrónico</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Número de celular</label>
              <input type="tel" placeholder="+57 300 123 4567" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Nombre de tu Parche/Negocio</label>
              <input type="text" placeholder="El Buen Sabor" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Años de experiencia</label>
              <input type="number" placeholder="0" min="0" max="50" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full px-4 py-3 pr-12 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Confirmar contraseña</label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full px-4 py-3 pr-12 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" id="terms" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-border bg-input-background text-[var(--queparche-violet)] focus:ring-2 focus:ring-[var(--queparche-violet)] cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">Acepta Términos y Condiciones</label>
            </div>
            <button type="submit" className="w-full py-4 rounded-lg font-semibold text-lg bg-[var(--queparche-violet)] text-foreground hover:bg-[var(--queparche-violet-light)] transition-colors">
              Finalizar registro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```



### src/app/components/RF02-RegistroSimple.tsx


```tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function RF02RegistroSimple() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-violet)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[var(--queparche-magenta)]">
            Registro de Usuario (RF02)
          </h1>
          <p className="text-muted-foreground text-center">Únete a la comunidad de QueParche</p>
        </div>
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-[var(--queparche-violet)]">Emprendedor</h2>
          </div>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Correo Electrónico</label>
              <input type="email" placeholder="tucorreo@ejemplo.com" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-cyan)] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full px-4 py-3 pr-12 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-cyan)] focus:border-transparent transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-4 rounded-lg font-semibold text-lg bg-[var(--queparche-violet)] text-foreground hover:bg-[var(--queparche-violet-light)] transition-colors">
              Crear cuenta
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <a href="#" className="text-[var(--queparche-cyan)] hover:text-[var(--queparche-cyan-dark)] font-semibold transition-colors">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```



### src/app/components/RF03-Contacto.tsx


```tsx
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function RF03Contacto() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-violet)]"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[var(--queparche-magenta)]">
            Contacto y Soporte (RF03)
          </h1>
          <p className="text-muted-foreground text-center">Contáctanos / Quejas y Reclamos</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Envíanos un mensaje</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nombre Completo</label>
                <input type="text" placeholder="Tu nombre completo" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-magenta)] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Correo Electrónico</label>
                <input type="email" placeholder="tucorreo@ejemplo.com" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-magenta)] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Asunto</label>
                <input type="text" placeholder="Motivo de tu mensaje" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-magenta)] focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Mensaje</label>
                <textarea rows={5} placeholder="Escribe tu mensaje aquí..." className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-magenta)] focus:border-transparent transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-4 rounded-lg font-semibold text-lg bg-[var(--queparche-magenta)] text-foreground hover:bg-[var(--queparche-magenta-light)] transition-colors">
                Enviar
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Información de contacto directo</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">¿Tienes preguntas o necesitas ayuda? Nuestro equipo está disponible para asistirte con cualquier consulta sobre QueParche.</p>
                <div className="h-px bg-border"></div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--queparche-violet)]/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[var(--queparche-violet)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Teléfono</p>
                    <p className="text-base text-foreground">(000) 000-0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--queparche-magenta)]/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[var(--queparche-magenta)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Email</p>
                    <p className="text-base text-foreground">correo@ejemplo.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--queparche-cyan)]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[var(--queparche-cyan)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Dirección</p>
                    <p className="text-base text-foreground">Lorem Ipsum 123, Ciudad, País</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--queparche-violet)]/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-[var(--queparche-violet)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Horario</p>
                    <p className="text-base text-foreground">Lun - Vie: 8:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--queparche-gray)] rounded-2xl p-6 border border-border">
              <p className="text-sm text-foreground text-center font-medium">🌟 Respuesta promedio en menos de 24 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```



### src/app/components/RF10-InformacionServicio.tsx


```tsx
import React from 'react';
import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle } from 'lucide-react';

export function RF10InformacionServicio() {
  const servicioInfo = [
    { label: 'Fecha', value: '[DD/MM/AA]', icon: Calendar, color: 'violet' },
    { label: 'Hora', value: '[HH:MM]', icon: Clock, color: 'magenta' },
    { label: 'Ubicación', value: '[Dirección]', icon: MapPin, color: 'cyan' },
    { label: 'Datos del Usuario', value: '[NombreID]', icon: User, color: 'violet' },
    { label: 'Valor', value: '[$0.00]', icon: DollarSign, color: 'magenta' },
    { label: 'Estado del Usuario', value: '[Activo/Inactivo]', icon: CheckCircle, color: 'cyan' },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'violet': return 'bg-[var(--queparche-violet)]/10 text-[var(--queparche-violet)]';
      case 'magenta': return 'bg-[var(--queparche-magenta)]/10 text-[var(--queparche-magenta)]';
      case 'cyan': return 'bg-[var(--queparche-cyan)]/10 text-[var(--queparche-cyan)]';
      default: return 'bg-[var(--queparche-violet)]/10 text-[var(--queparche-violet)]';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-violet)]"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[var(--queparche-cyan)]">Información del Servicio (RF10)</h1>
          <p className="text-muted-foreground text-center">Información del Servicio</p>
        </div>
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Información del Servicio</h2>
          <div className="space-y-3">
            {servicioInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-input-background border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClass(item.color)}`}>
                      <IconComponent size={20} />
                    </div>
                    <span className="font-semibold text-foreground">{item.label}:</span>
                  </div>
                  <div className="flex items-center md:justify-end">
                    <span className="text-[var(--queparche-cyan)] font-mono bg-[var(--queparche-gray)] px-4 py-2 rounded-lg">{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button type="button" className="w-full mt-8 py-4 rounded-lg font-semibold text-lg bg-[var(--queparche-cyan)] text-background hover:bg-[var(--queparche-cyan-dark)] transition-colors">
            Volver
          </button>
        </div>
        <div className="mt-6 bg-[var(--queparche-gray)] rounded-xl p-4 border border-border">
          <p className="text-sm text-center text-muted-foreground">💡 Verifica que toda la información sea correcta antes de continuar</p>
        </div>
      </div>
    </div>
  );
}
```



### src/app/components/RF07-Footer.tsx


```tsx
import React from 'react';
import { Logo } from './Logo';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function RF07Footer() {
  return (
    <div className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-3 flex justify-center md:justify-start">
            <div className="bg-card p-6 rounded-xl border border-border">
              <Logo variant="icon" size="lg" />
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            <a href="#inicio" className="text-foreground hover:text-[var(--queparche-violet)] font-medium transition-colors duration-200 text-base">Inicio</a>
            <div className="h-8 w-px bg-border hidden md:block"></div>
            <a href="#nosotros" className="text-foreground hover:text-[var(--queparche-magenta)] font-medium transition-colors duration-200 text-base">Nosotros</a>
            <div className="h-8 w-px bg-border hidden md:block"></div>
            <a href="#contacto" className="text-foreground hover:text-[var(--queparche-cyan)] font-medium transition-colors duration-200 text-base">Contáctanos</a>
          </div>
          <div className="md:col-span-4">
            <div className="text-center md:text-right mb-3">
              <p className="text-sm font-semibold text-foreground mb-4">Síguenos</p>
            </div>
            <div className="flex justify-center md:justify-end gap-4">
              <a href="#facebook" className="w-12 h-12 rounded-lg bg-[#1877F2] hover:bg-[#1877F2]/80 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook size={24} className="text-white" />
              </a>
              <a href="#twitter" className="w-12 h-12 rounded-lg bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter size={24} className="text-white" />
              </a>
              <a href="#linkedin" className="w-12 h-12 rounded-lg bg-[#0A66C2] hover:bg-[#0A66C2]/80 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin size={24} className="text-white" />
              </a>
              <a href="#instagram" className="w-12 h-12 rounded-lg bg-[#E4405F] hover:bg-[#E4405F]/80 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram size={24} className="text-white" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">© 2026 QueParche. Visibilizando la gastronomía callejera de Medellín.</p>
            <div className="flex gap-6">
              <a href="#privacidad" className="text-sm text-muted-foreground hover:text-[var(--queparche-cyan)] transition-colors">Privacidad</a>
              <a href="#terminos" className="text-sm text-muted-foreground hover:text-[var(--queparche-cyan)] transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 bg-[var(--queparche-violet)]"></div>
    </div>
  );
}
```



---

## 📋 RESUMEN DEL SISTEMA DE DISEÑO

### Paleta de Colores "Medellín Nocturna"

- **Violeta Neón**: `#B026FF` (Principal)
- **Magenta**: `#FF006E` (Secundario)
- **Cian**: `#00F5FF` (Acentos)
- **Negro Mate**: `#0A0A0A` (Background)
- **Grises**: `#1A1A1A`, `#2D2D2D` (Cards, inputs)
- **Blanco**: `#F5F5F5` (Texto principal)

### Tipografía

- **Headers**: Montserrat (Bold 700-900)
- **Acentos**: Space Grotesk (Medium-Bold 500-700)
- **Body**: Inter (Regular-SemiBold 400-600)

### Componentes Clave

- **Botones**: Colores sólidos con hover simple
- **Inputs**: Focus ring con color de acento
- **Cards**: Border radius de 16px (rounded-2xl)
- **Transiciones**: Solo `transition-colors` para simplicidad

### Wireframes Implementados

1. **RF06**: Formulario de Registro Completo
2. **RF02**: Registro Simple (con título estático "Emprendedor")
3. **RF03**: Contacto y Soporte
4. **RF10**: Información del Servicio
5. **RF07**: Footer

---

## 🚀 INSTRUCCIONES DE USO

### Para otra IA (Claude, ChatGPT, etc.):

1. **Crea un nuevo proyecto React + Vite + Tailwind CSS v4**
2. **Instala las dependencias** del `package.json`
3. **Crea la estructura de carpetas** como se muestra arriba
4. **Copia cada archivo** en su ubicación correspondiente
5. **El proyecto estará 100% funcional** y responsive

### Características del Código

- ✅ **Sin gradientes complejos** - Solo colores sólidos
- ✅ **Sin animaciones avanzadas** - Solo `transition-colors`
- ✅ **Código limpio y directo** - Fácil de entender e implementar
- ✅ **Responsive** - Mobile-first con breakpoints Tailwind
- ✅ **Navegación funcional** - Sistema de routing interno
- ✅ **Iconos** - Lucide React (ya incluido en dependencias)

---

## 📝 NOTAS IMPORTANTES

- Este es un proyecto **estático con navegación interna** (no usa React Router)
- Los formularios **no tienen lógica de backend** (solo UI)
- Las imágenes del logo **están en SVG embebido** (no requieren archivos externos)
- **Todos los estilos usan CSS variables** para fácil personalización
- El proyecto está **optimizado para presentaciones universitarias**

---

**Creado para el Proyecto PPI - QueParche**  
*Visibilizando la gastronomía callejera de Medellín* 🌮🌃
