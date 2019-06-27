// eslint-disable-next-line import/no-unresolved
const SNS = require('aws-sdk/clients/sns')

// eslint-disable-next-line no-unused-vars
module.exports.main = async (event) => {
  console.log('Starting activePackages functions');
  const activePackages = await fetchActivePackagesFromDb()
  await Promise.all(activePackages.map(sendToSns))
  console.log('End of activePackages function');
  return true
}

const fetchActivePackagesFromDb = async () => {
  console.log('Running fetchActivePackagesFromDb');

  // for time being we just return static package info
  const sampleData = [
    {
      packageId: '00259007738703874264',
      company: 'pp',
      lastEventDate: new Date().toISOString()
    }
  ]
  return sampleData
}

const sendToSns = async (vo) => {
  const sns = new SNS()
  const params = {
    Message: JSON.stringify(vo),
    TopicArn: process.env.snsFanoutTopicArn
  };
  console.log(params.Message);

  return sns.publish(params).promise().then(() => {
    console.log(`Sent packageId ${vo.packageId} to SNS`)
  }).catch(err => console.log(err.message))
}
