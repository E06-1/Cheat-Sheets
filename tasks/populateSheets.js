const fs = require("fs");

let dir = fs.readdirSync("./sheets/");
console.log(dir);

dir = dir.filter((file)=> {
    if(file === "_template.html") return false;
    return true;
})

console.log(dir);

const json = {
    sheets: dir
};

fs.writeFileSync("./sheets.json", JSON.stringify(json));
