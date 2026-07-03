export interface RepoFile {
    path:string;
    type: "file" | "dir";
}

export interface DetectedTech {
  name: string;
  confidence: number;
}

export interface ImportantFilesRules {
    tech: string;
    files: string[];
    directories?: string[];
    patterns?: string[];
}

export interface RepositoryContext {

  projectType?: string;

  stack: string[];

  architecture: {
    pattern?: string;
    folders?: string[];
  };

  api?: {
    routes?: {
      method: string;
      path: string;
    }[];
  };

  infrastructure?: {
    docker?: boolean;
    ci?: boolean;
  };

  dependencies?: string[];

  summary?: string;
}