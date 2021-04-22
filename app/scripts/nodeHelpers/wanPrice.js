'use strict'
var wanPrice = function () {}
var CCRATEAPI = 'https://min-api.cryptocompare.com/data/price?fsym=WAN&tsyms=USD,EUR,GBP,BTC,CHF,REP'
wanPrice.getWANvalue = function (callback) {
    ajaxReq.http.get(CCRATEAPI).then(function (data) {
        data = data['data']
        var priceObj = {
            usd: parseFloat(data['USD']).toFixed(6),
            eur: parseFloat(data['EUR']).toFixed(6),
            btc: parseFloat(data['BTC']).toFixed(6),
            chf: parseFloat(data['CHF']).toFixed(6),
            rep: parseFloat(data['REP']).toFixed(6),
            gbp: parseFloat(data['GBP']).toFixed(6),
        }
        callback(priceObj)
    })
}
module.exports = wanPrice
