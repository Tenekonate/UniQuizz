document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const response = data.getAll("answer");
  const resultExpected = data.getAll("resultat");
  const questionQuizz = data.getAll("questionQuizz");
  const goodAnswer = [];

  //compare les resultats attendus avec le resultats envoyés
  for (let i = 0; i < response.length; i++) {
    if (response[i] === resultExpected[i]) {
      console.log(`${response[i]} same ${resultExpected[i]}`);
      goodAnswer.push(response[i]);
    } else {
      console.log(
        `wrong answer result is ${resultExpected[i]} your answer is ${response[i]}`
      );
    }
  }

  const nbGoodAnswer = goodAnswer.length;

  const [url] = e.target.action.split("?");
  const req = new XMLHttpRequest();
  req.open("POST", url);
  req.setRequestHeader("Content-Type", "application/json;charset=utf8");
  req.send(
    JSON.stringify({
      response: response,
      score: nbGoodAnswer,
      questionQuizz: questionQuizz,
    })
  );
  req.onload = () => {
    // fait une redirection sur la page des scores en cas de succès
    if (req.status === 200) {
      const { url } = JSON.parse(req.responseText);
      window.location.href = url;
    }
    console.log(req.responseText);
  };
});
