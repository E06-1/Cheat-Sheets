//Site Object, will be a virtual Model of our Site to work with in JS
const site = {
  root: null,
  sheets: null,
  self: null,
  main: null,
  mdConverter: null,

  /*Method will initialize the site object by setting the root folder and fetching sheet names*/
  init: async function () {
    self = this;
    self.root = window.location.origin;
    self.main = document.getElementById("main");
    self.mdConverter = new showdown.Converter();

    self.mdConverter.setFlavor("github");
    self.mdConverter.setOption("openLinksInNewWindow", true);

    //Get all Cheat-Sheet Names
    const response = await self.getFileFromPath("/sheets.json");
    self.sheets = JSON.parse(response)["sheets"];

    //register click handler
    document.addEventListener("click", self.onClickHandler.bind(self));

    //Resolve the starting route
    self.resolveHashRoute(window.location.hash);
  },

  /*Method will determine what exactly should be done on each Route*/
  resolveHashRoute: async function (hash) {
    //Navigate to home if there is no hash route
    if ("" === hash) {
      self.navigateTo.home();
    }

    if (hash.startsWith("#/")) {
      let remainder = hash.replace("#/", "");
      if (remainder.startsWith("home")) {
        self.navigateTo.home();
        return;
      }

      if (remainder.startsWith("browse")) {
        self.navigateTo.browse();
        return;
      }

      if (remainder.startsWith("create")) {
        self.navigateTo.create();
        return;
      }

      if (remainder.startsWith("sheets/")) {
        remainder = remainder.replace("sheets/", "");
        self.navigateTo.sheet(remainder);
        return;
      }

      if (remainder.startsWith("categories/")) {
        remainder = remainder.replace("categories/", "");
        self.navigateTo.category(category);
        return;
      }
    }
  },

  onClickHandler: function (onClickEvent) {
    if (onClickEvent.srcElement.nodeName === "A") {
      self.resolveHashRoute(onClickEvent.srcElement.hash);
    }
  },

  /*Method will get the specified File from the Server
  currently File names need to be absolute paths.
  For example "/sheets/example.html" Return value is a promise. */
  getFileFromPath: async function (path) {
    /*TODO: Implement relative Paths like "./file" or "../folder/file" */

    let url = null;
    if (path.startsWith("/"))
      url = self.root + window.location.pathname + path.slice(1, path.length);

    if (url !== null) return await self.getFileFromUrl(url);
  },

  getFileFromUrl: async function (url) {
    /*TODO: Status Code handling*/
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

  navigateTo: {
    //Currently Home is displaying a random cheat sheet (it should show the latest additions)
    home: async function () {
      self.resolveHashRoute(
        `#/sheets/${
          self.sheets[Math.floor(Math.random() * self.sheets.length)]
        }`
      );
    },

    //Shows a listing of all available sheet sheets ordered alphabetically
    browse: async function () {
      main.innerHTML = "";
    },

    //Shows a site were you can create a Sheet Sheet
    create: async function () {
      main.innerHTML = `
        <article id="create">
          <section id="input">
            <form action="" method="post">
              
              <div>
                <label for="sheetName">Name of your Sheet:</label>
                <input type="text" name="sheetName" id="sheetName" placeholder="My-Sheet"></input>
              </div>
              <div>
                <label for="sheetMarkdown">Write your Markdown here:</label>
                <textarea name="sheetMarkdown" id="sheetMarkdown"></textarea>
              </div>
              <div>
                <input type="button" name="createSheet" id="createSheet" value="Create"></input>
              </div>
            </form>
          </section>
          <section id="preview"></section>
        </article>`;
      let textArea = document.getElementById("sheetMarkdown");
      let preview = document.getElementById("preview");
      let sheetName = document.getElementById("sheetName");

      textArea.addEventListener("input", (e) => {
        let sheet = document.createElement("article");

        sheet.setAttribute("class", `sheet`);
        sheet.setAttribute("id", `${sheetName.value ? sheetName.value : sheetName.getAttribute("placeholder")}`);

        /*TODO: Dont use Element.innerHTML, sanitize Converter Output first.*/
        sheet.innerHTML = self.mdConverter.makeHtml(e.target.value);
        preview.innerHTML = sheet.outerHTML;
      });
    },

    //Shows a listing of all Sheets ordered according to category
    category: async function (category) {
      main.innerHTML = "";
    },

    //Loads single Sheet into Main
    sheet: async function (sheetName) {
      let sheet = document.createElement("article");

      sheet.setAttribute("class", `sheet`);
      sheet.setAttribute("id", `${sheetName}`);

      /*TODO: Dont use Element.innerHTML, sanitize first.*/
      sheet.innerHTML = self.mdConverter.makeHtml(
        await self.getFileFromPath(`/sheets/${sheetName}`)
      );

      main.innerHTML = sheet.outerHTML;
    },
  },
};

//Initialize Site Object on page load
window.addEventListener("load", site.init.bind(site));
