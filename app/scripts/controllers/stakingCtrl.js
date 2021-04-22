'use strict'
var stakingCtrl = function ($scope, $sce, walletService, $rootScope) {
    $scope.validator = {
        address: '0x0',
        name: '',
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=',
    }
    ajaxReq.http.get('https://mywanwallet.com/validators.json').then(function (data) {
        data = data['data']
        $scope.validatorstaticconfig = []
        if (ajaxReq.chainId === 6) {
            $scope.validatorstaticconfig = data['pluto']
        }
        if (ajaxReq.chainId === 3) {
            $scope.validatorstaticconfig = data['testnet']
        }
        if (ajaxReq.chainId === 1) {
            $scope.validatorstaticconfig = data['mainnet']
        }
        var sortByProperty = function (objArray, prop, direction) {
            const clone = objArray.slice(0)
            const direct = arguments.length > 2 ? arguments[2] : 1
            const propPath = (prop.constructor === Array) ? prop : prop.split('.')
            clone.sort(function (a, b) {
                for (var p in propPath) {
                    if (a[propPath[p]] && b[propPath[p]]) {
                        a = a[propPath[p]]
                        b = b[propPath[p]]
                    }
                }
                return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0))
            })
            return clone
        }

        ajaxReq.getCurrentBlock(function (data) {
            $scope.currentBlockNumber = data.data
            ajaxReq.getValidators(parseInt($scope.currentBlockNumber), function (data) {
                // Fill the validator list with the validators from the pos_stakeinfo call
                ajaxReq.validatorList = data.data
                $scope.chainlayerid = 0
                var a = 0
                var b = 0
                $scope.addressDrtv.readOnly = true

                // Merge the manual info into the list
                for (a in $scope.validatorstaticconfig) {
                    for (b in ajaxReq.validatorList) {
                        if ($scope.validatorstaticconfig[a].address.toLowerCase() === ajaxReq.validatorList[b].address.toLowerCase()) {
                            ajaxReq.validatorList[b].name = $scope.validatorstaticconfig[a].name
                            ajaxReq.validatorList[b].logo = $scope.validatorstaticconfig[a].logo
                            ajaxReq.validatorList[b].custom = $scope.validatorstaticconfig[a]
                        }
                        if (ajaxReq.validatorList[b].name === 'ChainLayer') {
                            // Do the checksum here because we'll skip ChainLayer later :)
                            ajaxReq.validatorList[b].address = ethUtil.toChecksumAddress(ajaxReq.validatorList[b].address)
                            $scope.chainlayerid = b
                        }
                    }
                }

                // Now add fields to show remaining capacity and total capacity
                var i = 0
                for (b in ajaxReq.validatorList) {
                    ajaxReq.validatorList[b].selfstake = parseInt(ajaxReq.validatorList[b].amount) / 1000000000000000000
                    ajaxReq.validatorList[b].totalstake = parseInt(ajaxReq.validatorList[b].amount) / 1000000000000000000

                    for (i = 0; i < ajaxReq.validatorList[b].partners.length; i++) {
                        ajaxReq.validatorList[b].totalstake += parseInt(ajaxReq.validatorList[b].partners[i].amount) / 1000000000000000000
                        ajaxReq.validatorList[b].selfstake += parseInt(ajaxReq.validatorList[b].partners[i].amount) / 1000000000000000000
                    }

                    for (i = 0; i < ajaxReq.validatorList[b].clients.length; i++) {
                        ajaxReq.validatorList[b].totalstake += parseInt(ajaxReq.validatorList[b].clients[i].amount) / 1000000000000000000
                    }

                    ajaxReq.validatorList[b].selfstake = Math.floor(ajaxReq.validatorList[b].selfstake)
                    ajaxReq.validatorList[b].totalstake = Math.floor(ajaxReq.validatorList[b].totalstake)
                    ajaxReq.validatorList[b].capacity = Math.floor(ajaxReq.validatorList[b].selfstake * 11)
                    ajaxReq.validatorList[b].leftovercapacity = Math.floor(ajaxReq.validatorList[b].capacity - ajaxReq.validatorList[b].totalstake)
                    ajaxReq.validatorList[b].feestring = (ajaxReq.validatorList[b].feeRate / 100) + '%'
                }

                // If no response from pos_stakeinfo the list is empty so we'll just add ChainLayer
                if (ajaxReq.validatorList.length === 0) {
                    ajaxReq.validatorList = $scope.validatorstaticconfig
                    $scope.selectExistingValidator(0)
                    $scope.chainlayerid = 0
                } else {
                    // Select ChainLayer
                    // $scope.selectExistingValidator($scope.chainlayerid)
                }

                // Now change the list in the right order (total stake descending)
                var newValidatorList = sortByProperty(ajaxReq.validatorList, 'totalstake', -1)
                ajaxReq.validatorList = newValidatorList

                // Now change the list in the right order (chainlayer on top, first named then unnamed validators)
                newValidatorList = []
                // ChainLayer
                for (a in ajaxReq.validatorList) {
                    if (ajaxReq.validatorList[a].name) {
                        if (ajaxReq.validatorList[a].name === 'ChainLayer') {
                            ajaxReq.validatorList[a].address = ethUtil.toChecksumAddress(ajaxReq.validatorList[a].address)
                            newValidatorList.push(ajaxReq.validatorList[a])
                        }
                    }
                }

                // Other validators with a name
                for (a in ajaxReq.validatorList) {
                    if (ajaxReq.validatorList[a].name) {
                        if (ajaxReq.validatorList[a].name !== 'ChainLayer') {
                            // Make address checksum
                            ajaxReq.validatorList[a].address = ethUtil.toChecksumAddress(ajaxReq.validatorList[a].address)
                            // Only add if Fee < 10000
                            if (ajaxReq.validatorList[a].feeRate < 10000) {
                                newValidatorList.push(ajaxReq.validatorList[a])
                            }
                        }
                    }
                }

                // Validators without a name
                for (a in ajaxReq.validatorList) {
                    if (!ajaxReq.validatorList[a].name) {
                        // Make address checksum
                        ajaxReq.validatorList[a].address = ethUtil.toChecksumAddress(ajaxReq.validatorList[a].address)
                        // Make name same as address
                        ajaxReq.validatorList[a].name = ajaxReq.validatorList[a].address
                        // Only add if Fee < 10000
                        if (ajaxReq.validatorList[a].feeRate < 10000) {
                            newValidatorList.push(ajaxReq.validatorList[a])
                        }
                    }
                }
                ajaxReq.validatorList = newValidatorList
                $scope.selectExistingValidator(0)
            })
        })
    })

    $scope.visibility = 'stakingView'
    $scope.setVisibility = function (str) {
        $scope.visibility = str
        $scope.tx = {
            // if there is no gasLimit or gas key in the URI, use the default value. Otherwise use value of gas or gasLimit. gasLimit wins over gas if both present
            Txtype: '0x01',
            gasLimit: '',
            data: '',
            to: $scope.contract.address,
            unit: 'ether',
            value: 0,
            nonce: null,
            gasPrice: null,
            donate: false,
        }
        $scope.selectExistingValidator(0)
        $scope.tx.data = $scope.getTxData()
        $scope.estimateGasLimit()
        ga('send', {
            hitType: 'pageview',
            page: '/staking/' + $scope.visibility,
        })
    }

    $scope.$watch('validator.address', function (newValue, oldValue) {
        if ($scope.Validator.isValidAddress($scope.validator.address)) {
            for (var i in ajaxReq.validatorList) {
                if (ajaxReq.validatorList[i].address.toLowerCase() === $scope.validator.address.toLowerCase()) {
                    $scope.validator.name = ajaxReq.validatorList[i].name
                    $scope.tx.data = $scope.getTxData()
                    if ($scope.estimateTimer) clearTimeout($scope.estimateTimer)
                    $scope.estimateTimer = setTimeout(function () {
                        $scope.estimateGasLimit()
                    }, 500)
                    break
                }
            }
        }
    })

    // Staking contract ABI
    $scope.contract = {
        abi: '[{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"stakeAppend","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"lockEpochs","type":"uint256"}],"name":"stakeUpdate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"secPk","type":"bytes"},{"name":"bn256Pk","type":"bytes"},{"name":"lockEpochs","type":"uint256"},{"name":"feeRate","type":"uint256"}],"name":"stakeIn","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"secPk","type":"bytes"},{"name":"bn256Pk","type":"bytes"},{"name":"lockEpochs","type":"uint256"},{"name":"feeRate","type":"uint256"},{"name":"maxFeeRate","type":"uint256"}],"name":"stakeRegister","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"renewal","type":"bool"}],"name":"partnerIn","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"delegateAddress","type":"address"}],"name":"delegateIn","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"delegateAddress","type":"address"}],"name":"delegateOut","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"},{"name":"feeRate","type":"uint256"}],"name":"stakeUpdateFeeRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"posAddress","type":"address"},{"indexed":true,"name":"v","type":"uint256"},{"indexed":false,"name":"feeRate","type":"uint256"},{"indexed":false,"name":"lockEpoch","type":"uint256"},{"indexed":false,"name":"maxFeeRate","type":"uint256"}],"name":"stakeRegister","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"posAddress","type":"address"},{"indexed":true,"name":"v","type":"uint256"},{"indexed":false,"name":"feeRate","type":"uint256"},{"indexed":false,"name":"lockEpoch","type":"uint256"}],"name":"stakeIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"posAddress","type":"address"},{"indexed":true,"name":"v","type":"uint256"}],"name":"stakeAppend","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"posAddress","type":"address"},{"indexed":true,"name":"lockEpoch","type":"uint256"}],"name":"stakeUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"posAddress","type":"address"},{"indexed":true,"name":"v","type":"uint256"},{"indexed":false,"name":"renewal","type":"bool"}],"name":"partnerIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"posAddress","type":"address"},{"indexed":true,"name":"v","type":"uint256"}],"name":"delegateIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"posAddress","type":"address"}],"name":"delegateOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"posAddress","type":"address"},{"indexed":true,"name":"feeRate","type":"uint256"}],"name":"stakeUpdateFeeRate","type":"event"}]',
        functions: [],
    }
    switch (ajaxReq.chainId) {
        case 1:
            $scope.contract.address = '0x00000000000000000000000000000000000000da'
            break
        case 3:
            $scope.contract.address = '0x00000000000000000000000000000000000000da'
            break
        default:
            $scope.contract.address = '0x00'
    }
    $scope.contract.functions = []
    var tAbi = JSON.parse($scope.contract.abi)
    for (var i in tAbi) {
        if (tAbi[i].type === 'function') {
            tAbi[i].inputs.map(function (i) { i.value = '' })
            $scope.contract.functions.push(tAbi[i])
        }
    }
    // Function number 5 is DelegateIn
    $scope.contract.delegateFunc = { name: $scope.contract.functions[5].name, index: 5 }
    $scope.contract.withdrawFunc = { name: $scope.contract.functions[6].name, index: 6 }

    $scope.getTxData = function () {
        var curFunc = null
        if ($scope.visibility === 'stakingView') {
            curFunc = $scope.contract.functions[$scope.contract.delegateFunc.index]
        } else {
            curFunc = $scope.contract.functions[$scope.contract.withdrawFunc.index]
            $scope.tx.value = 0
        }
        var fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc)
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName)
        var data = '0x' + funcSig + ethUtil.solidityCoder.encodeParams(['address'], [$scope.validator.address])
        return data
    }

    $scope.selectExistingValidator = function (index) {
        $scope.selectedValidator = ajaxReq.validatorList[index]
        $scope.validator = $scope.selectedValidator
        $scope.addressDrtv.ensAddressField = $scope.selectedValidator.address
        $scope.addressDrtv.showDerivedAddress = false
        $scope.dropdownExistingValidators = false
        $scope.dropdownValidators = false

        if ($scope.initValidatorTimer) clearTimeout($scope.initValidatorTimer)
        $scope.initValidatorTimer = setTimeout(function () {
            $scope.initValidator()
        }, 50)
    }

    $scope.initValidator = function () {
        try {
            if (!$scope.Validator.isValidAddress($scope.validator.address)) throw globalFuncs.errorMsgs[5]
        } catch (e) {
            $scope.notifier.danger(e)
        }
    }

    $scope.tx = {}
    $scope.signedTx
    $scope.ajaxReq = ajaxReq
    $scope.unitReadable = ajaxReq.type
    $scope.sendTxModal = new Modal(document.getElementById('sendTransaction'))
    $scope.withdrawTxModal = new Modal(document.getElementById('withdrawTransaction'))
    walletService.wallet = null
    walletService.password = ''
    $scope.showAdvance = $rootScope.rootScopeShowRawTx = false
    $scope.dropdownEnabled = true
    $scope.Validator = Validator
    $scope.gasLimitChanged = false
    $scope.tx.readOnly = globalFuncs.urlGet('readOnly') != null
    // var currentTab = $scope.globalService.currentTab
    // var tabs = $scope.globalService.tabs
    $scope.customGasMsg = ''

    $scope.customGas = CustomGasMessages

    ga('send', {
        hitType: 'pageview',
        page: '/staking/' + $scope.visibility,
    })

    $scope.tx = {
        // if there is no gasLimit or gas key in the URI, use the default value. Otherwise use value of gas or gasLimit. gasLimit wins over gas if both present
        Txtype: '0x01',
        gasLimit: '',
        data: '',
        to: $scope.contract.address,
        unit: 'ether',
        value: 0,
        nonce: null,
        gasPrice: null,
        donate: false,
    }

    $scope.setSendMode = function (sendMode, tokenId = '', tokensymbol = '') {
        $scope.tx.sendMode = sendMode
        $scope.unitReadable = ''
        if (globalFuncs.urlGet('tokensymbol') != null) {
            $scope.unitReadable = $scope.tx.tokensymbol
            $scope.tx.sendMode = 'token'
        } else if (sendMode === 'ether') {
            $scope.unitReadable = ajaxReq.type
        } else {
            $scope.unitReadable = tokensymbol
            $scope.tokenTx.id = tokenId
        }
        $scope.dropdownAmount = false
    }

    var applyScope = function () {
        if (!$scope.$$phase) $scope.$apply()
    }

    var defaultInit = function () {
        $scope.setSendMode('ether')
    }
    $scope.$watch(function () {
        if (walletService.wallet === null) return null
        return walletService.wallet.getAddressString()
    }, function () {
        if (walletService.wallet == null) return
        $scope.wallet = walletService.wallet
        $scope.wd = true
        $scope.wallet.setBalance(applyScope)
        $scope.wallet.setTokens()
        if ($scope.parentTxConfig) {
            var setTxObj = function () {
                $scope.addressDrtv.ensAddressField = $scope.parentTxConfig.to
                $scope.tx.value = $scope.parentTxConfig.value
                $scope.tx.sendMode = $scope.parentTxConfig.sendMode ? $scope.parentTxConfig.sendMode : 'ether'
                $scope.tx.tokensymbol = $scope.parentTxConfig.tokensymbol ? $scope.parentTxConfig.tokensymbol : ''
                $scope.tx.gasPrice = $scope.parentTxConfig.gasPrice ? $scope.parentTxConfig.gasPrice : null
                $scope.tx.nonce = $scope.parentTxConfig.nonce ? $scope.parentTxConfig.nonce : null
                $scope.tx.data = $scope.parentTxConfig.data ? $scope.parentTxConfig.data : $scope.tx.data
                $scope.tx.readOnly = $scope.addressDrtv.readOnly = $scope.parentTxConfig.readOnly ? $scope.parentTxConfig.readOnly : false
                if ($scope.parentTxConfig.gasLimit) {
                    $scope.tx.gasLimit = $scope.parentTxConfig.gasLimit
                    $scope.gasLimitChanged = true
                }
            }
            $scope.$watch('parentTxConfig', function () {
                setTxObj()
            }, true)
        }
        defaultInit()
    })

    $scope.$watch('ajaxReq.key', function () {
        if ($scope.wallet) {
            $scope.setSendMode('ether')
            $scope.wallet.setBalance(applyScope)
            $scope.wallet.setTokens()
        }
    })

    $scope.$watch('tx', function (newValue, oldValue) {
        $rootScope.rootScopeShowRawTx = false
        if (oldValue.sendMode && oldValue.sendMode !== newValue.sendMode && newValue.sendMode === 'ether') {
            $scope.tx.data = $scope.getTxData()
            $scope.tx.gasLimit = globalFuncs.defaultTxGasLimit
        }
        if (newValue.gasLimit === oldValue.gasLimit && $scope.wallet && $scope.Validator.isValidAddress($scope.tx.to) && $scope.Validator.isPositiveNumber($scope.tx.value) && $scope.Validator.isValidHex($scope.tx.data) && $scope.tx.sendMode !== 'token') {
            if ($scope.estimateTimer) clearTimeout($scope.estimateTimer)
            $scope.estimateTimer = setTimeout(function () {
                $scope.estimateGasLimit()
            }, 500)
        }
        if (newValue.to !== oldValue.to) {
            for (var i in $scope.customGas) {
                if ($scope.tx.to.toLowerCase() === $scope.customGas[i].to.toLowerCase()) {
                    $scope.customGasMsg = $scope.customGas[i].msg !== '' ? $scope.customGas[i].msg : ''
                    return
                }
            }
            $scope.customGasMsg = ''
        }
    }, true)

    $scope.estimateGasLimit = function () {
        var estObj = {
            from: $scope.wallet != null ? $scope.wallet.getAddressString() : globalFuncs.donateAddress,
            value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei($scope.tx.value, $scope.tx.unit))),
            data: ethFuncs.sanitizeHex($scope.tx.data),
        }
        if ($scope.tx.to !== '') estObj.to = $scope.tx.to
        ethFuncs.estimateGas(estObj, function (data) {
            if (!data.error) $scope.tx.gasLimit = data.data
        })
    }

    var isEnough = function (valA, valB) {
        return new BigNumber(valA).lte(new BigNumber(valB))
    }

    $scope.hasEnoughBalance = function () {
        if ($scope.wallet.balance === 'loading') return true
        if ($scope.tx.value === '') return true
        return isEnough($scope.tx.value, $scope.wallet.balance)
    }

    $scope.generateTx = function () {
        if (!$scope.Validator.isValidAddress($scope.validator.address)) {
            $scope.notifier.danger(globalFuncs.errorMsgs[5])
            return
        }
        var txData = uiFuncs.getTxData($scope)
        txData.gasPrice = $scope.tx.gasPrice ? '0x' + new BigNumber($scope.tx.gasPrice).toString(16) : null
        txData.nonce = $scope.tx.nonce ? '0x' + new BigNumber($scope.tx.nonce).toString(16) : null
        console.log(txData)

        // set to true for offline tab and txstatus tab
        // on sendtx tab, it pulls gas price from the gasprice slider & nonce
        // if its true the whole txData object is set - don't try to change it
        // if false, replace gas price and nonce. gas price from slider. nonce from server.
        if (txData.gasPrice && txData.nonce) txData.isOffline = true

        uiFuncs.generateTx(txData, function (rawTx) {
            if (!rawTx.isError) {
                $scope.rawTx = rawTx.rawTx
                $scope.signedTx = rawTx.signedTx
                $rootScope.rootScopeShowRawTx = true
            } else {
                $rootScope.rootScopeShowRawTx = false
                $scope.notifier.danger(rawTx.error)
            }
            if (!$scope.$$phase) $scope.$apply()
        })
    }

    $scope.sendTx = function () {
        if ($scope.visibility === 'stakingView') {
            $scope.sendTxModal.close()
            ga('send', {
                hitType: 'event',
                eventCategory: 'Transactions',
                eventAction: 'Delegate',
            })
        } else {
            $scope.withdrawTxModal.close()
            ga('send', {
                hitType: 'event',
                eventCategory: 'Transactions',
                eventAction: 'Undelegate',
            })
        }
        uiFuncs.sendTx($scope.signedTx, function (resp) {
            if (!resp.isError) {
                var checkTxLink = 'https://mywanwallet.com?txHash=' + resp.data + '#check-tx-status'
                var txHashLink = $scope.ajaxReq.blockExplorerTX.replace('[[txHash]]', resp.data)
                // var emailBody = 'I%20was%20trying%20to..............%0A%0A%0A%0ABut%20I%27m%20confused%20because...............%0A%0A%0A%0A%0A%0ATo%20Address%3A%20https%3A%2F%2Fwanscan.org%2Faddress%2F' + $scope.tx.to + '%0AFrom%20Address%3A%20https%3A%2F%2Fwanscan.org%2Faddress%2F' + $scope.wallet.getAddressString() + '%0ATX%20Hash%3A%20https%3A%2F%2Fwanscan.org%2Ftx%2F' + resp.data + '%0AAmount%3A%20' + $scope.tx.value + '%20' + $scope.unitReadable + '%0ANode%3A%20' + $scope.ajaxReq.type + '%0AToken%20To%20Addr%3A%20' + $scope.tokenTx.to + '%0AToken%20Amount%3A%20' + $scope.tokenTx.value + '%20' + $scope.unitReadable + '%0AData%3A%20' + $scope.tx.data + '%0AGas%20Limit%3A%20' + $scope.tx.gasLimit + '%0AGas%20Price%3A%20' + $scope.tx.gasPrice
                var verifyTxBtn = $scope.ajaxReq.type !== nodes.nodeTypes.Custom ? '<a class="btn btn-xs btn-info" href="' + txHashLink + '" class="strong" target="_blank" rel="noopener noreferrer">Verify Transaction</a>' : ''
                var checkTxBtn = '<a class="btn btn-xs btn-info" href="' + checkTxLink + '" target="_blank" rel="noopener noreferrer"> Check TX Status </a>'
                // var emailBtn = '<a class="btn btn-xs btn-info " href="mailto:support@mywanwallet.com?Subject=Issue%20regarding%20my%20TX%20&Body=' + emailBody + '" target="_blank" rel="noopener noreferrer">Confused? Email Us.</a>'
                var completeMsg = '<p>' + globalFuncs.successMsgs[2] + '<strong>' + resp.data + '</strong></p><p>' + verifyTxBtn + ' ' + checkTxBtn + '</p>'
                $scope.notifier.success(completeMsg, 0)
                $scope.wallet.setBalance(applyScope)
                if ($scope.tx.sendMode === 'token') $scope.wallet.tokenObjs[$scope.tokenTx.id].setBalance()
            } else {
                $scope.notifier.danger(resp.error)
            }
        })
    }

    $scope.transferAllBalance = function () {
        if ($scope.tx.sendMode !== 'token') {
            uiFuncs.transferAllBalance($scope.wallet.getAddressString(), $scope.tx.gasLimit, function (resp) {
                if (!resp.isError) {
                    $scope.tx.unit = resp.unit
                    $scope.tx.value = resp.value
                } else {
                    $rootScope.rootScopeShowRawTx = false
                    $scope.notifier.danger(resp.error)
                }
            })
        } else {
            $scope.tx.value = $scope.wallet.tokenObjs[$scope.tokenTx.id].getBalance()
        }
    }

    $scope.parseSignedTx = function (signedTx) {
      if (signedTx.slice(0, 2) === '0x') signedTx = signedTx.slice(2, signedTx.length)
      $scope.parsedSignedTx = {}
      var txData = new ethUtil.Tx(signedTx)
      // For HW Wallets and the likes where we don't have a signed tx yet to check, and gasLimit is called gas?!
      if (txData.Txtype.length === 0) {
          txData = JSON.parse($scope.signedTx)
          $scope.parsedSignedTx.gasLimit = new BigNumber(ethFuncs.sanitizeHex(txData.gas.toString('hex'))).toString()
      } else {
          $scope.parsedSignedTx.gasLimit = new BigNumber(ethFuncs.sanitizeHex(txData.gasLimit.toString('hex'))).toString()
      }
      $scope.parsedSignedTx.gasPrice = {}
      $scope.parsedSignedTx.txFee = {}
      $scope.parsedSignedTx.balance = $scope.wallet.getBalance()
      $scope.parsedSignedTx.txtype = txData.Txtype.toString('hex')
      $scope.parsedSignedTx.from = ethFuncs.sanitizeHex(ethUtil.toChecksumAddress(txData.from.toString('hex')))
      $scope.parsedSignedTx.to = ethFuncs.sanitizeHex(ethUtil.toChecksumAddress(txData.to.toString('hex')))
      $scope.parsedSignedTx.value = (txData.value === '0x' || txData.value === '' || txData.value == null) ? '0' : etherUnits.toEther(new BigNumber(ethFuncs.sanitizeHex(txData.value.toString('hex'))).toString(), 'wei')
      $scope.parsedSignedTx.gasPrice.wei = new BigNumber(ethFuncs.sanitizeHex(txData.gasPrice.toString('hex'))).toString()
      $scope.parsedSignedTx.gasPrice.gwei = new BigNumber(ethFuncs.sanitizeHex(txData.gasPrice.toString('hex'))).div(etherUnits.getValueOfUnit('gwei')).toString()
      $scope.parsedSignedTx.gasPrice.eth = etherUnits.toEther(new BigNumber(ethFuncs.sanitizeHex(txData.gasPrice.toString('hex'))).toString(), 'wei')
      $scope.parsedSignedTx.txFee.wei = new BigNumber(parseInt($scope.parsedSignedTx.gasLimit)).times(new BigNumber(parseInt($scope.parsedSignedTx.gasPrice.wei)))
      $scope.parsedSignedTx.txFee.gwei = new BigNumber($scope.parsedSignedTx.txFee.wei).div(etherUnits.getValueOfUnit('gwei')).toString()
      $scope.parsedSignedTx.txFee.eth = etherUnits.toEther(parseInt($scope.parsedSignedTx.txFee.wei), 'wei').toString()
      $scope.parsedSignedTx.nonce = (txData.nonce === '0x' || txData.nonce === '' || txData.nonce == null || txData.nonce.toString('hex') === '') ? '0' : new BigNumber(ethFuncs.sanitizeHex(txData.nonce.toString('hex'))).toString()
      $scope.parsedSignedTx.data = (txData.data === '0x' || txData.data === '' || txData.data == null) ? '(none)' : ethFuncs.sanitizeHex(txData.data.toString('hex'))


    }
}
module.exports = stakingCtrl
