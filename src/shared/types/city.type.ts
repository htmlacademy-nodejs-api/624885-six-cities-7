import { LocationType } from './location.type.js';

export type CityType = {
  name: ('Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf');
  location: LocationType;
}
