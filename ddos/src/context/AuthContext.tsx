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
    if (data) setUser({ id, email: data.email, role: (data.role as Role) ?? "USER" });
    else setUser({ id, email: fallbackEmail, role: "USER" });
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        console.log("[Auth] init: getSession…");
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error("[Auth] getSession error:", error.message);

        if (session?.user) {
          // état optimiste immédiat (évite écran blanc)
          const fallbackEmail = session.user.email ?? "";
          setUser({ id: session.user.id, email: fallbackEmail, role: "USER" });
          // hydratation en arrière-plan (ne bloque pas l’UI)
          hydrateUser(session.user.id, fallbackEmail).catch((e) =>
            console.warn("[Auth] hydrate async error:", e?.message || e)
          );
        } else {
          setUser(null);
        }
      } catch (e: any) {
        console.error("[Auth] init exception:", e?.message ?? String(e));
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("[Auth] init: loading=false");
        }
      }
    })();

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const fallbackEmail = session.user.email ?? "";
        setUser({ id: session.user.id, email: fallbackEmail, role: "USER" });
        hydrateUser(session.user.id, fallbackEmail).catch((e) =>
          console.warn("[Auth] hydrate async error:", e?.message || e)
        );
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      data?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<Result> => {
    console.log("[Auth] login()", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.warn("[Auth] login error:", error.message);
      return { ok: false, message: error.message };
    }
    if (data?.user) {
      const uid = data.user.id;
      const mail = data.user.email ?? email;
      setUser({ id: uid, email: mail, role: "USER" }); // optimiste
      hydrateUser(uid, mail).catch((e) =>
        console.warn("[Auth] hydrate async error:", e?.message || e)
      );
    }
    return { ok: true };
  };

  const register = async (email: string, password: string): Promise<Result> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { ok: false, message: error.message };

    if (!data.session) {
      return { ok: true, message: "Inscription réussie. Vérifie ton email pour confirmer." };
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

  const logout = async () => {
    console.log("[Auth] logout()");
    setUser(null); // optimiste
    const { error } = await supabase.auth.signOut();
    if (error) console.error("[Auth] signOut error:", error.message);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAdmin: user?.role === "ADMIN" }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function ProtectedRoute({
  children,
  role,
}: PropsWithChildren<{ role?: Role }>) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    // petit placeholder inline pour éviter un écran noir si tu préfères
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/account" state={{ from: location }} replace />;
  if (role === "ADMIN" && !isAdmin) return <Navigate to="/not-allowed" replace />;

  return <>{children}</>;
}
