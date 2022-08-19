import axios from 'axios'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

/**
 * Lambda Handler - Get Calendar Events
 * 
 * @remarks
 * Get calendar events JSON and pass it on
 * 
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const token = process.env.ADDEVENT_TOKEN
  try {
    const data = JSON.parse(JSON.stringify(event))
    let query = "";
    if (data.calendarId) query = `&calendar_id=${data.calendarId}`
    const url = `https://www.addevent.com/api/v1/oe/events/list/?token=${token}${query}`
    const response = await axios.get(url)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(response.data)
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Error fetching events'})
    }
  }
}
