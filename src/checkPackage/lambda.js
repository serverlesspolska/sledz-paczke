const provider = require('./fetchPackageInfo')

module.exports.main = async (event) => {
  const { Message } = event.Records[0].Sns
  console.log('Active package parameters', Message)
  const { packageId, company, lastEventDate } = JSON.parse(Message)
  // console.log(packageId, company, lastEventDate)

  const result = await provider.fetchPackageInfo(packageId, company)
  console.log(JSON.stringify(result));
  // TODO compare lastEventDate from database with one fetched from website
  return result
}
