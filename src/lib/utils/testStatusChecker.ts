import { TestResultFlag } from '../enums/status';

/**
 * Compare a test result against its normal range.
 * Returns 'H' (high), 'L' (low), or null (normal/unknown).
 */
export function getTestStatus(
  result: string,
  normalRange: string,
): TestResultFlag | null {
  if (!result || !normalRange) {
    return null;
  }

  const resVal = parseFloat(result);
  if (isNaN(resVal)) {
    return null;
  }

  // Handle "min - max" format
  if (normalRange.includes('-')) {
    const parts = normalRange.split('-').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      if (resVal < parts[0]) return TestResultFlag.LOW;
      if (resVal > parts[1]) return TestResultFlag.HIGH;
      return null;
    }
  }

  // Handle "< max" format
  if (normalRange.trim().startsWith('<')) {
    const max = parseFloat(normalRange.replace('<', '').trim());
    if (!isNaN(max) && resVal > max) return TestResultFlag.HIGH;
  }

  // Handle "> min" format
  if (normalRange.trim().startsWith('>')) {
    const min = parseFloat(normalRange.replace('>', '').trim());
    if (!isNaN(min) && resVal < min) return TestResultFlag.LOW;
  }

  return null;
}

/** CSS classes for test result flags */
export const TEST_FLAG_STYLES: Record<TestResultFlag, string> = {
  [TestResultFlag.HIGH]: 'text-red-600 font-bold',
  [TestResultFlag.LOW]: 'text-yellow-600 font-bold',
};
