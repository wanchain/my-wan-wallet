# MyWanWallet

[![Website](https://img.shields.io/website-up-down-green-red/http/mywanwallet.com.svg?label=myWanWallet.com\&style=flat-square)](http://www.mywanwallet.com/)
[![GitHub issues](https://img.shields.io/github/issues-raw/wanchain/my-wan-wallet.svg?style=flat-square)](https://github.com/wanchain/my-wan-wallet/issues)
[![GitHub package version](https://img.shields.io/github/package-json/v/wanchain/my-wan-wallet.svg?style=flat-square)](https://github.com/wanchain/my-wan-wallet/blob/main/package.json)
![GitHub contributors](https://img.shields.io/github/contributors/wanchain/my-wan-wallet.svg?style=flat-square) 

### [https://www.mywanwallet.com](https://www.mywanwallet.com)

### [Download the Latest Release](https://github.com/wanchain/my-wan-wallet/releases/latest)

- wanwallet-vX.X.X.X.zip is the  package containing the software


### MWW Around the Web

- [Website: https://www.mywanwallet.com/](https://www.mywanwallet.com/)
- [wanchain (founder) reddit: https://www.reddit.com/user/wanchain/](https://www.reddit.com/user/wanchain/)
- [Twitter: https://twitter.com/wanchain](https://twitter.com/wanchain)


### MyWanWallet

- MyWanWallet is a free, open-source, client-side tool for easily & securely interacting with the Wanchain network. As one of the leading providers of Wanchain services, MyWanWallet equips users with an easy-to-understand and accessible suite of tools for their needs.
- It was created and is maintained by [wanchain](https://github.com/wanchain).
- It was forked from myetherwallet.com (https://github.com/kvhnuke/etherwallet)

#### Features

- Create new wallets completely client side.
- Access your wallet via unencrypted private key, encrypted private key, keystore files, mnemonics, Ledger Nano S or TREZOR hardware wallet.
- Easily send WAN and *any* ERC-20 Standard Token.
- Generate, sign & send transactions offline, ensuring your private keys never touch an internet-connected device.
- Securely access your WAN & Tokens on your [Ledger](https://www.ledger.com?r=651b52292b63) or [TREZOR](https://shop.trezor.io?a=mywanwallet.com) Hardware Wallet via the MyWanWallet interface.

### Our Philosophy

 - **Empower the people**: Give people the ability to interact with the Wanchain blockchain easily, without having to run a full node.
 - **Make it easy & free**: Everyone should be able to create a wallet and send Wan & Tokens without additional cost.
 - **People are the Priority**: People are the most important & their experience trumps all else. If monetization worsens the experience, we don't do it. (e.g. ads)
 - **A learning experience, too**: We want to educate about Wanchain, security, privacy, the importance of controlling your own keys, how the blockchain works, and how Wanchain and blockchain technologies enable a better world.
 - **If it can be hacked, it will be hacked**: Never save, store, or transmit secret info, like passwords or keys.
 - **Offline / Client-Side**: User should be able to run locally and offline without issue.
 - **Private**: No tracking!!! No emails. No ads. No demographics. We don't even know how many wallets have been generated, let alone who / what / where you are.
 - **Open source & audit-able**


### Users (non-developers)

- [It is recommended you start here.](https://myetherwallet.github.io/knowledge-base/getting-started/getting-started-new.html)
- You can run MyWanWallet.com on your computer. You can create a wallet completely offline & send transactions from the "Offline Transaction" page.

1. Go to https://github.com/wanchain/my-wan-wallet/releases/latest.
2. Click on wanwallet-vX.X.X.X.zip.
3. Move zip to an airgapped computer.
4. Unzip it and double-click index.html.
5. MyWanWallet.com is now running entirely on your computer.

In case you are not familiar, you need to keep the entire folder in order to run the website, not just index.html. Don't touch or move anything around in the folder. If you are storing a backup of the MyWanWallet repo for the future, we recommend just storing the ZIP so you can be sure the folder contents stay intact.

As we are constantly updating MyWanWallet.com, we recommend you periodically update your saved version of the repo.


### Developers

If you want to help contribute, here's what you need to know to get it up and running and compiling.

- We use angular and bootstrap. We used to use jQuery and Bootstrap until it was converted in April 2016. If you wonder why some things are set up funky, that's why.
- Please fork and make PRs to the mercury branch
- We use npm / gulp for compiling. There is a lot of stuff happening in the compilation.

**Getting Started**

- Start by running `npm install`.
- Run `npm run dev`. Gulp will then watch & compile everything and then watch for changes to the HTML, JS, or CSS.
- For distribution, run `npm run dist`.

**Folder Structure**
- `fonts` and `images` get moved into their respective folders. This isn't watched via gulp so if you add an image or font, you need to run `gulp` again.
- `includes` are the pieces of the pages / the pages themselves. These are pretty self-explanatory and where you will make most frontend changes.
- `layouts` are the pages themselves. These basically take all the pieces of the pages and compile into one massive page. The navigation is also found here...sort of.
    * `index.html` is for MyWanWallet.com.

- The wallet decrypt directives are at `scripts/directives/walletDecryptDrtv.js`. These show up on a lot of pages.
- The navigation is in `scripts/services/globalServices.js`. Again, we control which navigation items show up in which version of the site in this single file.
- As of September 2016, almost all the copy in the .tpl files are only there as placeholders. It all gets replaced via angular-translate. If you want to change some copy you need to do so in `scripts/translations/en.js` folder. You should also make a note about what you changed and move it to the top of the file so that we can make sure it gets translated if necessary.
- `styles` is all the less. It's a couple custom folders and bootstrap. This badly needs to be redone. Ugh.


### Contact
If you can think of any other features or run into bugs, let us know. You can fork, open a PR, open an issue, or support at mywanwallet.com.

#### MyWanWallet.com is licensed under The MIT License (MIT).

[circle-image]: https://img.shields.io/circleci/build/github/wanchain/my-wan-wallet.svg?style=flat-square
[circle-url]: https://circleci.com/gh/wanchain/my-wan-wallet
[coveralls-image]: https://coveralls.io/repos/github/wanchain/my-wan-wallet/badge.svg
[coveralls-url]: https://coveralls.io/github/wanchain/my-wan-wallet
