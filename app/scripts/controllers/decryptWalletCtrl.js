'use strict'
var decryptWalletCtrl = function ($scope, $sce, walletService) {
    $scope.walletType = ''
    $scope.requireFPass = $scope.requirePPass = $scope.showFDecrypt = $scope.showPDecrypt = $scope.showAOnly = $scope.showParityDecrypt = false
    $scope.filePassword = ''
    $scope.fileContent = ''
    $scope.Validator = Validator
    $scope.isSSL = window.location.protocol === 'https:'
    $scope.ajaxReq = ajaxReq
    $scope.nodeType = $scope.ajaxReq.type
    $scope.curNode = JSON.parse(globalFuncs.localStorage.getItem('curNode'))

    $scope.HDWallet = {
        numWallets: 0,
        walletsPerDialog: 5,
        wallets: [],
        id: 0,
        hdk: null,
        dPath: '',
        trezorEthPath: "m/44'/60'/0'/0", // first address: m/44'/5718350'/0'/0/0
        ledgerEthPath: "m/44'/60'/0'", // first address: m/44'/5718350'/0'/0/0
        trezorWanPath: "m/44'/5718350'/0'/0", // first address: m/44'/5718350'/0'/0/0
        customDPath: "m/44'/60'/1'/0", // first address: m/44'/60'/1'/0/0
        ledgerWanPath: "m/44'/5718350'/0'", // first address: m/44'/5718350'/0/0
    }
    $scope.HDWallet.dPath = $scope.HDWallet.ledgerWanPath
    $scope.mnemonicModel = new Modal(document.getElementById('mnemonicModel'))
    $scope.$watch('ajaxReq.type', function () {
        $scope.nodeType = $scope.ajaxReq.type
        $scope.setdPath()
    })
    $scope.$watch('walletType', function () {
        $scope.setdPath()
    })
    $scope.setdPath = function () {
        if ($scope.walletType === 'ledger') {
            $scope.HDWallet.dPath = $scope.HDWallet.ledgerWanPath
        } else if ($scope.walletType === 'trezor') {
            $scope.HDWallet.dPath = $scope.HDWallet.trezorWanPath
        } else {
            $scope.HDWallet.dPath = $scope.HDWallet.ledgerWanPath
        }
    }
    $scope.onHDDPathChange = function (password = $scope.mnemonicPassword) {
        $scope.HDWallet.numWallets = 0
        if ($scope.walletType === 'pastemnemonic') {
            $scope.HDWallet.hdk = hd.HDKey.fromMasterSeed(hd.bip39.mnemonicToSeed($scope.manualmnemonic.trim(), password))
            $scope.setHDAddresses($scope.HDWallet.numWallets, $scope.HDWallet.walletsPerDialog)
        } else if ($scope.walletType === 'ledger') {
            $scope.scanLedger()
        } else if ($scope.walletType === 'trezor') {
            $scope.scanTrezor()
        } else if ($scope.walletType === 'digitalBitbox') {
            $scope.scanDigitalBitbox()
        }
    }
    $scope.onCustomHDDPathChange = function () {
        $scope.HDWallet.dPath = $scope.HDWallet.customDPath
        $scope.onHDDPathChange()
    }
    $scope.showContent = function ($fileContent) {
        $scope.notifier.info(globalFuncs.successMsgs[4] + document.getElementById('fselector').files[0].name)
        try {
            $scope.requireFPass = Wallet.walletRequirePass($fileContent)
            $scope.showFDecrypt = !$scope.requireFPass
            $scope.fileContent = $fileContent
        } catch (e) {
            $scope.notifier.danger(e)
        }
    }
    $scope.openFileDialog = function ($fileContent) {
        $scope.showAOnly = false
        document.getElementById('fselector').click()
    }
    $scope.onFilePassChange = function () {
        $scope.showAOnly = false
        $scope.showFDecrypt = $scope.filePassword.length >= 0
    }
    $scope.onPrivKeyChange = function () {
        $scope.showAOnly = false
        const manualprivkey = fixPkey($scope.manualprivkey)

        $scope.requirePPass = manualprivkey.length === 128 || manualprivkey.length === 132
        $scope.showPDecrypt = manualprivkey.length === 64
    }
    $scope.onPrivKeyPassChange = function () {
        $scope.showAOnly = false
        $scope.showPDecrypt = $scope.privPassword.length > 0
    }
    $scope.onMnemonicChange = function () {
        $scope.showAOnly = false
        $scope.showMDecrypt = hd.bip39.validateMnemonic($scope.manualmnemonic)
    }
    $scope.onParityPhraseChange = function () {
        if ($scope.parityPhrase) $scope.showParityDecrypt = true
        else $scope.showParityDecrypt = false
    }
    $scope.onAddressChange = function () {
        $scope.requireFPass = $scope.requirePPass = $scope.showFDecrypt = $scope.showPDecrypt = $scope.showParityDecrypt = false
        $scope.showAOnly = $scope.Validator.isValidAddress($scope.addressOnly)
    }
    $scope.setHDAddresses = function (start, limit) {
        $scope.HDWallet.wallets = []
        for (var i = start; i < start + limit; i++) {
            $scope.HDWallet.wallets.push(new Wallet($scope.HDWallet.hdk.derive($scope.HDWallet.dPath + '/' + i)._privateKey, undefined))
            $scope.HDWallet.wallets[$scope.HDWallet.wallets.length - 1].setBalance(false)
        }
        $scope.HDWallet.id = 0
        $scope.HDWallet.numWallets = start + limit
    }
    $scope.setHDAddressesHWWallet = function (start, limit, ledger) {
        $scope.HDWallet.wallets = []
        for (var i = start; i < start + limit; i++) {
            var derivedKey = $scope.HDWallet.hdk.derive('m/' + i)
            if ($scope.walletType === 'ledger') {
                $scope.HDWallet.wallets.push(new Wallet(undefined, undefined, derivedKey.publicKey, $scope.HDWallet.dPath + '/' + i, $scope.walletType, $scope.ledger))
            } else if ($scope.walletType === 'digitalBitbox') {
                $scope.HDWallet.wallets.push(new Wallet(undefined, undefined, derivedKey.publicKey, $scope.HDWallet.dPath + '/' + i, $scope.walletType, $scope.digitalBitbox))
            } else {
                $scope.HDWallet.wallets.push(new Wallet(undefined, undefined, derivedKey.publicKey, $scope.HDWallet.dPath + '/' + i, $scope.walletType))
            }
            $scope.HDWallet.wallets[$scope.HDWallet.wallets.length - 1].type = 'addressOnly'
            $scope.HDWallet.wallets[$scope.HDWallet.wallets.length - 1].setBalance(false)
        }
        $scope.HDWallet.id = 0
        $scope.HDWallet.numWallets = start + limit
    }
    $scope.AddRemoveHDAddresses = function (isAdd) {
        if ($scope.walletType === 'ledger' || $scope.walletType === 'trezor' || $scope.walletType === 'digitalBitbox') {
            if (isAdd) $scope.setHDAddressesHWWallet($scope.HDWallet.numWallets, $scope.HDWallet.walletsPerDialog)
            else $scope.setHDAddressesHWWallet($scope.HDWallet.numWallets - 2 * $scope.HDWallet.walletsPerDialog, $scope.HDWallet.walletsPerDialog)
        } else {
            if (isAdd) $scope.setHDAddresses($scope.HDWallet.numWallets, $scope.HDWallet.walletsPerDialog)
            else $scope.setHDAddresses($scope.HDWallet.numWallets - 2 * $scope.HDWallet.walletsPerDialog, $scope.HDWallet.walletsPerDialog)
        }
    }
    $scope.setHDWallet = function () {
        walletService.wallet = $scope.wallet = $scope.HDWallet.wallets[$scope.HDWallet.id]
        $scope.mnemonicModel.close()
        $scope.notifier.info(globalFuncs.successMsgs[1])
        $scope.wallet.type = 'default'
    }
    $scope.decryptWallet = function () {
        $scope.wallet = null
        try {
            if ($scope.showPDecrypt && $scope.requirePPass) {
                $scope.wallet = Wallet.fromMyEtherWalletKey($scope.manualprivkey, $scope.privPassword)
                walletService.password = $scope.privPassword
            } else if ($scope.showPDecrypt && !$scope.requirePPass) {
                if (!$scope.Validator.isValidHex($scope.manualprivkey)) {
                    $scope.notifier.danger(globalFuncs.errorMsgs[37])
                    return
                }
                $scope.wallet = new Wallet(fixPkey($scope.manualprivkey, undefined))
                walletService.password = ''
            } else if ($scope.showFDecrypt) {
                $scope.wallet = Wallet.getWalletFromPrivKeyFile($scope.fileContent, $scope.filePassword)
                walletService.password = $scope.filePassword
            } else if ($scope.showMDecrypt) {
                $scope.mnemonicModel = new Modal(document.getElementById('mnemonicModel'))
                $scope.mnemonicModel.open()
                $scope.onHDDPathChange($scope.mnemonicPassword)
            } else if ($scope.showParityDecrypt) {
                $scope.wallet = Wallet.fromParityPhrase($scope.parityPhrase)
            }
            walletService.wallet = $scope.wallet
        } catch (e) {
            $scope.notifier.danger(globalFuncs.errorMsgs[6] + e)
        }
        if ($scope.wallet != null) {
            $scope.notifier.info(globalFuncs.successMsgs[1])
            $scope.wallet.type = 'default'
        }
    }
    $scope.decryptAddressOnly = function () {
        if ($scope.Validator.isValidAddress($scope.addressOnly)) {
            var tempWallet = new Wallet()
            $scope.wallet = {
                type: 'addressOnly',
                address: $scope.addressOnly,
                getAddressString: function () {
                    return this.address
                },
                getChecksumAddressString: function () {
                    return ethUtil.toChecksumAddress(this.getAddressString())
                },
                setBalance: tempWallet.setBalance,
                setTokens: tempWallet.setTokens,
            }
            $scope.notifier.info(globalFuncs.successMsgs[1])
            walletService.wallet = $scope.wallet
        }
    }
    $scope.HWWalletCreate = function (publicKey, chainCode, walletType, path) {
        $scope.mnemonicModel = new Modal(document.getElementById('mnemonicModel'))
        $scope.mnemonicModel.open()
        $scope.HDWallet.hdk = new hd.HDKey()
        $scope.HDWallet.hdk.publicKey = new Buffer(publicKey, 'hex')
        $scope.HDWallet.hdk.chainCode = new Buffer(chainCode, 'hex')
        $scope.HDWallet.numWallets = 0
        $scope.HDWallet.dPath = path
        $scope.setHDAddressesHWWallet($scope.HDWallet.numWallets, $scope.HDWallet.walletsPerDialog, walletType)
        walletService.wallet = null
    }
    $scope.ledgerCallback = function (result, error) {
        if (typeof result !== 'undefined') {
            $scope.HWWalletCreate(result['publicKey'], result['chainCode'], 'ledger', $scope.getLedgerPath())
        } else {
            $scope.ledgerError = true
            $scope.ledgerErrorString = error
            $scope.$apply()
        }
    }
    $scope.trezorCallback = function (response) {
        if (response.success) {
            $scope.HWWalletCreate(response.payload.publicKey, response.payload.chainCode, 'trezor', $scope.getTrezorPath())
        } else {
            $scope.trezorError = true
            $scope.trezorErrorString = response.error
            $scope.$apply()
        }
    }
    $scope.digitalBitboxCallback = function (result, error) {
        $scope.HDWallet.digitalBitboxSecret = ''
        if (typeof result !== 'undefined') {
            $scope.HWWalletCreate(result['publicKey'], result['chainCode'], 'digitalBitbox', $scope.HDWallet.dPath)
        } else { $scope.notifier.danger(error) }
    }
    $scope.scanLedger = function () {
        $scope.ledgerError = false
        $scope.ledger = new Ledger3('w0w')
        var app = new ledgerEth($scope.ledger)
        var path = $scope.getLedgerPath()
        app.getAddress(path, $scope.ledgerCallback, false, true)
    }
    $scope.scanDigitalBitbox = function () {
        $scope.digitalBitbox = new DigitalBitboxUsb()
        var app = new DigitalBitboxEth($scope.digitalBitbox, $scope.HDWallet.digitalBitboxSecret)
        var path = $scope.HDWallet.dPath
        app.getAddress(path, $scope.digitalBitboxCallback)
    }
    $scope.scanTrezor = function () {
        // trezor is using the path without change level id
        var path = $scope.getTrezorPath()

        console.warn('SCANTR', path, $scope.HDWallet)
        /*
        TrezorConnect.getXPubKey(path, $scope.trezorCallback, '1.5.2');
         */
        TrezorConnect.getPublicKey({
            path: path,
        }).then(function (result) {
            $scope.trezorCallback(result)
        })
    }
    $scope.getLedgerPath = function () {
        return $scope.HDWallet.dPath
    }
    $scope.getTrezorPath = function () {
        return $scope.HDWallet.dPath
    }
    $scope.scanMetamask = function () {
        window.wan3.eth.getAccounts(function (err, accounts) {
          if (err) $scope.notifier.danger(err + '. Are you sure you are on a secure (SSL / HTTPS) connection?')
          var address = accounts[0]
          var addressBuffer = Buffer.from(address.slice(2), 'hex')
          var wallet = new Web3Wallet(addressBuffer)
          wallet.setBalance(false)
          // set wallet
          $scope.wallet = wallet
          walletService.wallet = wallet
          $scope.notifier.info(globalFuncs.successMsgs[6])
          $scope.wallet.type = 'default'
        })
    }

    // helper function that removes 0x prefix from strings
    function fixPkey (key) {
        if (key.indexOf('0x') === 0) {
            return key.slice(2)
        }
        return key
    }
}
module.exports = decryptWalletCtrl
