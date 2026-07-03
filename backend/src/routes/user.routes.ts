import { Router } from "express";

const router = Router();

router.get("/me", (req:any, res) => {

    if(!req.user){
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    res.json(req.user);
});

export default router;