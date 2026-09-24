"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserRole } from "@/lib/types";
import { DataStore, INITIAL_PROFILES } from "@/lib/data-store";

interface AuthContextType {
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: UserProfile) => void;
  allProfiles: UserProfile[];
  refreshProfiles: () => void;
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
  const [currentUser, setCurrentUserState] = useState<UserProfile>(INITIAL_PROFILES[0]);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = DataStore.getCurrentUser();
    const profiles = DataStore.getProfiles();
    setCurrentUserState(user);
    setAllProfiles(profiles);

    const handleDataChange = () => {
      setCurrentUserState(DataStore.getCurrentUser());
      setAllProfiles(DataStore.getProfiles());
    };

    window.addEventListener("lms_data_change", handleDataChange);
    return () => window.removeEventListener("lms_data_change", handleDataChange);
  }, []);

  const switchRole = (role: UserRole) => {
    const updated = DataStore.setCurrentUserByRole(role);
    setCurrentUserState(updated);
  };

  const setCurrentUser = (user: UserProfile) => {
    DataStore.setCurrentUser(user);
    setCurrentUserState(user);
  };

  const refreshProfiles = () => {
    setAllProfiles(DataStore.getProfiles());
  };

  const role = currentUser.role;
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
        switchRole,
        setCurrentUser,
        allProfiles,
        refreshProfiles,
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
