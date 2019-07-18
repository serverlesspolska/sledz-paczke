/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
const SNS = require('aws-sdk/clients/sns')
const DynamoDB = require('aws-sdk/clients/dynamodb')

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
  const dynamodb = new DynamoDB.DocumentClient()
  const params = {
    TableName: process.env.dynamoTableName
  }
  return dynamodb.scan(params).promise().then((result) => {
    console.log(`Fetched ${result.Items.length} item(s) from database`);
    return result.Items
  }).catch((error) => {
    console.error(error)
    throw new Error(error.message)
  })
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
