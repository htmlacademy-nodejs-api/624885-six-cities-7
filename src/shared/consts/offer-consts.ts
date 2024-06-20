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

const RatingDecimalNumbersCount = 1;

const NUMBER_OF_PHOTOS = 6;

const enum Rating {
  Min = 1,
  Max = 5
}

const enum RoomsCount {
  Min = 1,
  Max = 8
}

const enum AdultsCount {
  Min = 1,
  Max = 10
}

const enum CommentsCount {
  Min = 0,
  Max = 100
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

export {
  AdultsCount, CommentsCount, CommentsLength, DescriptionLength, Index, LocationShift,
  NameLength, NUMBER_OF_PHOTOS, Price, Rating, RatingDecimalNumbersCount,
  RoomsCount, WeekDay};
