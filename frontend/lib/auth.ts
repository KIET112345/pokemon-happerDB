import jwt from 'jsonwebtoken';

export function getUserIdFromAuth(header: string | null): string | null {
  if (!header) return null;
  const token = header.split(' ')[1];
  if (!token) return null;
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return data.id as string;
  } catch {
    return null;
  }
}
