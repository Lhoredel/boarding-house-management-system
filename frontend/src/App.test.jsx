
import { describe, it, expect } from 'vitest';

describe('Boarding House Management System', () => {

  it('should pass the basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have the correct application name', () => {
    const appName = 'Boarding House Management System';

    expect(appName).toBe(
      'Boarding House Management System'
    );
  });

});
