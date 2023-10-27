export const getInitials = (...names) => {
  return names
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
};
