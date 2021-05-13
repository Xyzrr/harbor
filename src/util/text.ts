export const initials = (name: string) => {
  return name
    .split(' ')
    .map((s) => s[0])
    .join('');
};
