// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk')

const sns = new AWS.SNS()

module.exports.main = async (event) => {
  console.log('send SMS function')
  console.log(JSON.stringify(event))

  if (event.Records[0].eventName === 'MODIFY') { // other events: INSERT, REMOVE
    try {
      await sendSms(event)
    } catch (error) {
      console.log(error.message)
    }
  } else {
    console.log('Nothing to do.')
  }
}

const sendSms = async (event) => {
  const packageId = event.Records[0].dynamodb.Keys.packageId.S
  const message = event.Records[0].dynamodb.NewImage.message.S

  const msg = `Paczka o numerze ${packageId} zmieniła status na: ${message}`
  const params = {
    Message: msg,
    MessageStructure: 'string',
    PhoneNumber: process.env.phoneNumber,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: 'SledzPaczke'
      }
    }
  }
  console.log('sending...')
  await sns.publish(params).promise()
    .then((data) => {
      console.log(`SMS sent. RequestId=${data.ResponseMetadata.RequestId}`)
    })
    .catch(err => console.log(err))
}
