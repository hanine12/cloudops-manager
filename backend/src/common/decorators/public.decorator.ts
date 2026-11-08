import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Marks a route as open: the JWT guard will skip it (login, register).
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);