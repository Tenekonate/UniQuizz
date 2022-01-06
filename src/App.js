const { Router } = require("express");
const { UserModel } = require("./components/model-user");
const bcrypt = require("bcrypt");
const router = Router();

router.get("/home", (req, res) => {
  //vérifie si il y a un utilisateur connecté
  const welcome = {
    message: "bonjour je suis nouvelle",
    session: req.session.isAuth,
  };
  res.render("home", welcome);
});

router.get("/add-user", (req, res) => {
  res.render("add-user");
});

router.post("/add-user", async (req, res) => {
  try {
    const { email, password } = req.body;

    // vérifie si l'email n'est pas déjà présent dans la base
    const utilisateurRecherche = await UserModel.find({ email: email });
    if (utilisateurRecherche.length > 0) {
      return res.status(400).json({
        status: "erreur",
        message: "l'email existe déjà dans la base de données",
      });
    }

    // hashage du mot de pass
    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash(password, salt);

    //enregistre le nouvel utilisateur
    let newUser = new UserModel({ email, password: passwordHashed });
    await newUser.save();

    res.json({
      status: "success",
    });
  } catch (ex) {
    console.log(ex);
  }
});

router.get("/connexion", (req, res) => {
  res.render("connexion");
});

router.post("/connexion", async (req, res) => {
  try {
    const { email, password } = req.body;

    const utilisateurRecherche = await UserModel.findOne({ email: email });
    if (!utilisateurRecherche) {
      return res.status(404).json({
        status: "erreur",
        message: "aucun profil trouvé pour cet email",
      });
    }
    bcrypt.compare(password, utilisateurRecherche.password, (err, result) => {
      if (err)
        return res.status(400).json({
          status: "erreur",
          message: "aucun profil trouvé pour ce passord",
        });

      //envoie l'info du cookie pour la page d'accueil
      req.session.isAuth = true;

      res.json({
        status: "success",
        url: `${req.protocol}://${req.headers.host}/home`,
      });
    });
  } catch (ex) {
    console.log(ex);
  }
});

router.get("/delete-cookie", (req, res) => {
  //supprime le cookie
  req.session.destroy();
  res.json({ message: "prop isAuth supprimée de la session" });
});

module.exports = router;
