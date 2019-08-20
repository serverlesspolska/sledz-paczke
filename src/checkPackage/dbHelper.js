// eslint-disable-next-line import/no-extraneous-dependencies
const DynamoDB = require('aws-sdk/clients/dynamodb')

module.exports.update = async (packageId, lastEventDate, message, delivered) => {
  const dynamodb = new DynamoDB.DocumentClient()
  const params = {
    TableName: process.env.dynamoTableName,
    Key: { packageId },
    UpdateExpression: 'set lastEventDate = :d, message = :m, delivered = :k',
    ExpressionAttributeValues: {
      ':d': lastEventDate,
      ':m': message,
      ':k': delivered
    }
  }

  return dynamodb.update(params).promise()
    .then(console.log(`Package ${packageId} updated on ${lastEventDate} with ${message} message`))
}
