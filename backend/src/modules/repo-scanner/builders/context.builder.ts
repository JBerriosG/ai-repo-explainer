import { type RepositoryContext } from "../types.js";

export function buildRepoContext(technologies: any[], compactedContent: any[]): RepositoryContext {

    const context: RepositoryContext = {
        stack: [],

        architecture: {},

        infrastructure: {}
    }

    context.stack = technologies.map(tech => tech.name);

    for (const file of compactedContent) {
        if (file.compactedContent?.type === "package.json") {
            context.dependencies = file.compacted.compacted.dependencies;
        }

        if (file.compacted?.type === "express-routes") {
            context.api = {
                routes: file.compacted.compacted
            };
        }

        if (context.stack.includes("Docker")) {
            context.infrastructure!.docker = true;
        }

        if (context.api?.routes?.length) {
            context.projectType = "Backend API";
        }
    }

    return context;
}