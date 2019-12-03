import { Id, Timespan, Timeline } from './interfaces';
import { timelinesOverlap, getBounds, monthDiff } from './time';

interface InputTimespan extends Timespan {
  attr?: object,
}

interface OutputTimespan extends Timespan {
  startSegment: number,
  endSegment?: number,
  attr?: object
}

type InputTimeline = Timeline<InputTimespan>;

interface OutputTimeline extends Timeline<OutputTimespan> {
  lane: number
}

interface History {
  timelines: OutputTimeline[],
  startDate: Date,
  endDate: Date,
  segments: number,
}

export default (inputTimelines: InputTimeline[] = []): History => {
  if (!inputTimelines.length) {
    return {
      timelines: [],
      startDate: new Date(),
      endDate: new Date(),
      segments: 0
    }
  }

  const [absStartDate, absEndDate] = getBounds(inputTimelines);
  const absEndSegment = monthDiff(absEndDate, absStartDate);

  const outputTimelines = inputTimelines.reduce((outputTimelines, inputTimeline) => {
    const lane = deriveLane(inputTimeline, outputTimelines);

    const outputTimespans: OutputTimespan[] = inputTimeline.timespans.map(inputTimespan => {
      const startSegment = monthDiff(inputTimespan.startDate, absStartDate);

      const endSegment = inputTimespan.endDate
        ? monthDiff(inputTimespan.endDate, inputTimespan.startDate) + startSegment
        : absEndSegment;

      return { ...inputTimespan, startSegment, endSegment };
    });

    outputTimelines.push({
      id: inputTimeline.id,
      timespans: outputTimespans,
      lane
    });

    return outputTimelines;
  }, [] as OutputTimeline[]);

  return {
    timelines: outputTimelines,
    startDate: absStartDate,
    endDate: absEndDate,
    segments: absEndSegment,
  };
}

function deriveLane(inputTimeline: InputTimeline, outputTimelines: OutputTimeline[]) {
  const occupied: {[n: number]: boolean } = {};

  outputTimelines.forEach(outputTimeline => {
    if (timelinesOverlap(inputTimeline, outputTimeline)) {
      occupied[outputTimeline.lane] = true;
    }
  });

  let lane = 1;
  while (occupied[lane]) {
    lane++
  }

  return lane;
}

