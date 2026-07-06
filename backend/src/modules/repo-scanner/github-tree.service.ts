import axios from "axios";
import { decrypt } from "../../utils/crypto.js";

export async function getRepoTree(owner: string, repo: string, accessToken: string) {
    const decryptedAccessToken = decrypt(accessToken);
    const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Authorization: `token ${decryptedAccessToken}`
        }
    });
    const defaultBranch = repoResponse.data.default_branch;
    const treeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
        headers: {
            Authorization: `token ${decryptedAccessToken}`
        }
    });
    return treeResponse.data.tree;
}
