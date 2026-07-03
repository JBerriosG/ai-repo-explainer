import { IMPORTANT_FILES_RULES } from "../config/important-files.rules.js";

export function detectImportantFiles(techs: string[], paths: string[]) {
    const importantFiles = new Set<string>();

    for (const tech of techs) {
        const rule = IMPORTANT_FILES_RULES.find(rule => rule.tech === tech);

        if (!rule) continue;

        for (const file of rule.files) {
            const matched = paths.find(path => path.endsWith(file));

            if (matched) {
                importantFiles.add(matched);
            }
        }

        for (const pattern of rule.patterns ?? []) {

            const matchedPatterns = paths.filter(
                path => path.endsWith(pattern)
            );

            for (const matchedPattern of matchedPatterns) {
                importantFiles.add(matchedPattern);
            }
        }

        for (const dir of rule.directories ?? []) {
            const matchedDirs = paths.filter(path => path.startsWith(dir + "/"));

            for (const matchedDir of matchedDirs) {
                importantFiles.add(matchedDir);
            }
        }
    }
    return Array.from(importantFiles);
}