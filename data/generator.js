const drive = require("drive-db");
const fs = require('fs');
const fetch = require('node-fetch');

const downloadFile = (async (url, path) => {
    const res = await fetch(url);
    if (res.status != 200) {
        return;
    }
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
    });
});

const sortObjByKey = (value) => {
    return (typeof value === 'object')
        ? (Array.isArray(value)
            ? value.map(sortObjByKey)
            : Object.keys(value).sort().reduce(
                (o, key) => {
                    const v = value[key]
                    o[key] = sortObjByKey(v)
                    return o
                }, {})
        )
        : value
}

(async () => {

    const db = await drive({
        sheet: "12v8_ns7epT7yypNSuIaEIjzRSdfsb7Nn968H2ncYcN0",
        tab: "ompebo9",
        cache: 3600
    });
    console.log("Fetch done");
    // console.log(JSON.stringify(db));

    finaljson = {};
    db.forEach(element => {
        // console.log(element);
        // console.log(finaljson);
        if (!(element["url"].includes("safewaydelivery.in") || element["url"].includes("safeway"))) {
            console.log("downloading "+element["serial"]);
            downloadFile(element["url"], "/home/neo/Git/sw/images/" + element["serial"] + ".png");
        }
        if (element["available"] == 1) {
            if (!(element["serial"] in finaljson)) {
                finaljson[element["serial"]] = {}
                finaljson[element["serial"]]["itemname"] = element["itemname"]
                finaljson[element["serial"]]["category"] = element["category"]
                finaljson[element["serial"]]["unit"] = element["unit"]

                finaljson[element["serial"]]["subs"] = []
            }
            finaljson[element["serial"]]["subs"].push({
                "itemsubname": element["itemsubname"],
                "srp": +element["srp"],
                "mrp": +element["mrp"],
                "barcode": element["barcode"]
            });
        }

    });

    // fileContent = JSON.stringify(finaljson, null, '\t')
    fileContent = JSON.stringify(sortObjByKey(finaljson), null, '\t')
    fs.writeFileSync(__dirname + "/data.json", fileContent)

})();

