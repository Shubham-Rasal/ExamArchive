type TExamType = { [key: string]: Record<string, string> | string };

export const examNames = (params: TExamType) => {
  const names: string[] = [];

  for (let type in params) {
    const element = params[type];
    if (typeof element === "string") names.push(element);
    else names.push(...examNames(element));
  }
  return names;
};
