export interface ClipboardItem {
  id: string;
  text: string;
  label: string;
  timestamp: string;
  category: Category | null;
  pinned: boolean;
  isTrashed: boolean;
  source: Source;
}

export interface Source {
  name: string;
  hostname: string;
  href: string;
  favicon: string;
}

export interface Category {
  id: string;
  name: string;
}

export type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>;
