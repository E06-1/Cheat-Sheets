//Site Object, will be a virtual Model of our Site to work with in JS
const site = {
  root: null,
  sheets: null,

  /*Method will initialize the site object by setting the root folder and fetching sheet names*/
  init: async function () {

    /*Live-Server starts index.html directly while github-pages starts the root, 
    removing index from the end will work on both live-server and github pages*/
    if (window.location.href.endsWith("index.html")) {
      window.location.href = window.location.href.replace(/index.html$/, "");
    } else {
      this.root = window.location.href;
    }

    //Get all Cheat-Sheet Names
    const response = await this.getFileFromServer("/sheets.json");
    this.sheets = JSON.parse(response)["sheets"];

    //Load random Cheat Sheet on start
    this.loadSheet(this.sheets[Math.floor(Math.random() * this.sheets.length)]);
  },

  /*Method will display a single Cheat-Sheet 
  as specified by it's Filename (no Path necessary) 
  inside the HTML <main></main> element*/
  loadSheet: async function (sheetName) {
    const main = document.getElementsByTagName("main")[0];
    /*TODO: Dont use Element.innerHTML */
    main.innerHTML = await this.getFileFromServer(`/sheets/${sheetName}`);
  },

  /*Method will get the specified File from the Server
  currently File names need to be absolute paths.
  For example "/sheets/example.html" Return value is a promise. */
  getFileFromServer: async function (path) {
    /*TODO: Implement relative Paths like "./file" or "../folder/file" */
    /*TODO: Status Code handling*/
    let url = null;
    if (path.startsWith("/")) url = path.replace(/^\//, this.root);
    return await new Promise((resolve, reject) => {
      const httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            resolve(httpRequest.responseText);
          } else {
            reject(`HTTP-status: ${httpRequest.status}`);
          }
        }
      };
      httpRequest.open("GET", url);
      httpRequest.send();
    });
  },
};

//Initialize Site Object on page load
window.addEventListener("onload", site.init());
