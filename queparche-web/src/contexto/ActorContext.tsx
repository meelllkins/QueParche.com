import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api/cliente';
import type { EmprendedorDirectorio } from '../api/tipos';

/**
 * "Actor": con qué perfil de emprendedor está actuando quien usa la app.
 * Sustituto deliberado de la autenticación en esta versión: cuando exista
 * login real, este contexto pasa a poblarse desde la sesión y nada más cambia.
 */

export interface Actor {
  id: string;
  nombre: string;
}

interface ValorContexto {
  actor: Actor | null;
  elegirActor: (actor: Actor | null) => void;
  emprendedores: EmprendedorDirectorio[];
}

const Contexto = createContext<ValorContexto>({ actor: null, elegirActor: () => {}, emprendedores: [] });

const CLAVE = 'queparche.actor';

function leerGuardado(): Actor | null {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return null;
    const actor = JSON.parse(crudo) as Actor;
    return actor && typeof actor.id === 'string' ? actor : null;
  } catch {
    return null;
  }
}

export function ProveedorActor({ children }: { children: ReactNode }) {
  const [actor, setActor] = useState<Actor | null>(leerGuardado);
  const [emprendedores, setEmprendedores] = useState<EmprendedorDirectorio[]>([]);

  useEffect(() => {
    api
      .get<EmprendedorDirectorio[]>('/api/emprendedores')
      .then((lista) => {
        setEmprendedores(lista);
        // Si el actor guardado ya no existe (p. ej. tras re-seed), lo descartamos.
        const guardado = leerGuardado();
        if (guardado && !lista.some((e) => e.id === guardado.id)) {
          localStorage.removeItem(CLAVE);
          setActor(null);
        }
      })
      .catch(() => {
        /* sin lista no hay selector, pero la app sigue funcionando */
      });
  }, []);

  const elegirActor = (nuevo: Actor | null) => {
    setActor(nuevo);
    if (nuevo) localStorage.setItem(CLAVE, JSON.stringify(nuevo));
    else localStorage.removeItem(CLAVE);
  };

  return <Contexto.Provider value={{ actor, elegirActor, emprendedores }}>{children}</Contexto.Provider>;
}

export function useActor() {
  return useContext(Contexto);
}
