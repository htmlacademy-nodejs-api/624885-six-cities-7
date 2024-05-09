import { LocationType } from './index.js';

export type CityType = {
  name: ('Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf');
  location: LocationType;
}
