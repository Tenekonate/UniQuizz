const { Router } = require("express");
const { ScoreModel } = require("./components/model-score");
const router = Router();

router.get("/quizz", (req, res) => {
  const questions = [];
  while (questions.length < 3) {
    //génère 2 nombres x et y de 1 à 10
    const x = 1 + Math.floor(Math.random() * 10);
    const y = 1 + Math.floor(Math.random() * 10);

    //s'assure que la combinaison de question n'est pas déjà enregistrées
    let alreadyAsked = false;
    for (const question of questions) {
      if (question.x === x && question.y === y) {
        alreadyAsked = true;
        break;
      }
    }
    //continue permet de remonter directement à la boucle while sans exécuter la suite
    //donc sans le push
    if (alreadyAsked) {
      continue;
    }

    questions.push({ x: x, y: y, result: x * y });
  }

  res.render("quizz", { session: req.session.isAuth, questions: questions });
});

router.post("/quizz", async (req, res) => {
  try {
    const { response, score, questionQuizz } = req.body;
    const email = req.session.email;

    let newScore = new ScoreModel({ email, response, score, questionQuizz });
    await newScore.save();

    //ajout à la session l'id du quizz en cours
    req.session.currId = newScore.id;

    res.json({
      status: "success",
      url: `${req.protocol}://${req.headers.host}/score`,
    });
  } catch (ex) {
    console.log(ex);
  }
});

router.get("/score", async (req, res) => {
  //récupère l'id du quizz en cours
  const id = req.session.currId;
  const userScore = await ScoreModel.findOne({ _id: id });

  res.render("score", {
    session: req.session.isAuth,
    score: userScore,
    email: req.session.email,
  });
});

router.get("/history", async (req, res) => {
  const email = req.session.email;

  const userResult = await ScoreModel.find({ email: email });
  console.log(userResult);

  res.render("history", {
    session: req.session.isAuth,
    result: userResult,
    email: email,
  });
});

router.delete("/history", async (req, res) => {
  try {
    const { id } = req.body;

    await ScoreModel.deleteOne({ _id: id });

    res.json({
      status: "success",
      url: `${req.protocol}://${req.headers.host}/history`,
    });
  } catch (ex) {
    console.log(ex);
  }
});

module.exports = router;
