export interface ClipboardItem {
  id: string;
  text: string;
  label: string;
  timestamp: string;
  pinned: boolean;
  source: Source;
}

export interface Source {
  name: string;
  url: string;
  favicon: string;
}
