export interface ClipboardItem {
  id: string;
  text: string;
  timestamp: string;
  pinned: boolean;
  website: WebsiteInfo;
}

export interface WebsiteInfo {
  name: string;
  url: string;
  favicon: string;
}
