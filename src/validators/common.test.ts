import { hashId } from './common';
import { hashids } from '../utils/hashids';

describe('hashId Validator', () => {
  describe('valid hash IDs', () => {
    it('successfully transforms a valid hash ID to a number', () => {
      const originalId = 123;
      const encoded = hashids.encode(originalId);
      const result = hashId.parse(encoded);
      expect(result).toBe(originalId);
    });

    it('transforms hash IDs for different numbers', () => {
      const testIds = [1, 42, 999, 12345];
      testIds.forEach((id) => {
        const encoded = hashids.encode(id);
        const result = hashId.parse(encoded);
        expect(result).toBe(id);
      });
    });

    it('handles large numbers', () => {
      const largeId = 999999999;
      const encoded = hashids.encode(largeId);
      const result = hashId.parse(encoded);
      expect(result).toBe(largeId);
    });

    it('handles zero', () => {
      const encoded = hashids.encode(0);
      const result = hashId.parse(encoded);
      expect(result).toBe(0);
    });
  });

  describe('invalid hash IDs', () => {
    it('rejects empty string', () => {
      expect(() => hashId.parse('')).toThrow('Invalid ID format');
    });

    it('rejects strings with special characters', () => {
      const invalidIds = ['abc-123', 'test@id', 'id#123', 'test id', 'id_123'];
      invalidIds.forEach((invalidId) => {
        expect(() => hashId.parse(invalidId)).toThrow('Invalid ID format');
      });
    });

    it('rejects corrupted hash that cannot be decoded', () => {
      // This hash is valid format but decodes to empty array
      const corruptedHash = 'InvalidHashThatCannotBeDecoded';
      expect(() => hashId.parse(corruptedHash)).toThrow(
        'Invalid or corrupted ID',
      );
    });

    it('rejects non-string values', () => {
      expect(() => hashId.parse(123 as unknown)).toThrow();
      expect(() => hashId.parse(null as unknown)).toThrow();
      expect(() => hashId.parse(undefined as unknown)).toThrow();
      expect(() => hashId.parse({} as unknown)).toThrow();
    });
  });

  describe('edge cases', () => {
    it('handles hash with only numbers', () => {
      // Some hashes might look like pure numbers but are still valid
      const encoded = hashids.encode(100);
      const result = hashId.parse(encoded);
      expect(result).toBe(100);
    });

    it('handles hash with only letters', () => {
      const id = 42;
      const encoded = hashids.encode(id);
      // As long as it's a valid hashids encoding, it should work
      const result = hashId.parse(encoded);
      expect(result).toBe(id);
    });
  });
});
