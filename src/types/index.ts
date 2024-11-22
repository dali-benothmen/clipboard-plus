export interface ClipboardItem {
  id: string;
  text: string;
  label: string;
  timestamp: string;
  category: Category | null;
  pinned: boolean;
  source: Source;
}

export interface Source {
  name: string;
  url: string;
  favicon: string;
}

export interface Category {
  id: string;
  name: string;
}
