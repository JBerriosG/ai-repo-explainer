import { getRepoTree } from "./github-tree.service.js";
import { detectTech } from "./detectors/tech-detector.js";
import { detectImportantFiles } from "./analyzers/important-files.analyzer.js";
import { extractImportantFilesContent } from "./extractors/content.extractor.js";
import { compactFileContent } from "../../compactors/index.js";
import { buildRepoContext } from "./builders/context.builder.js";
import {decrypt} from "../../utils/crypto.js";

export async function scanRepo(owner: string, repo: string, accessToken: string) {
    const decryptedAccessToken = decrypt(accessToken);
    const tree = await getRepoTree(owner, repo, decryptedAccessToken);

    const files = tree.map((item: any) => ({
        path: item.path,
        type: item.type === "tree" ? "dir" : "file"
    }));

    const techs = detectTech(files.map((file: any) => file.path));

    const importantFiles = detectImportantFiles(techs.map(tech => tech.name), files.map((file: any) => file.path));

    const extractContent = await extractImportantFilesContent(owner, repo, importantFiles, decryptedAccessToken);

    const compactedContent = extractContent.map(file => ({
        path: file.path,
        compactedContent: compactFileContent(file.path, file.content)
    }));

    const context = buildRepoContext(techs, files, compactedContent);

    return {context };
}