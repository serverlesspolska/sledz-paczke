const provider = require('./fetchPackageInfo')
const dbHelper = require('./dbHelper')

module.exports.main = async (event) => {
  const { Message } = event.Records[0].Sns
  console.log('Active package parameters', Message)
  const { packageId, company, lastEventDate } = JSON.parse(Message)
  console.log(packageId, company, lastEventDate)

  const currentPackageState = await provider.fetchPackageInfo(packageId, company)
  const currentLastEventDate = currentPackageState.lastEventDate
  const currentLastEventDateAsString = dateToString(currentLastEventDate)
  const lastEventDateAsString = dateToString(lastEventDate)

  console.log(`Current last date is ${currentLastEventDateAsString}, in DB last date is ${lastEventDateAsString}`)

  const newEventOccurred = dateToMilisec(currentLastEventDate) - dateToMilisec(lastEventDate) > 0

  if (newEventOccurred) {
    console.log(`Something new happened to the package ${packageId}`)
    const [lastEvent] = currentPackageState.events.slice(-1)
    const lastMessage = `${lastEvent.name} [${lastEvent.location}]`

    await dbHelper.update(packageId, currentLastEventDate, lastMessage)
  } else {
    console.log(`No updates about the package ${packageId} from ${company}`);
  }
  return currentPackageState
}

const dateToMilisec = isoDate => (isoDate ? (new Date(isoDate)).getTime() : 0)

const dateFormat = {
  year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
}

const dateToString = isoDate => (isoDate ? new Date(isoDate).toLocaleDateString('pl-PL', dateFormat) : '')
