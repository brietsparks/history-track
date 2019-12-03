import { getBounds, monthDiff, timelinesOverlap, timespansOverlap } from './time';

describe('timespansOverlap', () => {
  it('throws if end is before start', () => {
    const good = { startDate: new Date('1/1/2000'), endDate: new Date('2/1/2000') };
    const bad = { startDate: new Date('3/1/2000'), endDate: new Date('4/1/1990') };

    expect(() => timespansOverlap(good, bad)).toThrow();
    expect(() => timespansOverlap(bad, good)).toThrow();
  });

  describe('no overlap', () => {
    test('infinite', () => {
      const finite = { startDate: new Date('1/1/2000'), endDate: new Date('2/1/2000') };
      const infinite = { startDate: new Date('3/1/2000') };

      expect(timespansOverlap(finite, infinite)).toEqual(false);
      expect(timespansOverlap(infinite, finite)).toEqual(false);
    });

    test('finite', () => {
      const a = { startDate: new Date('1/1/2000'), endDate: new Date('2/1/2000') };
      const b = { startDate: new Date('3/1/2000'), endDate: new Date('4/1/2000') };

      expect(timespansOverlap(a, b)).toEqual(false);
      expect(timespansOverlap(b, a)).toEqual(false);
    });
  });

  describe('overlap', () => {
    test('infinite crossed', () => {
      const finite = { startDate: new Date('1/1/2000'), endDate: new Date('4/1/2000') };
      const infinite = { startDate: new Date('3/1/2000') };

      expect(timespansOverlap(finite, infinite)).toEqual(true);
      expect(timespansOverlap(infinite, finite)).toEqual(true);
    });

    test('infinite enveloped', () => {
      const finite = { startDate: new Date('4/1/2000'), endDate: new Date('5/1/2000') };
      const infinite = { startDate: new Date('3/1/2000') };

      expect(timespansOverlap(finite, infinite)).toEqual(true);
      expect(timespansOverlap(infinite, finite)).toEqual(true);
    });

    test('finite crossed', () => {
      const a = { startDate: new Date('1/1/2000'), endDate: new Date('3/1/2000') };
      const b = { startDate: new Date('2/1/2000'), endDate: new Date('4/1/2000') };

      expect(timespansOverlap(a, b)).toEqual(true);
      expect(timespansOverlap(b, a)).toEqual(true);
    });

    test('finite enveloped', () => {
      const a = { startDate: new Date('1/1/2000'), endDate: new Date('5/1/2000') };
      const b = { startDate: new Date('2/1/2000'), endDate: new Date('4/1/2000') };

      expect(timespansOverlap(a, b)).toEqual(true);
      expect(timespansOverlap(b, a)).toEqual(true);
    });
  });
});

describe('timelinesOverlap', () => {
  test('overlap', () => {
    const a = {
      id: 'a',
      timespans: [
        { startDate: new Date('1/1/2000'), endDate: new Date('2/1/2000') },
        { startDate: new Date('3/1/2000'), endDate: new Date('4/1/2000') },
      ]
    };

    const b = {
      id: 'b',
      timespans: [
        { startDate: new Date('1/1/2001'), endDate: new Date('2/1/2001') },
        { startDate: new Date('3/1/2001'), endDate: new Date('4/1/2001') },
      ]
    };

    expect(timelinesOverlap(a, b)).toEqual(false);
    expect(timelinesOverlap(b, a)).toEqual(false);
  });

  test('no overlap', () => {
    const a = {
      id: 'a',
      timespans: [
        { startDate: new Date('1/1/2000'), endDate: new Date('2/1/2000') },
        { startDate: new Date('3/1/2001'), endDate: new Date('4/1/2001') },
      ]
    };

    const b = {
      id: 'b',
      timespans: [
        { startDate: new Date('1/1/2001'), endDate: new Date('2/1/2001') },
        { startDate: new Date('3/1/2001'), endDate: new Date('4/1/2001') },
      ]
    };

    expect(timelinesOverlap(a, b)).toEqual(true);
    expect(timelinesOverlap(b, a)).toEqual(true);
  });
});

describe('getBounds', () => {
  test('finite', () => {
    const timelines = [
      {
        id: 'a',
        timespans: [
          { startDate: new Date('1/1/2000'), endDate: new Date('2/1/2000') },
          { startDate: new Date('3/1/2001'), endDate: new Date('4/1/2001') },
        ]
      },
      {
        id: 'b',
        timespans: [
          { startDate: new Date('1/1/2002'), endDate: new Date('2/1/2002') },
          { startDate: new Date('3/1/2004'), endDate: new Date('4/1/2004') },
        ]
      }
    ];

    expect(getBounds(timelines)).toEqual([new Date('1/1/2000'), new Date('4/1/2004')]);
  });

  test('infinite', () => {
    const timelines = [
      {
        id: 'a',
        timespans: [
          { startDate: new Date('1/1/2000'), endDate: new Date('2/1/2000') },
          { startDate: new Date('3/1/2001'), endDate: new Date('4/1/2001') },
        ]
      },
      {
        id: 'b',
        timespans: [
          { startDate: new Date('1/1/2002'), endDate: new Date('2/1/2002') },
          { startDate: new Date('3/1/2004') },
        ]
      }
    ];

    const [start, end] = getBounds(timelines);
    expect(start).toEqual(new Date('1/1/2000'));

    // manually check each date part in case test is off by milliseconds or less
    const now = new Date();
    expect([end.getFullYear(), end.getMonth(), end.getDay()])
      .toEqual([now.getFullYear(), now.getMonth(), now.getDay()]);
  });
});

test('monthDiff', () => {
  expect(monthDiff(new Date(2010, 2, 12), new Date(2008, 10, 4))).toEqual(15);
  expect(monthDiff(new Date(2010, 2, 12), new Date(2010, 0, 1))).toEqual(1);
  expect(monthDiff(new Date(2010, 2, 12), new Date(2010, 1, 1))).toEqual(0);
});
