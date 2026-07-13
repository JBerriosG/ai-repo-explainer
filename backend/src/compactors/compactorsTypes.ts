export interface pomSummary{
    groupId: string;
    artifactId: string;
    version: string;

    parent?: {
        groupId: string;
        artifactId: string;
        version: string;
    };

    javaVersion?: string;
    springBootVersion?: string;

    dependencies?: string[];
    plugins?: string[];
}