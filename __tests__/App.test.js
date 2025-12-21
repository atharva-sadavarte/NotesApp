import { sum } from '../src/sum';

test('adds two numbers', () => {
  expect(sum(1, 2)).toEqual(3);
  expect(sum(-1, 1)).toEqual(0);
});
