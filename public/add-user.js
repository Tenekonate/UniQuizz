document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  //permet d'avoir un url complet
  const [url] = e.target.action.split("?");

  const req = new XMLHttpRequest();
  req.open("POST", url);
  req.setRequestHeader("Content-Type", "application/json;charset=utf8");
  req.send(
    JSON.stringify({
      email: data.get("email"),
      password: data.get("password"),
    })
  );
  req.onload = () => {
    if (req.status === 200) {
      const { url } = JSON.parse(req.responseText);
      window.location.href = url;
    }
    console.log(req.responseText);
  };
});
