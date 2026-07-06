import axios from "axios";
import { decrypt } from "../utils/crypto.js";

export async function getUserRepos(accessToken: string) {

    try {
        const decryptedAccessToken = decrypt(accessToken);
        const response = await axios.get("https://api.github.com/user/repos", {
            headers: {
                Authorization: `Bearer ${decryptedAccessToken}`
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