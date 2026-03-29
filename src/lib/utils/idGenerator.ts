let counter = 0;

/**
 * Generate a unique ID using timestamp + counter.
 * More reliable than Math.random() or Date.now() alone.
 */
export function generateId(prefix = ''): string {
  counter += 1;
  const timestamp = Date.now().toString(36);
  const count = counter.toString(36);
  return prefix ? `${prefix}_${timestamp}${count}` : `${timestamp}${count}`;
}
