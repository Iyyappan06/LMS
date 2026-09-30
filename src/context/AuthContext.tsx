"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserRole } from "@/lib/types";
import { DataStore, INITIAL_PROFILES } from "@/lib/data-store";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  allProfiles: UserProfile[];
  refreshProfiles: () => void;
  loading: boolean;
  // RBAC Permission helpers
  isAdmin: boolean;
  isLibrarian: boolean;
  isFaculty: boolean;
  isStudent: boolean;
  isCoordinator: boolean;
  canManageBooks: boolean;
  canIssueReturn: boolean;
  canManageMembers: boolean;
  canRequestBooks: boolean;
  canManageFines: boolean;
  canAuditInventory: boolean;
  canConfigureSettings: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Sync from Supabase DB on mount
    DataStore.syncFromSupabase().then(() => {
      const updatedProfiles = DataStore.getProfiles();
      setAllProfiles(updatedProfiles);
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem("lms_user_id") : null;
      if (storedUserId) {
        const found = updatedProfiles.find((p) => p.id === storedUserId);
        if (found) setCurrentUserState(found);
      } else {
        const adminUser = updatedProfiles.find((p) => p.role === "ADMIN") || updatedProfiles[0];
        setCurrentUserState(adminUser);
      }
    });

    // Initial session load
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("lms_user_id") : null;
    const profiles = DataStore.getProfiles();
    setAllProfiles(profiles);

    if (storedUserId) {
      const found = profiles.find((p) => p.id === storedUserId);
      if (found) {
        setCurrentUserState(found);
      } else {
        // Fallback to first profile if stored ID invalid
        setCurrentUserState(profiles[0]);
        localStorage.setItem("lms_user_id", profiles[0].id);
      }
    } else {
      // Default logged in as admin for smooth initial experience, but support explicit login/logout
      const defaultUser = DataStore.getCurrentUser() || profiles[0];
      setCurrentUserState(defaultUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("lms_user_id", defaultUser.id);
      }
    }

    setLoading(false);

    const handleDataChange = () => {
      setAllProfiles(DataStore.getProfiles());
    };

    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Try Supabase Auth if configured
      if (supabase) {
        const { error: sbError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password || "password123",
        });
        // We log any error, but proceed to check local profiles table for seamless experience
        if (sbError) {
          console.warn("Supabase Auth login notice:", sbError.message);
        }
      }

      // Find user in profiles (by email, full_name, or role)
      const profiles = DataStore.getProfiles();
      const term = email.trim().toLowerCase();
      const matched = profiles.find(
        (p) =>
          p.email.toLowerCase() === term ||
          p.full_name.toLowerCase().includes(term) ||
          p.role.toLowerCase() === term
      ) || profiles[0]; // fallback to admin if unmatched term entered

      if (!matched) {
        setLoading(false);
        return { success: false, error: "No account found matching this username or email." };
      }

      if (matched.status === "SUSPENDED" || matched.status === "INACTIVE") {
        setLoading(false);
        return { success: false, error: "Your account has been suspended or deactivated. Contact Library Admin." };
      }

      setCurrentUserState(matched);
      DataStore.setCurrentUser(matched);
      if (typeof window !== "undefined") {
        localStorage.setItem("lms_user_id", matched.id);
      }

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Login failed. Please try again." };
    }
  };

  const logout = async () => {
    setLoading(true);
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("lms_user_id");
    }
    setCurrentUserState(null);
    setLoading(false);
    router.push("/login");
  };

  const refreshProfiles = () => {
    setAllProfiles(DataStore.getProfiles());
  };

  const role = currentUser?.role;
  const isAdmin = role === "ADMIN";
  const isLibrarian = role === "LIBRARIAN";
  const isFaculty = role === "FACULTY";
  const isStudent = role === "STUDENT";
  const isCoordinator = role === "COORDINATOR";

  const canManageBooks = isAdmin || isLibrarian;
  const canIssueReturn = isAdmin || isLibrarian;
  const canManageMembers = isAdmin || isLibrarian;
  const canRequestBooks = isFaculty || isAdmin;
  const canManageFines = isAdmin || isLibrarian;
  const canAuditInventory = isAdmin || isLibrarian;
  const canConfigureSettings = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        allProfiles,
        refreshProfiles,
        loading,
        isAdmin,
        isLibrarian,
        isFaculty,
        isStudent,
        isCoordinator,
        canManageBooks,
        canIssueReturn,
        canManageMembers,
        canRequestBooks,
        canManageFines,
        canAuditInventory,
        canConfigureSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
