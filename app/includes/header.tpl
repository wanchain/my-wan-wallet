<!DOCTYPE html>
<html lang="en" ng-app="mewApp">
<head>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4QDBD0ZMH4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-4QDBD0ZMH4');
</script>

<!-- <script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-123889185-3', 'auto');
// ga('send', 'pageview');
</script> -->

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>MyWanWallet.com</title>
<meta property="og:title" content="MyWanWallet.com: Your Key to Wanchain">
<meta property="og:site_name" content="MyWanWallet.com: Your Key to Wanchain">
<meta name="twitter:title" content="MyWanWallet.com: Your Key to Wanchain">
<meta name="apple-mobile-web-app-title" content="MyWanWallet.com: Your Key to Wanchain">
<link href="https://mywanwallet.com" rel="canonical">
<meta content="https://mywanwallet.com" property="og:url">
<meta content="https://mywanwallet.com" name="twitter:url">
<link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Source+Code+Pro:300,400,700" rel="stylesheet">
<link rel="stylesheet" href="css/etherwallet-master.min.css">
<script type="text/javascript" src="js/trezor-connect.js"></script>
<script type="text/javascript">
TrezorConnect.manifest({
    email: 'techsupport@wanchain.com',
    appUrl: 'https://mywanwallet.com'
})
</script>
<script type="text/javascript" src="js/etherwallet-static.min.js?version=%%GULP_INJECT_VERSION%%"></script>
<script type="text/javascript" src="js/etherwallet-master.js?version=%%GULP_INJECT_VERSION%%"></script>
<meta name="description" content="MyWanWallet (MEW) is a free, open-source, client-side interface for generating Wanchain wallets & more. Interact with the Wanchain blockchain easily & securely.">
<meta property="og:description"  content="Free, open-source, client-side Wanchain wallet. Enabling you to interact with the blockchain easily & securely.">
<meta name="twitter:description" content="Free, open-source, client-side Wanchain wallet. Enabling you to interact with the blockchain easily & securely.">
<meta name="robots" content="index,follow">
<meta name="googlebot" content="index,follow">
<meta name="google-site-verification" content="IpChQ00NYUQuNs_7Xs6xlnSdzalOlTUYbBsr8f7OpvM" />
<link href="images/fav/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180">
<link href="images/fav/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32">
<link href="images/fav/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16">
<link href="images/fav/manifest.json" rel="manifest">
<link href="images/fav/safari-pinned-tab.svg" rel="mask-icon" color="#2f99b0">
<link href="images/fav/favicon.ico" rel="shortcut icon">
<meta name="apple-mobile-web-app-title" content="MyWanWallet &middot; Your Key to Wanchain">
<meta name="application-name" content="MyWanWallet">
<meta name="msapplication-config" content="images/fav/browserconfig.xml">
<meta name="theme-color" content="#1d6986">
<meta name="apple-mobile-web-app-status-bar-style" content="#1d6986">
<meta property="og:url" content="https://mywanwallet.com" />
<meta property="og:title" content="MyWanWallet.com  &middot; Your Key to Wanchain" />
<meta property="og:type" content="website">
<meta property="og:image" content="/images/myetherwallet-logo-banner.png" />
<meta property="og:image" content="/images/myetherwallet-logo.png" />
<meta property="og:image" content="/images/myetherwallet-logo-square.png" />
<meta property="og:image" content="/images/myetherwallet-banner-fun.jpg" />
<meta name="twitter:image" content="/images/myetherwallet-logo-twitter.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@MyWanWallet">
<meta name="twitter:creator" content="@MyWanWallet">
<script type="application/ld+json">
{
"@context": "http://schema.org",
"@type" : "Organization",
"name" : "MyWanWallet",
"legalName" : "MyWanWallet",
"url" : "https://mywanwallet.com/",
"contactPoint" : [{
  "@type" : "ContactPoint",
  "email" : "support@wanchain.org",
  "url"   : "https://mywanwallet.com",
  "contactType" : "customer service"
}],
"logo" : "https://mywanwallet.com/images/myetherwallet-logo.png",
"description": "MyWanWallet.com is a free, open-source, client-side interface for generating Wanchain wallets &amp; more. Interact with the Wanchain blockchain easily &amp; securely.",
"sameAs" : [
  "https://mywanwallet.com/",
  "https://github.nl/wanchain/my-wan-wallet",
]
}
</script>
</head>
<body>

<header class="{{curNode.name}} {{curNode.service}} {{curNode.service}} nav-index-{{gService.currentTab}}" aria-label="header" ng-controller='tabsCtrl' >

@@if (site === 'mew' ) {
  <div class="small announcement annoucement-danger">
    <div class="container">
      DON'T GET PHISHED, please! 🎣 Thank you! 🤗
      <br />
      1. BOOKMARK <a href="https://mywanwallet.com"> MYWANWALLET.COM </a>
      <br />
      This site is still Beta Software! Please use a hardware wallet and if not a local copy to prevent problems! Read our <a data-target="#disclaimerModal" data-toggle="modal" target="_blank" rel="noopener noreferrer" role="link" tabindex="0"  translate="FOOTER_4">disclaimer</a>!
    </div>
  </div>
}

<section class="bg-gradient header-branding">
  <section class="container">
    @@if (site === 'mew' ) {
      <a class="brand" href="/" aria-label="Go to homepage">
        <img src="images/logo-wanchain.png" width="250px" alt="MyWanWallet" />
        <p class="small visible-xs">%%GULP_INJECT_VERSION%%</p>
      </a>
    }
    <div class="tagline">

    <span class="hidden-xs">%%GULP_INJECT_VERSION%%</span>

    <!-- Disable Translations for now -->
    <!--span class="dropdown dropdown-lang" ng-cloak>
      <a tabindex="0"  aria-haspopup="true" aria-expanded="false" aria-label="change language. current language {{curLang}}" class="dropdown-toggle  btn btn-white" ng-click="dropdown = !dropdown">{{curLang}}<i class="caret"></i></a>
      <ul class="dropdown-menu" ng-show="dropdown">
        <li><a ng-class="{true:'active'}[curLang=='Nederlands']"      ng-click="changeLanguage('nl','Nederlands'     )"> Nederlands      </a></li>
        <li role="separator" class="divider"></li>
        <li><a data-toggle="modal" data-target="#disclaimerModal" translate="FOOTER_4"> Disclaimer </a></li>
      </ul>
    </span-->

    <span class="dropdown dropdown-gas" ng-cloak>
      <a tabindex="0" aria-haspopup="true" aria-label="adjust gas price" class="dropdown-toggle  btn btn-white" ng-click="dropdownGasPrice = !dropdownGasPrice">
        <span translate="OFFLINE_Step2_Label_3">Gas Price</span>:
          {{gas.value}} Gwei
          <i class="caret"></i>
      </a>
      <ul class="dropdown-menu" ng-show="dropdownGasPrice">
        <div class="header--gas">
          <span translate="OFFLINE_Step2_Label_3">Gas Price</span>:
          {{gas.value}} Gwei
          <input type="range" ng-model="gas.value" min="{{gas.min}}" max="{{gas.max}}" step="{{gas.step}}" ng-change="gasChanged()"/>
          <p class="small col-xs-4 text-left"> <!--translate="GAS_Price_1"-->
            Really, really slow
          </p>
          <p class="small col-xs-4 text-center"> <!--translate="GAS_Price_2"-->
            Maybe Fast?
          </p>
          <p class="small col-xs-4 text-right"> <!--translate="GAS_Price_3"-->
            Fast
          </p>
          <br />
          <p class="small" style="white-space:normal;font-weight:300;margin: 2rem 0 0;" translate="GAS_PRICE_Desc"></p>
          <!--a class="small"
             translate="x_ReadMore"
             href="https://myetherwallet.github.io/knowledge-base/gas/what-is-gas-ethereum.html"
             target="_blank"
             rel="noopener noreferrer"></a-->
        </div>
      </ul>
      <p class="dropdown-gas__msg"
         ng-show="gasPriceMsg"
         ng-hide="ajaxReq.type!='ETH'">
        The network is really full right now. Check
        <a href="https://ethgasstation.info/"
           target="_blank" rel="noopener noreferrer">Eth Gas Station</a>
        for gas price to use.
      </p>
    </span>

    <!-- Warning: The separators you see on the frontend are in styles/etherwallet-custom.less. If you add / change a node, you have to adjust these. Ping tayvano if you're not a CSS wizard -->
    <span class="dropdown dropdown-node" ng-cloak>
      <a tabindex="0"
         aria-haspopup="true"
         aria-label="change node. current node {{curNode.name}} node by {{curNode.service}}"
         class="dropdown-toggle  btn btn-white"
         ng-click="dropdownNode = !dropdownNode">
           <span translate="X_Network">Network:</span>
           {{curNode.name}}
           <small>({{curNode.service}})</small>
           <i class="caret"></i>
      </a>
      <ul class="dropdown-menu" ng-show="dropdownNode">
        <li ng-repeat="(key, value) in nodeList">
          <a ng-class="{true:'active'}[curNode == key]" ng-click="changeNode(key)">
            {{value.name}}
            <small> ({{value.service}}) </small>
            <img ng-show="value.service=='Custom'" src="images/icon-remove.svg" class="node-remove" title="Remove Custom Node" ng-click="removeNodeFromLocal(value.name)"/>
          </a>
        </li>
        <li>
          <a ng-click="customNodeModal.open(); dropdownNode = !dropdownNode;" translate="X_Network_Custom">
            Add Custom Network / Node
          </a>
        </li>
      </ul>
    </span>

    </div>
  </section>
</section>

<nav role="navigation" aria-label="main navigation" class="container nav-container overflowing" >
  <a aria-hidden="true" ng-show="showLeftArrow" class="nav-arrow-left" ng-click="scrollLeft(100);" ng-mouseover="scrollHoverIn(true,2);" ng-mouseleave="scrollHoverOut()">&#171;</a>
  <div class="nav-scroll">
    <ul class="nav-inner">
      @@if (site === 'mew' ) {
      <li ng-repeat="tab in tabNames track by $index" \
          class="nav-item {{tab.name}}" \
          ng-class="{active: $index==gService.currentTab}"
          ng-show="tab.mew"
          ng-click="tabClick($index)">
            <a tabindex="0" aria-label="nav item: {{tab.name | translate}}" translate="{{tab.name}}"></a>
      </li>
      }
      @@if (site === 'cx' ) {
      <li ng-repeat="tab in tabNames track by $index" \
          class="nav-item {{tab.name}}" \
          ng-class="{active: $index==gService.currentTab}"
          ng-show="tab.cx"
          ng-click="tabClick($index)">
            <a tabindex="0" aria-label="nav item: {{tab.name | translate}}" translate="{{tab.name}}"></a>
      </li>
      }
      <li class="nav-item help">
        <a href="https://myetherwallet.github.io/knowledge-base/" target="_blank" rel="noopener noreferrer">
          <span translate="NAV_Help">
            Help
          </span>
        </a>
      </li>
    </ul>
  </div>
  <a aria-hidden="true"
     ng-show="showRightArrow"
     class="nav-arrow-right"
     ng-click="scrollRight(100);"
     ng-mouseover="scrollHoverIn(false,2);"
     ng-mouseleave="scrollHoverOut()">&#187;</a>
</nav>

@@if (site === 'mew' ) { @@include( './header-node-modal.tpl', { "site": "mew" } ) }
@@if (site === 'cx'  ) { @@include( './header-node-modal.tpl', { "site": "cx"  } ) }

</header>
