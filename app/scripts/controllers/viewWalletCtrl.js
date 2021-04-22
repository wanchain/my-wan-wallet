'use strict'
var viewWalletCtrl = function ($scope, walletService) {
    $scope.usdBalance = 'loading'
    $scope.gbpBalance = 'loading'
    $scope.eurBalance = 'loading'
    $scope.btcBalance = 'loading'
    $scope.etherBalance = 'loading'
    $scope.tokenVisibility = 'hidden'
    $scope.pkeyVisible = false
    $scope.pkeyVisible2 = false
    ga('send', {
        hitType: 'pageview',
        page: '/viewwallet/',
    })

    walletService.wallet = null
    walletService.password = ''
    $scope.ajaxReq = ajaxReq
    $scope.$watch(function () {
        if (walletService.wallet == null) return null
        return walletService.wallet.getAddressString()
    }, function () {
        if (walletService.wallet == null) return
        $scope.wallet = walletService.wallet
        $scope.wd = true
        $scope.showEnc = walletService.password !== ''
        if (walletService.wallet.type === 'default') $scope.blob = globalFuncs.getBlob('text/json;charset=UTF-8', $scope.wallet.toJSON())
        if (walletService.password !== '') {
            $scope.blobEnc = globalFuncs.getBlob('text/json;charset=UTF-8', $scope.wallet.toV3(walletService.password, {
                kdf: globalFuncs.kdf,
                n: globalFuncs.scrypt.n,
            }))
            $scope.encFileName = $scope.wallet.getV3Filename()
        }
        $scope.wallet.setBalance()
        $scope.wallet.setTokens()
        $scope.WAddressString = $scope.wallet.getWAddressString()
        $scope.AddressString = $scope.wallet.getAddressString()
        $scope.ChecksumAddressString = $scope.wallet.getChecksumAddressString()
        if ($scope.wallet.type === 'default' && $scope.wallet.hwType !== 'wan3') {
            $scope.privatekeystring = $scope.wallet.getPrivateKeyString()
            $scope.privatekeystring2 = $scope.wallet.getPrivateKeyString2()
        }
    })
    $scope.$watch('ajaxReq.key', function () {
        if ($scope.wallet) {
            $scope.wallet.setBalance()
            $scope.wallet.setTokens()
        }
    })

    $scope.printQRCode = function () {
        globalFuncs.printPaperWallets(JSON.stringify([{
            address: $scope.wallet.getChecksumAddressString(),
            private: $scope.wallet.getPrivateKeyString(),
        }]))
    }

    $scope.showHidePkey = function () {
        $scope.pkeyVisible = !$scope.pkeyVisible
    }
    $scope.showHidePkey2 = function () {
        $scope.pkeyVisible2 = !$scope.pkeyVisible2
    }
    $scope.resetWallet = function () {
        $scope.wallet = null
        walletService.wallet = null
        walletService.password = ''
        $scope.blob = $scope.blobEnc = $scope.password = ''
        $scope.WAddressString = ''
        $scope.AddressString = ''
        $scope.ChecksumAddressString = ''
        $scope.privatekeystring = ''
        $scope.privatekeystring2 = ''
    }
}
module.exports = viewWalletCtrl
