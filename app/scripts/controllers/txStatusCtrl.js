'use strict'

var txStatusCtrl = function ($scope) {
    $scope.Validator = Validator
    $scope.ajaxReq = ajaxReq
    $scope.checkTxPage = true
    $scope.checkTxReadOnly = true
    ga('send', {
        hitType: 'pageview',
        page: '/txstatus/',
    })
    $scope.txStatus = {
        found: 0,
        notFound: 1,
        mined: 2,
    }
    var MIN_GAS = 1
    $scope.txInfo = {
        status: null, // notFound foundInPending foundOnChain
        hash: globalFuncs.urlGet('txHash') == null ? '' : globalFuncs.urlGet('txHash'),
        from: '',
        to: '',
        value: '',
        valueStr: '',
        gasLimit: '',
        gasPrice: '',
        data: '',
        nonce: '',
    }

    var applyScope = function () {
        if (!$scope.$$phase) $scope.$apply()
    }
    var setUSDvalues = function () {
        ajaxReq.getWANvalue(function (data) {
            $scope.txInfo.gasPrice.usd = new BigNumber(data.usd).mul(new BigNumber($scope.txInfo.gasPrice.eth)).toFixed(2)
            $scope.txInfo.valueUSD = new BigNumber(data.usd).mul(etherUnits.toEther($scope.txInfo.value, 'wei')).toFixed(2)
            applyScope()
        })
    }
    var txToObject = function (tx) {
        var txStatus = $scope.txStatus
        if (tx) {
            console.log('txToObject')
            console.log(tx)
            $scope.txInfo = {
                status: tx.blockNumber ? txStatus.mined : txStatus.found,
                hash: tx.hash,
                from: ethUtil.toChecksumAddress(tx.from),
                to: tx.to ? ethUtil.toChecksumAddress(tx.to) : '',
                value: new BigNumber(tx.value).toString(),
                valueStr: etherUnits.toEther(tx.value, 'wei') + ' WAN',
                gasLimit: new BigNumber(tx.gas).toString(),
                gasPrice: {
                    wei: new BigNumber(tx.gasPrice).toString(),
                    gwei: new BigNumber(tx.gasPrice).div(etherUnits.getValueOfUnit('gwei')).toString(),
                    eth: etherUnits.toEther(tx.gasPrice, 'wei'),
                },
                data: tx.input === '0x' ? '' : tx.input,
                nonce: new BigNumber(tx.nonce).toString(),
            }
            if ($scope.txInfo.status === txStatus.found) {
                var _gasPrice = new BigNumber($scope.txInfo.gasPrice.wei).mul(1.1).floor()
                if (_gasPrice.lt(etherUnits.getValueOfUnit('gwei') * MIN_GAS)) _gasPrice = new BigNumber(etherUnits.getValueOfUnit('gwei') * MIN_GAS)
                $scope.parentTxConfig = {
                    to: $scope.txInfo.from,
                    value: '0',
                    sendMode: 'ether',
                    tokensymbol: '',
                    readOnly: false,
                    gasPrice: _gasPrice.toString(),
                    gasLimit: '51000',
                    data: '',
                    nonce: $scope.txInfo.nonce,
                }
                new Modal(document.getElementById('sendTransaction'))
            }
            setUSDvalues()
        } else {
            $scope.txInfo.status = txStatus.notFound
        }
    }
    var txReceiptToObject = function (tx) {
        if (tx) {
            $scope.txInfo.realStatus = tx.status
            $scope.txInfo.gasUsed = new BigNumber(tx.gasUsed).toString()
        } else {
            $scope.txInfo.status = txStatus.notFound
        }
    }
    $scope.checkTxStatus = function () {
        var txInfo = $scope.txInfo
        try {
            if (!Validator.isValidTxHash(txInfo.hash)) throw globalFuncs.errorMsgs[36]
            ajaxReq.getTransaction(txInfo.hash, function (data) {
                if (data.error) $scope.notifier.danger(data.msg)
                else {
                    txToObject(data.data)
                    ajaxReq.getTransactionReceipt(txInfo.hash, function (data) {
                        if (data.error) $scope.notifier.danger(data.msg)
                        else {
                            txReceiptToObject(data.data)
                        }
                    })
                }
            })
        } catch (e) {
            $scope.notifier.danger(e)
        }
    }

    globalFuncs.urlGet('txHash') == null ? '' : $scope.checkTxStatus()

}
module.exports = txStatusCtrl
