// eslint-disable-next-line import/no-extraneous-dependencies
const DynamoDB = require('aws-sdk/clients/dynamodb')

module.exports.update = async (packageId, lastEventDate, message) => {
  const dynamodb = new DynamoDB.DocumentClient()
  const params = {
    TableName: process.env.dynamoTableName,
    Key: { packageId },
    // TODO add delivered status
    UpdateExpression: 'set lastEventDate = :d, message = :m',
    ExpressionAttributeValues: {
      ':d': lastEventDate,
      ':m': message
    }
  }
  return dynamodb.update(params).promise()
    .then(console.log(`Package ${packageId} updated on ${lastEventDate} with ${message} message`))
}
