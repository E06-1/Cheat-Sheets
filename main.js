
const origin = window.location.href;

const getAllCheatSheets = () => {
  const httpRequest = new XMLHttpRequest();
  const parser = new DOMParser();
  httpRequest.onreadystatechange = function () {
    console.log(httpRequest.readyState);
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText)
        loadRandomCheatSheet(JSON.parse(httpRequest.responseText)['sheets']);
      } else {
        console.log(`Error! HTML Status: ${httpRequest.status}`);
      }
    } else {
      console.log("Not ready!");
    }
  };
  console.log(origin)
  httpRequest.open("GET", `${origin}/sheets.json`, true);
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
  console.log(`${origin}/sheets/${RandomCheatSheet}`)
  httpRequest.open("GET", `${origin}/sheets/${RandomCheatSheet}`, true);
  httpRequest.send();
  delete httpRequest;
}

getAllCheatSheets();


