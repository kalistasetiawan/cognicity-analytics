import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as topojson from 'topojson-client';

@Injectable()
export class SliderService {

  constructor(private http: HttpClient) { }

  getFloodAreas(city) {
    const endpoint = environment.data_server + 'floods?city=' + city;

    return new Promise((resolve, reject) => {
      this.http
      .get(endpoint)
      .subscribe(response => {
        if (response['statusCode'] === 200) {
          const topojsonData = response['result'];
          if (topojsonData && topojsonData.objects) {
            const geojsonData = topojson.feature(topojsonData, topojsonData.objects.output);
            resolve(geojsonData);
          }
        } else {
          reject(response);
        }
      });
    });
  }

  // Get date in YYYY-MM-DD format
  // Return start & end dates, 7 days apart
  // in ISO 8601 format string
  formatTimePeriod(selectedDate) {
    // Store as [YYYY, MM, DD]
    const dateValues = selectedDate.split('-', 3);

    // Generate number in milliseconds since 1 Jan 1970 00:00:00 UTC
    const dateMilliseconds = Date.parse((new Date(
      dateValues[0],
      parseInt(dateValues[1], 10) - 1, // Count months from 0
      dateValues[2],
    )).toString());

    // Start and end dateTime in milliseconds, 7 days apart
    const startMilliseconds = dateMilliseconds - (3 * 24 * 60 * 60 * 1000);
    const endMilliseconds = dateMilliseconds + (4 * 24 * 60 * 60 * 1000) - 1;

    // Generate ISO 8601 strings,
    // after generating UTC string to add time zone
    const startDatetime = (new Date(
      (new Date(startMilliseconds)).toUTCString()
    )).toISOString().replace('.', '%2B');
    const endDatetime = (new Date(
      (new Date(endMilliseconds)).toUTCString()
    )).toISOString().replace('.', '%2B');

    return {
      start: startDatetime.replace('Z', '0'),
      end: endDatetime.replace('Z', '0')
    };
  }

  getReportsArchive(selectedDate) {
    const endpoint = environment.data_server + 'reports/archive?start='
      + this.formatTimePeriod(selectedDate).start + '&end='
      + this.formatTimePeriod(selectedDate).end;

    return new Promise((resolve, reject) => {
      this.http
      .get(endpoint)
      .subscribe(response => {
        if (response['statusCode'] === 200) {
          const topojsonData = response['result'];
          if (topojsonData && topojsonData.objects) {
            const geojsonData = topojson.feature(topojsonData, topojsonData.objects.output);
            resolve(geojsonData);
          }
        } else {
          reject(response);
        }
      });
    });
  }

  getFloodAreasArchive(selectedDate) {
    const endpoint = environment.data_server + 'floods/archive?start='
      + this.formatTimePeriod(selectedDate).start + '&end='
      + this.formatTimePeriod(selectedDate).end;

    return new Promise((resolve, reject) => {
      this.http
      .get(endpoint)
      .subscribe(response => {
        if (response['statusCode'] === 200) {
          console.log('Resolving flood data');
          resolve(response['result']);
        } else {
          reject(response);
        }
      });
    });
  }
}