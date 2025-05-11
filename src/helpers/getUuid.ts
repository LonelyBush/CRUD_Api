export const getUuid = (url?: string): string | undefined => {
  if (url) {
    return url.split('/')[3];
  } else {
    return '';
  }
};
