const enum NameLength {
  Min = 10,
  Max = 100
}

const enum DescriptionLength {
  Min = 20,
  Max = 1024
}

const enum Price {
  Min = 100,
  Max = 100000
}

const enum WeekDay {
  First = 1,
  Last = 7
}

const enum Index {
  First = 1,
  Last = 100
}

const enum Rating {
  Min = 1,
  Max = 5,
  Initial = 0
}

const enum RoomsCount {
  Min = 1,
  Max = 8
}

const enum AdultsCount {
  Min = 1,
  Max = 10
}


const enum CommentsLength {
  Min = 5,
  Max = 1024
}

const enum LocationShift {
  Start = -10000,
  End = 10000,
  Div = 100000
}

const INITIAL_COMMENTS_COUNT = '0';
const INITIAL_IS_FAVORITE = false;
const NUMBER_OF_PHOTOS = 6;

export {
  AdultsCount, CommentsLength, DescriptionLength, Index,
  INITIAL_COMMENTS_COUNT, INITIAL_IS_FAVORITE, LocationShift,
  NameLength, NUMBER_OF_PHOTOS, Price, Rating,
  RoomsCount, WeekDay};
