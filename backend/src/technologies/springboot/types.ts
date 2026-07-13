export interface TechnologyDetector{
    detect(paths: string[]):number;
}

export interface TechnologyCompactor{
    supports(paths: string[]):boolean;
    compact(content: string):unknown;
}

export interface TechnologyDefinition{
    name: string;
    detector: TechnologyDetector;
    importanFiles: string[];
    compactor?: TechnologyCompactor[];
}