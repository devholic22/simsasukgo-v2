import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_CODES } from '@simsasukgo/shared';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

const SUPABASE_AUTH_USER_PATH = '/auth/v1/user';
const AUTH_VERIFY_TIMEOUT_MS = 5_000;
const BEARER_PREFIX = 'Bearer ';

type SupabaseUserResponse = {
  id?: unknown;
};

type AuthenticatedRequest = {
  headers?: Record<string, string | undefined>;
  userId?: string;
  user?: { id: string };
};

function createUnauthorizedException(): UnauthorizedException {
  return new UnauthorizedException({
    error: {
      code: ERROR_CODES.COMMON_UNAUTHORIZED,
      source: 'backend',
    },
  });
}

async function verifySupabaseAccessToken(accessToken: string): Promise<string | null> {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    const response = await fetch(`${supabaseUrl}${SUPABASE_AUTH_USER_PATH}`, {
      method: 'GET',
      signal: AbortSignal.timeout(AUTH_VERIFY_TIMEOUT_MS),
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as SupabaseUserResponse | null;
    const userId = payload?.id;

    if (typeof userId !== 'string' || userId.trim().length === 0) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
      throw createUnauthorizedException();
    }

    const accessToken = authHeader.slice(BEARER_PREFIX.length).trim();
    if (!accessToken) {
      throw createUnauthorizedException();
    }

    const userId = await verifySupabaseAccessToken(accessToken);
    if (!userId) {
      throw createUnauthorizedException();
    }

    request.userId = userId;
    request.user = { id: userId };

    return true;
  }
}
