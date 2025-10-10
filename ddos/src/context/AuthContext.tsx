import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export type Role = "ADMIN" | "USER";
export type AuthUser = { id: string; email: string; role: Role };
type Result = { ok: boolean; message?: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Result>;
  register: (email: string, password: string) => Promise<Result>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Hydrate le profil (email + role) depuis la table public.profiles.
   */
  const hydrateUser = async (id: string, fallbackEmail: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("email, role")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.warn("[Auth] hydrate profiles error:", error.message);
      setUser({ id, email: fallbackEmail, role: "USER" });
      return;
    }
    if (data) {
      setUser({ id, email: data.email, role: (data.role as Role) ?? "USER" });
    } else {
      setUser({ id, email: fallbackEmail, role: "USER" });
    }
  };

  // Initialisation + écoute des changements d’auth
  useEffect(() => {
    const init = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("[Auth] getSession error:", error.message);
      if (session?.user) {
        // Optimistic set pour débloquer l’UI immédiatement
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          role: "USER",
        });
        await hydrateUser(session.user.id, session.user.email ?? "");
      }
      setLoading(false);
    };
    void init();

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          role: "USER",
        });
        await hydrateUser(session.user.id, session.user.email ?? "");
      } else {
        setUser(null);
      }
    });

    return () => data?.subscription?.unsubscribe();
  }, []);

  // Connexion : setUser immédiat + hydratation asynchrone
  const login = async (email: string, password: string): Promise<Result> => {
    console.log("[Auth] login()", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.warn("[Auth] login error:", error.message);
      return { ok: false, message: error.message };
    }
    if (data?.user) {
      const uid = data.user.id;
      const mail = data.user.email ?? email;
      setUser({ id: uid, email: mail, role: "USER" }); // débloque tout de suite
      hydrateUser(uid, mail).catch((e) =>
        console.warn("[Auth] hydrate async error:", e?.message || e)
      );
    }
    return { ok: true };
  };

  // Inscription : si confirm email activé -> message sans session
  const register = async (email: string, password: string): Promise<Result> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { ok: false, message: error.message };

    if (!data.session) {
      // pas de session tant que l’email n’est pas confirmé
      return {
        ok: true,
        message: "Inscription réussie. Vérifie ton email pour confirmer.",
      };
    }

    if (data.user) {
      const uid = data.user.id;
      const mail = data.user.email ?? email;
      setUser({ id: uid, email: mail, role: "USER" });
      hydrateUser(uid, mail).catch((e) =>
        console.warn("[Auth] hydrate async error:", e?.message || e)
      );
    }
    return { ok: true };
  };

  const logout = async (): Promise<void> => {
    console.log("[Auth] logout()");
    // Optimistic: vide immédiatement l'état pour mettre à jour l'UI
    setUser(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[Auth] signOut error:", error.message);
      // (Optionnel) afficher un toast et éventuellement recharger la page
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === "ADMIN",
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

/**
 * Route protégée :
 * - redirige vers /account si non connecté
 * - redirige vers /not-allowed si un rôle ADMIN est requis
 */
export function ProtectedRoute({
  children,
  role,
}: PropsWithChildren<{ role?: Role }>) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/account" state={{ from: location }} replace />;
  if (role === "ADMIN" && !isAdmin)
    return <Navigate to="/not-allowed" replace />;

  return <>{children}</>;
}
