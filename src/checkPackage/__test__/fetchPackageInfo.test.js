/**
 * @jest-environment node
 */

const provider = require('../fetchPackageInfo')

describe('Package data provider', () => {
  it('should fetch package info from DHL', async () => {
    const actual = await provider.fetchPackageInfo('4317584051', 'dhl')
    expect(actual).toBeDefined()
    expect(actual.delivered).toBeTruthy()
    expect(actual.packageId).toBe('4317584051')
    expect(actual.lastEventDate).toBe('2019-02-18 11:27')
  })

  it('should fetch package info from Poczta Polska', async () => {
    const actual = await provider.fetchPackageInfo('00259007738646886331', 'pp')
    expect(actual).toBeDefined()
    expect(actual.packageId).toBe('00259007738646886331')
    expect(actual.delivered).toBeTruthy()
  })
})
