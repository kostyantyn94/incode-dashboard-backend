import { hashids } from './hashids';

describe('Hashids Utility', () => {
  describe('encode', () => {
    it('encodes a single number', () => {
      const encoded = hashids.encode(123);
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThanOrEqual(8); // minimum length is 8
    });

    it('encodes multiple numbers', () => {
      const encoded = hashids.encode(1, 2, 3);
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe('string');
    });

    it('produces different hashes for different numbers', () => {
      const hash1 = hashids.encode(1);
      const hash2 = hashids.encode(2);
      expect(hash1).not.toBe(hash2);
    });

    it('produces consistent hashes for the same input', () => {
      const hash1 = hashids.encode(42);
      const hash2 = hashids.encode(42);
      expect(hash1).toBe(hash2);
    });
  });

  describe('decode', () => {
    it('decodes an encoded number back to original', () => {
      const original = 123;
      const encoded = hashids.encode(original);
      const decoded = hashids.decode(encoded);
      expect(decoded[0]).toBe(original);
    });

    it('decodes multiple numbers', () => {
      const encoded = hashids.encode(1, 2, 3);
      const decoded = hashids.decode(encoded);
      expect(decoded).toEqual([1, 2, 3]);
    });

    it('throws error for invalid hash with invalid characters', () => {
      expect(() => hashids.decode('invalid-hash-string')).toThrow();
    });

    it('returns empty array for empty string', () => {
      const decoded = hashids.decode('');
      expect(decoded).toEqual([]);
    });
  });

  describe('round-trip encoding/decoding', () => {
    it('maintains data integrity for large numbers', () => {
      const original = 999999999;
      const encoded = hashids.encode(original);
      const decoded = hashids.decode(encoded);
      expect(decoded[0]).toBe(original);
    });

    it('maintains data integrity for zero', () => {
      const original = 0;
      const encoded = hashids.encode(original);
      const decoded = hashids.decode(encoded);
      expect(decoded[0]).toBe(original);
    });

    it('maintains data integrity for array of numbers', () => {
      const originals = [10, 20, 30, 40, 50];
      const encoded = hashids.encode(...originals);
      const decoded = hashids.decode(encoded);
      expect(decoded).toEqual(originals);
    });
  });
});
