export type Id = string|number;

export interface Timespan {
  startDate: Date,
  endDate?: Date,
}

export interface Timeline<T extends Timespan> {
  id: Id,
  timespans:T[]
}

