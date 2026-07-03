import axios from "axios";

export async function extractFileContent(owner: string, repo: string, path: string, accessToken: string) {

    const MAX_FILE_LENGTH = 20000;
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
            headers: {
                Authorization: `token ${accessToken}`
            }
        }
    );
    const content = Buffer.from(response.data.content, "base64").toString("utf-8");

    return {
        path,
        content: content.slice(0, MAX_FILE_LENGTH)
    };
}

export async function extractImportantFilesContent(owner: string, repo: string, importantFiles: string[], accessToken: string) {
    const results = [];

    for ( const Path of importantFiles){
        try{
            const file = await extractFileContent(owner, repo, Path, accessToken);
            results.push(file);
        }catch (error){
            console.error(`Error extracting content for ${Path}:`, error);
        }
    }

    return results;
}