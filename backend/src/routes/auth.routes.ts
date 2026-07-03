import { Router } from "express";
import passport from "passport";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"]
  })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login"
  }),
  (_req, res) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.post("/logout", (req:any, res) => {
  req.logout((err:any) => {
    if (err){
      return res.status(500).json({error: "Logout failed"});
    }

    req.session.destroy((err: any) => {
      if (err){
        return res.status(500).json({error: "Session destruction failed"});
      }
    });

    res.clearCookie("connect.sid");
    res.json({message: "Logged out successfully"});
  });
});
export default router;