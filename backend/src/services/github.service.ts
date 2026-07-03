import axios from "axios";

export async function getUserRepos(accessToken: string) {

    try {
        const response = await axios.get("https://api.github.com/user/repos", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error:any) {
        if (error.response?.status === 401) {
            throw new Error("GITHUB_TOKEN_EXPIRED");
        }
        throw error;
    }

}