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
        sheet: "1RUK2STH2R7MoiLZsgZn7c5_y2X2PuuYAx2l7dzNSHvA",
        tab: "ompebo9",
        cache: 3600
    });
    console.log("Fetch done");
    // console.log(JSON.stringify(db));

    finaljson = {};
    db.forEach(element => {
        // console.log(element);
        // console.log(finaljson);

        if (element["available"] == "TRUE") {
            if (!(element["itemid"] in finaljson)) {
                finaljson[element["itemid"]] = {}
                finaljson[element["itemid"]]["itemname"] = element["itemname"]
                finaljson[element["itemid"]]["category"] = element["category"]
                finaljson[element["itemid"]]["unit"] = element["subtitle"]
                finaljson[element["itemid"]]["subs"] = []
            }
            finaljson[element["itemid"]]["subs"].push({
                "itemsubname": element["itemsubname"],
                "srp": +element["srp"],
                "mrp": +element["mrp"],
                "barcode": element["uniqueid"]
            });
        }

    });

    // fileContent = JSON.stringify(finaljson, null, '\t')
    fileContent = JSON.stringify(sortObjByKey(finaljson), null, '\t')
    fs.writeFileSync(__dirname + "/data.json", fileContent)

})();

