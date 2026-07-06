import axios from "axios";

export async function getRepoTree(owner: string, repo: string, accessToken: string) {
    const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
    const defaultBranch = repoResponse.data.default_branch;
    const treeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });
    return treeResponse.data.tree;
}
