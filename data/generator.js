const drive = require("drive-db");
(async () => {

    const db = await drive({
        sheet: "12v8_ns7epT7yypNSuIaEIjzRSdfsb7Nn968H2ncYcN0",
        tab: "3",
        cache: 3600
    });
    console.log(JSON.stringify(db));

    finaljson = {};
    db.forEach(element => {
        // console.log(element);
        // console.log(finaljson);
        if (!(element["serial"] in finaljson)) {
            finaljson[element["serial"]] = {}
            finaljson[element["serial"]]["itemname"] = element["itemname"]
            finaljson[element["serial"]]["category"] = element["category"]
            finaljson[element["serial"]]["subs"] = []
        }
        finaljson[element["serial"]]["subs"].push({
            "itemsubname": element["itemsubname"],
            "sellingprice": element["sellingprice"],
            "actualprice": element["actualprice"]
        });



    });
    console.log(JSON.stringify(finaljson));

})();

