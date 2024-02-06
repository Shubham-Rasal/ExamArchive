export const PageRoutes = {
  auth: {
    newUser: "/auth/newUser",
    signIn: "/auth/signIn",
    reset: "/auth/reset",
  },
  search: "/search",
} as const;

export const ApiRoutes = {
  auth: {
    validate: "/api/auth/validate",
  },
  uploadNotification: "/api/upload/notification",
} as const;
