export type OS = 'windows' | 'macos' | 'linux';
export type Category = 'Desktop Apps' | 'Web Tools' | 'CLI Tools' | 'Libraries';

export interface PageConfig {
  searchPlaceholder: string;
  trustNote: string;
  security: {
    isCodeSigned: boolean;
    checksumVerified: boolean;
  };
}

export interface GlobalStats {
  totalProjects: number;
  totalDownloads: number;
  verifiedPercent: number;
}

export interface DownloadPageData {
  pageConfig: PageConfig;
  globalStats: GlobalStats;
  filters: {
    categories: string[];
    operatingSystems: string[];
    techStack: string[];
  };
  projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  version: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  size: string;
  lastUpdated: string;
  security: {
    verified: boolean;
    signed: boolean;
    openSource: boolean;
    checksum: string;
  };
  compatibility: string[];
  downloadLinks: {
    [key: string]: {
      url: string;
      size: string;
      format: string;
    };
  };
  versions: {
    version: string;
    date: string;
    size: string;
    changes: string[];
    downloadUrl: string;
  }[];
  features: string[];
  requirements: {
    [key: string]: string;
  };
}