import { JWT_SECRET } from '$app/env/private';
import jwt from 'jsonwebtoken';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  try {
    const { name: userName } = jwt.verify(cookies.get('jwt') || '', JWT_SECRET) as { name: string };
    return { isAuthenticated: true, userName };
  } catch {
    return { isAuthenticated: false, userName: '' };
  }
};
