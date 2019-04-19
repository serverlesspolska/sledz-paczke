const provider = require('./fetchPackageInfo')

module.exports.main = async (event, context) => {
  console.log(event)
  const { packageId, company } = event.body
  
  const result = await provider.fetchPackageInfo(packageId, company)
  console.log(JSON.stringify(result));

  return result
}
