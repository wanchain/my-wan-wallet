'use strict'
var globalService = function ($http, $httpParamSerializerJQLike) {

  globalFuncs.checkAndRedirectHTTPS()
  ajaxReq.http = $http
  ajaxReq.postSerializer = $httpParamSerializerJQLike
  ajaxReq.getWANvalue = nodes.wanPrice.getWANvalue

  var tabs = {
  generateWallet: {
    id: 0,
    name: 'NAV_GenerateWallet_alt',
    url: 'generate-wallet',
    mew: true, // TODO: No wallet creation until that part is working
    cx: false,
  },
  myWallet: {
    id: 1,
    name: 'NAV_MyWallets',
    url: 'my-wallet',
    mew: false,
    cx: true,
  },
  staking: {
    id: 2,
    name: 'NAV_Staking',
    url: 'staking',
    mew: true,
    cx: true,
  },
  sendTransaction: {
    id: 3,
    name: 'NAV_SendEther',
    url: 'send-transaction',
    mew: true,
    cx: true,
  },
  swap: {
    id: 4,
    name: 'NAV_Swap',
    url: 'swap',
    mew: false,
    cx: false,
  },
  offlineTransaction: {
    id: 5,
    name: 'NAV_Offline',
    url: 'offline-transaction',
    mew: true,
    cx: false,
  },
  contracts: {
    id: 6,
    name: 'NAV_Contracts',
    url: 'contracts',
    mew: true,
    cx: true,
  },
  ens: {
    id: 7,
    name: 'NAV_ENS',
    url: 'wns',
    mew: true,
    cx: false,
  },
  domainsale: {
    id: 8,
    name: 'NAV_DomainSale',
    url: 'domainsale',
    mew: true,
    cx: false,
  },
  txStatus: {
    id: 9,
    name: 'NAV_CheckTxStatus',
    url: 'check-tx-status',
    mew: true,
    cx: true,
  },
  viewWalletInfo: {
    id: 10,
    name: 'NAV_ViewWallet',
    url: 'view-wallet-info',
    mew: true,
    cx: false,
  },
  signMessage: {
    id: 11,
    name: 'NAV_SignMsg',
    url: 'sign-message',
    mew: true,
    cx: false,
  },
  }

  var currentTab = 3
  if (typeof chrome !== 'undefined') { currentTab = chrome.windows === undefined ? 3 : 3 }
  return {
    tabs: tabs,
    currentTab: currentTab,
  }
}

module.exports = globalService


