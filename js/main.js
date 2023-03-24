function callback_markets(value) {
    if (value == undefined) return;
    if (value.rows.length == 0) return;
    markets = value;
    let marketNames = [];
    let marketName;
    let l = markets.rows.length;
    for (let i = 0; i < l; i++) {
        marketName = markets.rows[i].name + "<br>";
        marketNames.push(marketName);
    }
    document.getElementById('marketArray').innerHTML = marketNames;
} // callback_markets

function marketInfo() {
    getdata(callback_markets, "sovspacegame", "sovspacegame", "markets", "", "", "", 100);
} // marketInfo

function callback_area(value) {
    if (value == undefined) return;
    if (value.rows.length == 0) return;
    area = value;
    let areaIDs = [];
    let areaID;
    let l = area.rows.length;
    for (let i = 0; i < l; i++) {
        areaID = area.rows[i].id + "<br>";
        areaIDs.push(areaID);
    }
    document.getElementById('areaArray').innerHTML = areaIDs;
} // callback_area

function areaInfo() {
    getdata(callback_area, "sovspacegame", "sovspacegame", "area", global_account, 2, "name", 500 );
} // areaInfo

marketInfo();
areaInfo();


