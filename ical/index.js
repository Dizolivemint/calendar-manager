/**
 * Welcome to ICAL.js fiddle
 */
fetch('https://pacificcollege.edu/events.ics', { mode: 'no-cors' })
.then(response = response.json())
.then(data => console.log(data))
 var iCalendarData = [
  'BEGIN:VCALENDAR',
  'CALSCALE:GREGORIAN',
  'PRODID:-//Example Inc.//Example Calendar//EN',
  'VERSION:2.0',
  'BEGIN:VEVENT',    
  'DTSTAMP:20080205T191224Z',
  'DTSTART:20081006',
  'SUMMARY:Planning meeting',
  'UID:4088E990AD89CB3DBB484909',
  'END:VEVENT',
  'END:VCALENDAR'
].join("\r\n");


var jcalData = ICAL.parse(iCalendarData);
var vcalendar = new ICAL.Component(jcalData);
var vevent = vcalendar.getFirstSubcomponent('vevent');
var summary = vevent.getFirstPropertyValue('summary');
console.log('Summary: ' + summary);