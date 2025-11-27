import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { LoginForm, RegisterForm, User, AuthContextType } from "../types";
import {
  login as logUser,
  register as registerUser,
  getCurrentUser,
  logout as LogoutUser,
  isAuthenticated as checkLoggedInStatus,
} from "../api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      const isLoggedIn = await checkLoggedInStatus();
      if (isLoggedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsGuest(false);
      } else {
        setUser(null);
      }
    } catch {
      // User is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(
    async (credentials: LoginForm) => {
      try {
        setIsLoading(true);
        await logUser(credentials);
        await checkAuthStatus();
        setIsGuest(false);
      } catch (err: unknown) {
        console.error(err);
        console.log(err);
        const errorMessage =
          err instanceof Error ? err.message : "Login failed";
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [checkAuthStatus]
  );

  const register = useCallback(
    async (userData: RegisterForm) => {
      try {
        setIsLoading(true);
        await registerUser(userData);
        // Fetch user data after successful registration
        await checkAuthStatus();
        setIsGuest(false);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [checkAuthStatus]
  );

  const logout = useCallback(async () => {
    try {
      await LogoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsGuest(false);
    }
  }, []);

  const isAuthenticated = useCallback(async () => {
    return await checkLoggedInStatus();
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    setUser(null);
  }, []);

  const clearGuestMode = useCallback(() => {
    setIsGuest(false);
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isGuest,
      login,
      register,
      logout,
      continueAsGuest,
      clearGuestMode,
    }),
    [
      user,
      isLoading,
      isGuest,
      isAuthenticated,
      login,
      register,
      logout,
      continueAsGuest,
      clearGuestMode,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
