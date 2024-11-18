export interface CopiedItem {
  id: string;
  text: string;
  timestamp: string;
  expirationDate: string;
  website: WebsiteInfo;
}

export interface WebsiteInfo {
  name: string;
  url: string;
  favicon: string;
}
