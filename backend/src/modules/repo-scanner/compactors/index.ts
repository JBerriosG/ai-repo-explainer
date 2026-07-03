import { packageJsonCompactor } from "./package-json.compactor.js";
import { expressRoutesCompactor } from "./express-routes.compactor.js";

export function compactFileContent(filePath: string, content: string): string {
    if (filePath.endsWith("package.json")) {
        return JSON.stringify({
            type: "package.json",
            compactedContent: packageJsonCompactor(content)
        });
    }

    if (filePath.includes("routes") || filePath.includes("controller")){
        return JSON.stringify({
            type: "express-routes",
            compactedContent: expressRoutesCompactor(content)
        });
    }

    return JSON.stringify({
        type: "raw",
        compactedContent: content.slice(0, 3000) // Limit raw content to first 1000 characters
    });
}