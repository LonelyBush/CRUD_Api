export const validatePath = (route: string, url?: string): boolean => {
  if (url) {
    if (url.split('/').length !== route.split('/').length) {
      return false;
    }
    const routeSegments = route.split('/').slice(1);

    const urlSegments = url.split('/').slice(1);
    const match = routeSegments.every((segment, i) => {
      return segment === urlSegments[i] || segment.startsWith(':');
    });

    return match;
  }
  return false;
};
