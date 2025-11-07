import { z } from 'zod';
import { hashids } from '../utils/hashids';

export const hashId = z
  .string()
  .regex(/^[A-Za-z0-9]+$/, 'Invalid ID format')
  .transform((val) => {
    const decoded = hashids.decode(val);
    if (!decoded.length) throw new Error('Invalid or corrupted ID');
    return decoded[0] as number;
  });
