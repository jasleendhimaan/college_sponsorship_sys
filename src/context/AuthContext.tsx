import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export type UserRole =
  | "admin"
  | "organizer"
  | "sponsor"
  | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<any>;

  signIn: (
    email: string,
    password: string
  ) => Promise<any>;

  signInWithGoogle: () => Promise<any>;

  signOut: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [user, setUser] =
    useState<User | null>(null);

  const [role, setRole] =
    useState<UserRole>(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * Load user role.
   *
   * IMPORTANT:
   * Role loading must NEVER prevent
   * the application from opening.
   */
  async function loadRole(userId: string) {
  try {
    console.log("=================================");
    console.log("Loading role for UID:", userId);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", userId)
      .maybeSingle();

    console.log("Profile returned from database:", data);
    console.log("Profile query error:", error);

    if (error) {
      console.error("Error loading profile role:", error);
      setRole(null);
      return;
    }

    if (!data) {
      console.error(
        "NO PROFILE FOUND for authenticated user:",
        userId
      );
      setRole(null);
      return;
    }

    console.log("Authenticated email:", data.email);
    console.log("Database role:", data.role);

    setRole(data.role as UserRole);

    console.log("Role set to:", data.role);
    console.log("=================================");
  } catch (error) {
    console.error("Unexpected role loading error:", error);
    setRole(null);
  }
}

  useEffect(() => {
    let mounted = true;

    /*
     * INITIAL SESSION
     */
    const initializeAuth = async () => {
      try {
        const {
          data,
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "Supabase getSession error:",
            error
          );

          if (mounted) {
            setSession(null);
            setUser(null);
            setRole(null);
          }

          return;
        }

        if (!mounted) return;

        const currentSession =
          data.session;

        setSession(currentSession);

        setUser(
          currentSession?.user ?? null
        );

        /*
         * Do NOT block application startup
         * while loading the role.
         */
        if (currentSession?.user) {
          loadRole(
            currentSession.user.id
          );
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error(
          "Auth initialization error:",
          error
        );

        if (mounted) {
          setSession(null);
          setUser(null);
          setRole(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    /*
     * AUTH STATE LISTENER
     */
    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          if (!mounted) return;

          setSession(newSession);

          setUser(
            newSession?.user ?? null
          );

          if (newSession?.user) {
            /*
             * Do NOT await this.
             */
            loadRole(
              newSession.user.id
            );
          } else {
            setRole(null);
          }

          setLoading(false);
        }
      );

    return () => {
      mounted = false;

      authListener.subscription.unsubscribe();
    };
  }, []);

  /*
   * SIGN UP
   */
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  };

  /*
   * SIGN IN
   */
  const signIn = async (
    email: string,
    password: string
  ) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  /*
   * GOOGLE LOGIN
   */
  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          window.location.origin,
      },
    });
  };

  /*
   * SIGN OUT
   */
  const signOut = async () => {
    const {
      error,
    } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}