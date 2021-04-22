require('chromedriver')
require('geckodriver')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const webdriver = require('selenium-webdriver')

module.exports = {
  delay,
  setupBrowserAndExtension,
  verboseReportOnFailure,
  buildChromeWebDriver,
  buildFirefoxWebdriver,
}

function delay (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function setupBrowserAndExtension ({ browser }) {
  let driver

  if (browser === 'chrome') {
    driver = buildChromeWebDriver()
  } else if (browser === 'firefox') {
    driver = buildFirefoxWebdriver()
    await delay(700)
  } else {
    throw new Error(`Unknown Browser "${browser}"`)
  }

  return { driver }
}

function buildChromeWebDriver () {
  const tmpProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'mm-chrome-profile'))

  return new webdriver.Builder()
    .withCapabilities({
      chromeOptions: {
        args: [
          `user-data-dir=${tmpProfile}`,
        ],
        binary: process.env.SELENIUM_CHROME_BINARY,
      },
    })
    .build()
}

function buildFirefoxWebdriver () {
  return new webdriver.Builder().build()
}

async function verboseReportOnFailure ({ browser, driver, title }) {
  const artifactDir = `./test-artifacts/${browser}/${title}`
  const filepathBase = `${artifactDir}/test-failure`
  await fs.ensureDir(artifactDir)
  const screenshot = await driver.takeScreenshot()
  await fs.writeFile(`${filepathBase}-screenshot.png`, screenshot, { encoding: 'base64' })
  const htmlSource = await driver.getPageSource()
  await fs.writeFile(`${filepathBase}-dom.html`, htmlSource)
}
