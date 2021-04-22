var assert = require('assert')
var sinon = require('sinon')

var path = require('path')
var ethFuncs = require(path.join(__dirname, '..', '..', '..', 'app', 'scripts', 'ethFuncs.js'))

describe('util', function () {
    beforeEach(function () {
        this.sinon = sinon.createSandbox()
    })

    afterEach(function () {
        this.sinon.restore()
    })

    describe('#isChecksumAddress', function () {
        it('should validate correct address', function () {
            const input = '0x121a7a62365235Ba60c8074f3105604F7dD61aB0'
            const output = ethFuncs.isChecksumAddress(input)
            assert.deepStrictEqual(output, true)
        })
        it('should not validate correct address', function () {
            const input = '0x121a7a62365235Ba60c8074f3105604F7dD61ab0'
            const output = ethFuncs.isChecksumAddress(input)
            assert.deepStrictEqual(output, false)
        })
    })
})
