function callback_markets(value) {
    if (value == undefined) return;
    if (value.rows.length == 0) return;
    markets = value;
    document.getElementById('marketArray').innerHTML = markets;
} // callback_markets

function marketInfo() {
    getdata(callback_markets, "sovspacegame", "sovspacegame", "markets", "", "", "", 100);
} // marketInfo

function callback_area(value) {
    if (value == undefined) return;
    if (value.rows.length == 0) return;
    area = value;
    document.getElementById('areaArray').innerHTML = area;
} // callback_area

function areaInfo() {
    getdata(callback_area, "sovspacegame", "sovspacegame", "area", global_account, 2, "name", 500 );
} // areaInfo

marketInfo();
areaInfo();


