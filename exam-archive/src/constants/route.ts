export const PageRoutes = {
  auth: {
    newUser: "/auth/newUser",
    signIn: "/auth/signIn",
    reset: "/auth/reset",
  },
  dashboard: {
    home: "/dashboard",
  },
} as const;

export const ApiRoutes = {
  auth: {
    newUser: "/api/auth/newUser",
    signIn: "/api/auth/signIn",
    signOut: "/api/auth/signOut",
    reset: "/api/auth/reset",
    validate: "/api/auth/validate",
  },
} as const;
