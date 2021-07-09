const site = {
  root: null,
  sheets: null,

  init: async function () {
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

  /*TODO: Dont use Element.innerHTML */
  loadSheet: async function (sheetName) {
    const main = document.getElementsByTagName("main")[0];
    main.innerHTML = await this.getFileFromServer(`/sheets/${sheetName}`);
  },

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

window.addEventListener("onload", site.init());
