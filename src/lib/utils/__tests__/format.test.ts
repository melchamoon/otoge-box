import { describe, expect, it } from 'vitest';
import { toPercentageString, toLocalISODateString } from '@/lib/utils/format';

describe('format utilities', () => {
  it('formats percentages', () => { expect(toPercentageString(0.125)).toBe('12.50%'); expect(toPercentageString(NaN)).toBe('?'); expect(toPercentageString(undefined)).toBeUndefined(); });
  it('formats a local ISO date', () => expect(toLocalISODateString(new Date('2024-01-02T03:04:05Z'))).toMatch(/^2024-01-0[12]$/));
});
