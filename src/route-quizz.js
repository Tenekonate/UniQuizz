const { Router } = require("express");
const router = Router();

router.get("/quizz", (req, res) => {
  res.render("quizz", { session: req.session.isAuth });
});

module.exports = router;
