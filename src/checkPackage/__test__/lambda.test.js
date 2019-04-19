/**
 * @jest-environment node
 */

const LambdaTester = require('lambda-tester');
const lambda = require('../lambda').main

describe('Tech checkPackage Lambda function', () => {
  it('should should fetch package info from Poczta Polska', () => {
    const event = { body: { packageId: '00259007738646886331', company: 'pp' } }
    return LambdaTester(lambda)
      .event(event)
      .expectResolve((actual) => {
        expect(actual.delivered).toBeTruthy()
        expect(actual.packageId).toBe('00259007738646886331')
        expect(actual.delivered).toBeTruthy()
      })
  })

  it('should should fetch package info from DHL', () => {
    const event = { body: { packageId: '4317584051', company: 'dhl' } }
    return LambdaTester(lambda)
      .event(event)
      .expectResolve((actual) => {
        expect(actual.delivered).toBeTruthy()
        expect(actual.packageId).toBe('4317584051')
        expect(actual.lastEventDate).toBe('2019-02-18 11:27')
      })
  })
})
