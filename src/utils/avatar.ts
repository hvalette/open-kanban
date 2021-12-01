export const getAvatarUrl = (name: string) => {
  if (!name) {
    return `https://avatars.dicebear.com/api/initials/unassigned.svg?backgroundColors=grey&backgroundColorLevel=400`;
  }
  return `https://avatars.dicebear.com/api/initials/${name}.svg`;
};
