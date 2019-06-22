/**
 * @jest-environment node
 */

const LambdaTester = require('lambda-tester');
const mockAxios = require('axios');

const lambda = require('../lambda').main
const ppResponse = require('../../__fixtures__/responsePp')
const dhlResponse = require('../../__fixtures__/responseDhl')

describe('Tech checkPackage Lambda function', () => {
  it('should should fetch package info from Poczta Polska', () => {
    // axios mock setup
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({
      data: ppResponse
    }))

    const eventFromSns = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify({ packageId: '00259007738703874264', company: 'pp', lastEventDate: '2019-05-29T17:58:00.000Z' })
          }
        }
      ]
    }
    return LambdaTester(lambda)
      .event(eventFromSns)
      .expectResolve((actual) => {
        expect(actual.packageId).toBe('00259007738703874264')
        expect(actual.delivered).toBeTruthy()
      })
  })
  it('should should fetch package info from DHL', () => {
    // axios mock setup
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({
      data: dhlResponse
    }))

    const eventFromSns = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify({ packageId: '4317584051', company: 'dhl', lastEventDate: '2019-02-18T11:18:00.000Z' })
          }
        }
      ]
    }
    return LambdaTester(lambda)
      .event(eventFromSns)
      .expectResolve((actual) => {
        expect(actual.packageId).toBe('4317584051')
        expect(actual.delivered).toBeTruthy()
      })
  })
})
