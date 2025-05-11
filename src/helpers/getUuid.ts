import { validate } from 'uuid';

export const getUuid = (url?: string): string | undefined => {
  if (url) {
    return url.split('/').find((elem) => validate(elem));
  }
  return '';
};
