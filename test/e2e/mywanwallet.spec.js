const path = require('path')
const assert = require('assert')
const { By } = require('selenium-webdriver')
const { delay, setupBrowserAndExtension, verboseReportOnFailure } = require('./func')
const ethUtil = require('wanchainjs-util')

const phrase = 'phrase upgrade clock rough situate wedding elder clever doctor stamp excess tent'
const accounts = ['0xe18035bf8712672935fdb4e5e431b1a0183d2dfc',
    '0x2f318c334780961fb129d2a6c30d0763d9a5c970',
    '0x7a46ce51fbbb29c34aea1fe9833c27b5d2781925']
const privkeys = ['0x4cfd3e90fc78b0f86bf7524722150bb8da9c60cd532564d7ff43f5716514f553',
    '0xa75b25c0f3d5970efb7b1a713515dc910f6d92f5e6278de74c5428aeb83cd5dd',
    '0x14abe6f4aab7f9f626fe981c864d0adeb5685f289ac9270c27b8fd790b4235d6']

describe('MyWanWallet', function () {
    const browser = process.env.SELENIUM_BROWSER
    // let driver, accountAddress, tokenAddress, extensionUri
    let driver

    this.timeout(0)

    before(async function () {
        const srcPath = path.resolve(`dist/index.html`)
        const installResult = await setupBrowserAndExtension({ browser })
        driver = installResult.driver
        console.log(srcPath, 'srcPath')
        await driver.get('file:////' + srcPath)
        await delay(500)
    })

    afterEach(async function () {
        // logs command not supported in firefox
        // https://github.com/SeleniumHQ/selenium/issues/2910
        if (browser === 'chrome') {
            // check for console errors
            const errors = await checkBrowserForConsoleErrors()
            if (errors.length) {
                const errorReports = errors.map(err => err.message)
                const errorMessage = `Errors found in browser console:\n${errorReports.join('\n')}`
                console.error(new Error(errorMessage))
            }
        }
        // gather extra data if test failed
        if (this.currentTest.state === 'failed') {
            await verboseReportOnFailure({ browser, driver, title: this.currentTest.title })
        }
    })

    after(async function () {
        await driver.quit()
    })

    describe('Startup', function () {

        it('remove startup alert', async () => {
            await delay(100)
            await clickElement('/html/body/section[1]/div[2]/div/i')
            await delay(300)
        })
    })

    describe('Create JSON Wallet', function () {
        var privkey

        it('Click new wallet button', async () => {
            await clickElement('/html/body/header/nav/div/ul/li[1]/a')
            await delay(500)
        })

        it('Enter invalid password', async () => {
            await enterTextInElement('/html/body/section[1]/div/main/article[1]/section[1]/div[1]/input', '12345678')
            await delay(200)
            await clickElement('/html/body/section[1]/div/main/article[1]/section[1]/a')
            await delay(200)
            await validateValue('/html/body/section[1]/div[2]/div/div/div',
                                '(error_02) Your password must be at least 9 characters. Please ensure it is a strong password.',
                                'Correct error is shown')
            await delay(200)
            // Close error
            await clickElement('/html/body/section[1]/div[2]/div/i')
        })

        it('Creates a new wallet', async () => {
            await enterTextInElement('/html/body/section[1]/div/main/article[1]/section[1]/div[1]/input', 'ééééééééé')
            await delay(200)
            await clickElement('/html/body/section[1]/div/main/article[1]/section[1]/a')
            await delay(500)
            await validateValue('/html/body/section[1]/div/main/article[2]/section[1]/h1/code', 'Keystore', 'Keystore is shown')
            await delay(200)
        })

        it('Downloads a keystore', async () => {
            // Download Keystore
            await clickElement('/html/body/section[1]/div/main/article[2]/section[1]/a/span[2]')
            await delay(200)
        })

        it('Shows the private key', async () => {
            await clickElement('/html/body/section[1]/div/main/article[2]/section[1]/p/a/span')
            await delay(200)
            // Store privkey
            privkey = await driver.findElement(By.xpath('/html/body/section[1]/div/main/article[3]/section[1]/textarea')).getText()
            await delay(200)
            await clickElement('/html/body/section[1]/div/main/article[3]/section[1]/a[2]/span')
            await delay(200)
        })

        it('Unlocks the wallet with the new privkey', async () => {
            // Click Private key
            await clickElement('/html/body/section[1]/div/main/article[4]/div[1]/div[2]/wallet-decrypt-drtv/article/section[1]/label[7]/input')
            await delay(200)
            await enterTextInElement('//*[@id="aria6"]', privkey)
            await delay(200)
            // Shows unlock button
            await clickElement('//*[@id="selectedTypeKey"]/div[4]/a')
            await delay(200)
        })

        it('Shows the wallet unlocked modal', async () => {
            await validateValue('/html/body/section[1]/div[2]/div/div/div', 'Wallet successfully decrypted', 'Wallet unlocked')
            await delay(200)
        })

        it('Shows correct checksummed address for the privkey', async () => {
            await validateValue('/html/body/section[1]/div/main/article[4]/div[2]/article[2]/wallet-balance-drtv/aside/div[1]/ul[1]/span',
                                ethUtil.toChecksumAddress('0x' + ethUtil.privateToAddress('0x' + privkey).toString('hex')),
                                'Private Key matches Address')
            await delay(200)
        })
    })

    describe('Setup Custom node', function () {

        it('Goto Send Menu', async () => {
            await clickElement('/html/body/header/nav/div/ul/li[4]/a')
            await delay(500)
        })

        it('open Provider menu', async () => {
            await clickElement('/html/body/header/section/section/div/span[3]/a')
            await delay(500)
        })

        it('Click add custom node button', async function () {
            await clickElement('/html/body/header/section/section/div/span[3]/ul/li[3]/a')
            await delay(500)
        })

        it('Add custom node', async function () {
            await enterTextInElement('//*[@id="customNodeModal"]/section/section/div[1]/section/div[1]/input', 'local')
            await enterTextInElement('//*[@id="customNodeModal"]/section/section/div[1]/section/div[2]/input', 'http://localhost')
            await enterTextInElement('//*[@id="customNodeModal"]/section/section/div[1]/section/div[3]/input', '8545')
            await delay(200)
            await clickElement('//*[@id="customNodeModal"]/section/section/div[1]/section/div[7]/label[1]/input')
            await delay(200)
            await clickElement('//*[@id="customNodeModal"]/section/section/div[1]/section/div[7]/label[4]/input')
            await delay(200)
            await enterTextInElement('//*[@id="customNodeModal"]/section/section/div[1]/section/div[8]/input', '1')
            await delay(200)
            await clickElement('//*[@id="customNodeModal"]/section/section/div[2]/button[2]')
            await delay(500)
            await clickElement('/html/body/section[1]/div[2]/div/i')
            await delay(500)
        })
    })

    describe('Test sending coins', () => {

        describe('Use Mnemonic to send coins', () => {

            it('Click send Wancoins', async () => {
                await clickElement('/html/body/header/nav/div/ul/li[4]/a')
                await delay(500)
            })

            it('Check the page title', async () => {
                const title = await driver.getTitle()
                assert.strictEqual(title, 'MyWanWallet.com', 'title matches WanMask')
                await delay(500)
            })

            it('Enter mnemonic phrase', async () => {
                await clickElement('/html/body/section[1]/div/main/article[1]/div[2]/wallet-decrypt-drtv/article/section[1]/label[6]/input')
                await delay(500)
                await validateValue('//*[@id="selectedTypeMnemonic"]/h4', 'Paste Your Mnemonic', 'show mnemonic field')
                await enterTextInElement('//*[@id="aria4"]', phrase)
                await delay(500)
                await clickElement('//*[@id="selectedTypeMnemonic"]/div[5]/a')
                await delay(500)
            })

            it('Use Trezor derivation path', async () => {
                await clickElement('//*[@id="mnemonicModel"]/section/section/div/section[2]/div[1]/label/input')
                await delay(1000)
            })

            it('Select first account', async () => {
                await clickElement('//*[@id="mnemonicModel"]/section/section/div/table/tbody/tr[2]/td[1]/label/input')
                await delay(1000)
            })

            it('Check balance of first address', async () => {
                await validateValue('//*[@id="mnemonicModel"]/section/section/div/table/tbody/tr[2]/td[2]/a', '100 WAN', 'Balance is 100 WAN')
            })

            it('Unlock first address', async () => {
                await clickElement('//*[@id="mnemonicModel"]/section/section/div/div/button[1]')
                await delay(500)
            })

            it('Send 50 wan to second address', async () => {
                // send 50 to accounts[1]
                await enterTextInElement('/html/body/section[1]/div/main/article[2]/div/article[2]/div[1]/address-field/div[1]/input', accounts[1], true)
                await delay(500)
                await enterTextInElement('/html/body/section[1]/div/main/article[2]/div/article[2]/section[1]/div[2]/div/input', '50', true)
                await delay(500)
                await enterTextInElement('/html/body/section[1]/div/main/article[2]/div/article[2]/section[2]/div/input', '21484', true)
                await delay(500)
                await clickElement('/html/body/section[1]/div/main/article[2]/div/article[2]/div[4]/div/a')
                await delay(500)
                await validateValueTextArea('/html/body/section[1]/div/main/article[2]/div/article[2]/div[5]/div[1]/textarea', '{"Txtype":"0x01","nonce":"0x00","gasPrice":"0x098bca5a00","gas":"0x53ec","to":"0x2f318c334780961fb129d2a6c30d0763d9a5c970","value":"0x02b5e3af16b1880000","data":"","chainId":1}')
                await delay(500)
                await clickElement('/html/body/section[1]/div/main/article[2]/div/article[2]/div[6]/a')
                await delay(500)
                await clickElement('//*[@id="sendTransaction"]/section/section/div[2]/button[2]')
                await delay(500)

            })
        })

        describe('Use Privkey to send coins', () => {

            it('Reopen the account selection screen', async () => {
                await clickElement('/html/body/section[1]/div/main/article[1]/div[1]/a/span[1]')
                await delay(500)
            })

            it('Enter private key', async () => {
                await clickElement('/html/body/section[1]/div/main/article[1]/div[2]/wallet-decrypt-drtv/article/section[1]/label[7]/input')
                await delay(500)
                await validateValue('//*[@id="selectedTypeKey"]/h4', 'Paste Your Private Key', 'show private key field')
                await enterTextInElement('//*[@id="aria6"]', privkeys[1])
                await delay(500)
                await clickElement('//*[@id="selectedTypeKey"]/div[4]/a')
                await delay(300)
            })

            it('Check balance of address', async () => {
                await validateValue('/html/body/section[1]/div/main/article[2]/section/wallet-balance-drtv/aside/div[1]/ul[2]/li/span', '150', 'Balance is 150 WAN')
            })

            it('Send 50 wan to third address', async () => {
                // send 50 to 0x7a46ce51fbbb29c34aea1fe9833c27b5d2781925
                await enterTextInElement('/html/body/section[1]/div/main/article[2]/div/article[2]/div[1]/address-field/div[1]/input', accounts[2], true)
                await delay(500)
                await enterTextInElement('/html/body/section[1]/div/main/article[2]/div/article[2]/section[1]/div[2]/div/input', '50', true)
                await delay(500)
                await enterTextInElement('/html/body/section[1]/div/main/article[2]/div/article[2]/section[2]/div/input', '21484', true)
                await delay(500)
                await clickElement('/html/body/section[1]/div/main/article[2]/div/article[2]/div[4]/div/a')
                await delay(500)
                await validateValueTextArea('/html/body/section[1]/div/main/article[2]/div/article[2]/div[5]/div[1]/textarea', '{"Txtype":"0x01","nonce":"0x00","gasPrice":"0x098bca5a00","gas":"0x53ec","to":"0x7a46ce51fbbb29c34aea1fe9833c27b5d2781925","value":"0x02b5e3af16b1880000","data":"","chainId":1}')
                await delay(500)
                await clickElement('/html/body/section[1]/div/main/article[2]/div/article[2]/div[6]/a')
                await delay(500)
                await clickElement('//*[@id="sendTransaction"]/section/section/div[2]/button[2]')
                await delay(500)
            })
        })
    })

    describe('Test staking', () => {
        describe('Goto Testnet', function () {
            it('Goto Staking Menu', async () => {
                await clickElement('/html/body/header/nav/div/ul/li[3]/a')
                await delay(500)
            })

            it('Open Provider menu', async () => {
                await clickElement('/html/body/header/section/section/div/span[3]/a')
                await delay(500)
            })

            it('Click testnet', async () => {
                await clickElement('/html/body/header/section/section/div/span[3]/ul/li[2]/a')
                await delay(1500)
                await clickElement('/html/body/section[1]/div[2]/div/i')
                await delay(500)
            })

            it('Refresh page', async () => {
                // Refresh page for staking
                await driver.executeScript('location.reload()')
                await delay(500)
            })
        })

        describe('Test staking', function () {
            it('Unlock with mnemnonic', async () => {
                await clickElement('/html/body/section[1]/div/main/article[1]/div[2]/wallet-decrypt-drtv/article/section[1]/label[6]/input')
                await delay(200)
                await enterTextInElement('//*[@id="aria4"]', phrase)
                await delay(200)
                await clickElement('//*[@id="selectedTypeMnemonic"]/div[5]/a')
                await delay(200)
                // Select Trezor (WAN)
                await clickElement('//*[@id="mnemonicModel"]/section/section/div/section[1]/div[1]/label/input')
                await delay(200)
                // Select first address
                await clickElement('//*[@id="mnemonicModel"]/section/section/div/table/tbody/tr[2]/td[1]/label/input')
                await delay(200)
                // Click Unlock
                await clickElement('//*[@id="mnemonicModel"]/section/section/div/div/button[1]')
                await delay(1000)
                await validateValue('/html/body/section[1]/div/main/article[2]/section/wallet-balance-drtv/aside/div[1]/ul[2]/li/span', '0', 'Balance is 0 WAN')
                await validateValue('/html/body/section[1]/div/main/article[2]/section/wallet-balance-drtv/aside/div[1]/ul[1]/span', '0xf21310938ccfCA0aDBBDd370ad0f7B34AE26fD19', 'Address is 0xe18035bf8712672935fdb4E5E431B1A0183D2dfc')
            })

            it('Restart with privkey', async () => {
                // Click + sign
                await clickElement('/html/body/section[1]/div/main/article[1]/div[1]/a/span[1]')
                await delay(200)
                await clickElement('/html/body/section[1]/div/main/article[1]/div[2]/wallet-decrypt-drtv/article/section[1]/label[7]/input')
                await delay(200)
                await enterTextInElement('//*[@id="aria6"]', privkeys[0])
                await delay(200)
                await clickElement('//*[@id="selectedTypeKey"]/div[4]/a')
                await delay(500)
                await validateValue('/html/body/section[1]/div/main/article[2]/section/wallet-balance-drtv/aside/div[1]/ul[2]/li/span', '0', 'Balance is 0 WAN')
                await validateValue('/html/body/section[1]/div/main/article[2]/section/wallet-balance-drtv/aside/div[1]/ul[1]/span', '0xe18035bf8712672935fdb4E5E431B1A0183D2dfc', 'Address is 0xe18035bf8712672935fdb4E5E431B1A0183D2dfc')
            })

            // it('Enter amount < 100 for invalid tx and balance error', async () => {
            //     // Enter 5 and check for error and -1
            //     await delay(1000)
            //     await enterTextInElement('/html/body/section[1]/div/main/article[2]/div/article/section[3]/div/input', 100, true)
            //     await delay(1000)
            //     await validateValueInput('/html/body/section[1]/div/main/article[2]/div/article/section[4]/div/input', '22680', 'Valid so 22680')
            // })

            it('Enter amount < 100 for invalid tx and balance error', async () => {
                // Enter 5 and check for error and -1
                await enterTextInElement('/html/body/section[1]/div/main/article[2]/div/article/section[3]/div/input', 5, true)
                await delay(1000)
                await validateValueInput('/html/body/section[1]/div/main/article[2]/div/article/section[4]/div/input', '-1', 'Invalid so -1')
                await validateValue('/html/body/section[1]/div/main/article[2]/section/div[1]/h5', 'Warning! You do not have enough funds to stake this much.', 'Shows warning')
            })
        })
    })

    describe('Test signing message', () => {

    })
    describe('Test WNS on testnet message', () => {

    })
    describe('Test view wallet info', () => {

    })
    describe('Test Contracts on testnet message', () => {

    })
    describe('Test offline tx', () => {
        /*
        it('generates the right data', async () => {
            await clickElement('/html/body/header/nav/div/ul/li[6]/a')
            await delay(500)
            await enterTextInElement('/html/body/section[1]/div/main/article[1]/section[1]/input', accounts[2], true)
            await delay(500)
            await clickElement('/html/body/section[1]/div/main/article[1]/section[3]/a')
            await delay(500)
            await validateValue('/html/body/section[1]/div/main/article[1]/section[4]/div[1]/input', '182000000000')
            await validateValue('/html/body/section[1]/div/main/article[1]/section[4]/div[2]/input', '0')
            await delay(500)

        })
        */
    })

    async function clickElement (xpath) {
        const element = await driver.findElement(By.xpath(xpath))
        await driver.executeScript('arguments[0].scrollIntoView(true)', element)
        await delay(200)
        element.click()
    }

    async function enterTextInElement (xpath, text, clear = false) {
        const element = await driver.findElement(By.xpath(xpath))
        await driver.executeScript('arguments[0].scrollIntoView(true)', element)
        await delay(200)
        if (clear) element.clear()
        await delay(200)
        element.sendKeys(text)
    }

    async function validateValue (xpath, text, assertText) {
        const element = await driver.findElement(By.xpath(xpath))
        await driver.executeScript('arguments[0].scrollIntoView(true)', element)
        const value = await element.getText()
        // console.error('value', value)
        assert.strictEqual(value, text, assertText)
    }

    async function validateValueTextArea (xpath, text, assertText) {
        const element = await driver.findElement(By.xpath(xpath))
        await driver.executeScript('arguments[0].scrollIntoView(true)', element)
        await delay(200)
        const value = await element.getAttribute('textContent')
        assert.strictEqual(value, text, assertText)
    }

    async function validateValueInput (xpath, text, assertText) {
        const element = await driver.findElement(By.xpath(xpath))
        await driver.executeScript('arguments[0].scrollIntoView(true)', element)
        await delay(200)
        const value = await element.getAttribute('value')
        assert.strictEqual(value, text, assertText)
    }

    async function checkBrowserForConsoleErrors () {
        const ignoredLogTypes = ['WARNING']
        const ignoredErrorMessages = [
            // React throws error warnings on "dataset", but still sets the data-* properties correctly
            'Warning: Unknown prop `dataset` on ',
            // Third-party Favicon 404s show up as errors
            'favicon.ico - Failed to load resource: the server responded with a status of 404 (Not Found)',
            // React Development build - known issue blocked by test build sys
            'Warning: It looks like you\'re using a minified copy of the development build of React.',
            // Redux Development build - known issue blocked by test build sys
            'This means that you are running a slower development build of Redux.',
        ]
        const browserLogs = await driver.manage().logs().get('browser')
        const errorEntries = browserLogs.filter(entry => !ignoredLogTypes.includes(entry.level.toString()))
        const errorObjects = errorEntries.map(entry => entry.toJSON())
        // ignore all errors that contain a message in `ignoredErrorMessages`
        const matchedErrorObjects = errorObjects.filter(entry => !ignoredErrorMessages.some(message => entry.message.includes(message)))
        return matchedErrorObjects
    }

})
