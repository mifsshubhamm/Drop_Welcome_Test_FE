
import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'timeAgo',
  standalone: true

})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | string | number): string {
    if (!value) {
      return '';
    }
    
    // Check if the value is a timestamp in seconds and convert to milliseconds
    const date = typeof value === 'number' && value < 1e13 ? new Date(value * 1000) : new Date(value);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return formatDistanceToNow(date, { addSuffix: true });
  }
}