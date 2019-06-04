/**
 * @jest-environment node
 */

const provider = require('../fetchPackageInfo')

describe('Package data provider', () => {
  // it('should fetch package info from DHL', async () => {
  //   const actual = await provider.fetchPackageInfo('20496627360', 'dhl')
  //   console.log(actual);
    
  //   expect(actual).toBeDefined()
  //   expect(actual.delivered).toBeTruthy()
  //   expect(actual.packageId).toBe('20496627360')
  //   expect(actual.lastEventDate).toBe('2019-02-18 11:27')
  // })

  it('should fetch package info from Poczta Polska', async () => {
    const actual = await provider.fetchPackageInfo('00259007738703874264', 'pp')
    expect(actual).toBeDefined()
    expect(actual.packageId).toBe('00259007738703874264')
    expect(actual.delivered).toBeTruthy()
    expect(actual.lastEventDate).toBe('2019-05-29T15:58:00.000Z')
  })

  it('should parse polish date to ISO String', () => {
    const sourceDate = '2019-05-29 17:58'
    expect(provider.stringToIsoDate(sourceDate)).toBe('2019-05-29T15:58:00.000Z')
  })
})
