import transform from './transform';

describe('transform', () => {
  test('no input', () => {
    const { segments } = transform();
    expect(segments).toEqual(0);
  });

  test('', () => {

  });
});
