import { Router } from "express";

import { getUserRepos } from "../services/github.service.js";

import { scanRepo } from "../modules/repo-scanner/scanner.service.js";

const router = Router();

router.get("/repos", async (req: any, res) => {
    try {

        console.log("User in request:", req.user);
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const repos = await getUserRepos(req.user.accessToken);
        res.json(repos);
    } catch (error:any) {
        if (error.message === "GITHUB_TOKEN_EXPIRED") {
            return res.status(401).json({
                error: "GitHub token expired"
            });
        }

        res.status(500).json({
            error: "Failed to fetch repositories: " + error
        });
    }
});

router.get("/repos/:owner/:repo/analyze", async (req: any, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const { owner, repo } = req.params;
        const analysis = await scanRepo(owner, repo, req.user.accessToken);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({
            error: "Failed to analyze repository: " + error
        });
    }
});

export default router;