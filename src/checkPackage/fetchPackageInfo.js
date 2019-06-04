const axios = require('axios');

const DHL = 'https://www.dhl.com.pl/shipmentTracking?countryCode=pl&languageCode=pl&AWB='
const PP = 'http://mobilna.poczta-polska.pl/MobiPost/getpackage?action=getPackageData&search='

const fetchPackageInfo = (packageId, company) => axios
  .get(`${url(company)}${packageId}`)
  .then(body => body.data)
  .then((obj) => {
    switch (company) {
      case 'pp':
        return makeCanonicalFromPocztaPolska(obj)
      case 'dhl':
        return makeCanonicalFromDhl(obj)
      default:
        throw new Error(`Provider ${company} not supported`)
    }
  })
  .catch((e) => {
    console.log(e);
    // throw new Error(e.message)
    console.log('package not available anymore')
    return {}
  });

const url = (company) => {
  switch (company) {
    case 'pp':
      return PP
    case 'dhl':
      return DHL
    default:
      throw new Error(`Provider ${company} not supported`);
  }
}

const stringToIsoDate = string => new Date(Date.parse(string)).toISOString()

const makeCanonicalFromPocztaPolska = (body) => {
  const o = body[0]

  const transformEvent = (e, index) => ({
    index,
    time: stringToIsoDate(e.czasZadrzenia),
    location: e.daneSzczegJednostki,
    name: e.nazwa
  })
  return {
    packageId: o.numer,
    sendDate: o.dataNadania,
    fromLocation: o.jednstkaNadania,
    delivered: o.zdarzenia.filter(e => e.nazwa === 'Doręczenie' || e.nazwa === 'Przesyłka odebrana w punkcie').length > 0,
    lastEventDate: stringToIsoDate(o.zdarzenia.slice(-1).pop().czasZadrzenia),
    events: o.zdarzenia.map(transformEvent)
  }
}

const makeCanonicalFromDhl = (body) => {
  const o = body.results[0]

  const dateFromEvent = (e) => {
    // eslint-disable-next-line no-unused-vars
    const [dayName, monthDay, year] = e.date.split(', ')
    const day = monthDay.replace('styczeń ', '01-').replace('luty ', '02-').replace('marzec ', '03-')
    return `${year.trim()}-${day} ${e.time}`
  }

  const transformEvent = e => ({
    index: e.counter - 1,
    time: dateFromEvent(e),
    location: e.location,
    name: e.description
  })

  const firstEvent = o.checkpoints.filter(e => e.counter === 1)[0]
  const sendDate = dateFromEvent(firstEvent)

  const sortedEvents = o.checkpoints.sort((a, b) => a.counter - b.counter)

  return {
    packageId: o.id,
    sendDate,
    fromLocation: o.origin.value,
    delivered: o.delivery.status === 'delivered',
    lastEventDate: dateFromEvent(sortedEvents.slice(-1).pop()),
    events: sortedEvents.map(transformEvent)
  }
}

module.exports = {
  fetchPackageInfo,
  stringToIsoDate
}
