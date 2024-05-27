import { CityType } from './types/city.type.js';

const CitiesListItems = {
  PARIS: 'Paris',
  COLOGNE: 'Cologne',
  BRUSSELS: 'Brussels',
  AMSTERDAM: 'Amsterdam',
  HAMBURG: 'Hamburg',
  DUSSELDORF: 'Dusseldorf'
} as const;

export const CITIES: CityType[] = [
  {
    name: CitiesListItems.PARIS,
    location: {
      latitude: 48.85661,
      longitude: 2.351499
    }
  },
  {
    name: CitiesListItems.COLOGNE,
    location: {
      latitude: 50.938361,
      longitude: 6.959974
    }
  },
  {
    name: CitiesListItems.BRUSSELS,
    location: {
      latitude: 50.846557,
      longitude: 4.351697
    }
  },
  {
    name: CitiesListItems.AMSTERDAM,
    location: {
      latitude: 52.37454,
      longitude: 4.897976
    }
  },
  {
    name: CitiesListItems.HAMBURG,
    location: {
      latitude: 53.550341,
      longitude: 10.000654
    }
  },
  {
    name: CitiesListItems.DUSSELDORF,
    location: {
      latitude: 51.225402,
      longitude: 6.776314
    }
  }
];

export const DEFAULT_USER_PASSWORD = '123456';
export const DEFAULT_USER_AVATAR = 'avatar.jpg';
