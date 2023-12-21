const isValidPassword = (params: string): boolean => {
  params = params.trim();

  if (!params || typeof params !== "string") return false;
  if (params.length < 6 || params.length > 8) return false;

  const digitRegex = /\d/;
  const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

  return digitRegex.test(params) && symbolRegex.test(params);
};

export default isValidPassword;
