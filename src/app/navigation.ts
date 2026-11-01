export type NavigationItem = {
  path: string;
  label: string;
};

export const navigationItems: NavigationItem[] = [
  { path: '/', label: 'Start' },
  { path: '/upload', label: 'Hochladen' },
  { path: '/library', label: 'Bibliothek' },
  { path: '/completion', label: 'Vollständigkeit' },
  { path: '/playing', label: 'Spielen' },
];
