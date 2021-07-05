
const origin = window.location.origin;

const getAllCheatSheets = () => {
  const httpRequest = new XMLHttpRequest();
  const parser = new DOMParser();
  httpRequest.onreadystatechange = function () {
    console.log(httpRequest.readyState);
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        const response = parser.parseFromString(
          httpRequest.responseText,
          "text/html"
        );
        let filenames = [];
        for (const span of response
          .getElementById("files")
          .getElementsByClassName("name")) {
              filenames.push(span.innerHTML)
        }
        filenames = filenames.filter((filename) => {
            if(filename === "..") return false;
            if(filename === "_template.html") return false;
            return true;
        })
        loadRandomCheatSheet(filenames);
      } else {
        console.log(`Error! HTML Status: ${httpRequest.status}`);
      }
    } else {
      console.log("Not ready!");
    }
  };
  httpRequest.open("GET", `${origin}/Cheat-Sheets/`, true);
  httpRequest.send();
  delete httpRequest;
  delete parser;
};

const loadRandomCheatSheet = (filenames) => {
    const main = document.getElementsByTagName("main")[0];
    const RandomCheatSheet = filenames[Math.floor(Math.random()*filenames.length)];
    const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    console.log(httpRequest.readyState);
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        main.innerHTML = httpRequest.responseText;
      } else {
        console.log(`Error! HTML Status: ${httpRequest.status}`);
      }
    } else {
      console.log("Not ready!");
    }
  };
  console.log(`${origin}/Cheat-Sheets/${RandomCheatSheet}`)
  httpRequest.open("GET", `${origin}/Cheat-Sheets/${RandomCheatSheet}`, true);
  httpRequest.send();
  delete httpRequest;
}

getAllCheatSheets();


