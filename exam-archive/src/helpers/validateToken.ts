const validateToken = async (authToken: string): Promise<string | null> => {
  try {
    const res = await fetch("/api/auth/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authToken }),
      cache: "no-store",
    });
    const { message, email } = (await res.json()) as IResponse & {
      email: string;
    };

    if (!res.ok) {
      console.error(message);
      return null;
    }
    return email;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};

export default validateToken;
