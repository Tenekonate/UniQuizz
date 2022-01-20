const button = document.getElementsByTagName("button");

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", (e) => {
    const id = e.target.value;
    const url = window.location.href;

    const req = new XMLHttpRequest();
    req.open("DELETE", url);
    req.setRequestHeader("Content-Type", "application/json;charset=utf8");
    req.send(
      JSON.stringify({
        id: id,
      })
    );
    req.onload = () => {
      //fait une redirection sur la page des histoty en cas de succès
      if (req.status === 200) {
        const { url } = JSON.parse(req.responseText);
        window.location.href = url;
      }
      console.log(req.responseText);
    };
  });
}
