import axios from 'axios'
import { APIGatewayProxyResult } from 'aws-lambda'

/**
 * Lambda Handler - Get Calendar Events
 * 
 * @remarks
 * Get calendar events JSON and pass it on
 * 
 */
export const handler = async (): Promise<APIGatewayProxyResult> => {
  const token = process.env.ADDEVENT_TOKEN

  const calendarIds = [
    {
      calendarName: 'San Diego',
      calendarId: '1652119848445341'
    },
    {
      calendarName: 'Health and Human Perfomance',
      calendarId: '1652742029448784'
    },
    {
      calendarName: 'Chicago',
      calendarId: '1652119892445343'
    },
    {
      calendarName: 'New York',
      calendarId: '1652119866445342'
    },
    {
      calendarName: 'Cannabis',
      calendarId: '1652742060448785'
    },
    {
      calendarName: 'Online',
      calendarId: '1652118613445325'
    }
  ]

  // Response append for each calendar
  let body = []
  try {
    for (const calendar of calendarIds) {
      const query = `&calendar_id=${calendar.calendarId}`
      const url = `https://www.addevent.com/api/v1/oe/events/list/?token=${token}${query}`
      const response = await axios.get(url)

      if (response.data.events.length > 0) {
        const events = response.data.events

        // Reverse the array of events to show the most recent first
        events.reverse()

        // If date_start_unix is greater than today's date, remove it from the events array
        const today = new Date()
        let eventsAfterToday = events
        for (const event of events) {
          let offset = 0
          if (event.timezone === 'America/Los_Angeles') {
            offset = -8 * 60 * 60 * 1000
          } else if (event.timezone === 'America/New_York') {
            offset = -5 * 60 * 60 * 1000
          } else if (event.timezone === 'America/Chicago') {
            offset = -6 * 60 * 60 * 1000
          }
          const todayUnixUTC = today.getTime() + offset
          const dateStartUnix = new Date(event.date_end_unix).getTime() * 1000
          if (dateStartUnix <= todayUnixUTC) {
            eventsAfterToday = eventsAfterToday.filter(e => e !== event)
          }
        }
        body.push({
          calendarName: calendar.calendarName,
          events: eventsAfterToday
        })
      }
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(body)
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
