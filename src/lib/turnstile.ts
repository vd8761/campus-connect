export interface VerifyTurnstileOptions {
  action?: string;
  remoteIp?: string;
}

export async function verifyTurnstileToken(
  token?: string | null,
  optionsOrRemoteIp?: string | VerifyTurnstileOptions
): Promise<{ success: boolean; error?: string; hostname?: string; action?: string }> {
  const options: VerifyTurnstileOptions =
    typeof optionsOrRemoteIp === 'string'
      ? { remoteIp: optionsOrRemoteIp }
      : optionsOrRemoteIp || {};

  const expectedAction = options.action;
  const clientIp = options.remoteIp;

  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return {
      success: false,
      error: 'Security verification token is invalid or missing. Please complete the captcha.',
    };
  }

  const secret =
    process.env.TURNSTILE_SECRET ||
    process.env.TURNSTILE_SECRET_KEY ||
    process.env.CLOUDFLARE_SECRET_KEY;

  if (!secret) {
    console.warn('Turnstile secret key is not configured in environment variables.');
    return { success: false, error: 'Turnstile is not properly configured.' };
  }

  const rawHostnames = process.env.TURNSTILE_HOSTNAMES || 'localhost, 127.0.0.1, campussquare.originbi.com';
  const expectedHostnames = new Set(
    rawHostnames
      .split(',')
      .map((hostname) => hostname.trim())
      .filter(Boolean)
  );

  try {
    const params = new URLSearchParams({
      secret,
      response: token,
    });
    if (clientIp) {
      params.append('remoteip', clientIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: params,
    });

    if (!res.ok) {
      throw new Error(`siteverify HTTP error ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
      console.error('Cloudflare Turnstile verification failed:', data);
      return {
        success: false,
        error: 'Security check failed. Please refresh the page and try again.',
      };
    }

    // Verify expected action if configured
    if (expectedAction && data.action && data.action !== expectedAction) {
      console.error(`Cloudflare Turnstile action mismatch: expected "${expectedAction}", got "${data.action}"`);
      return {
        success: false,
        error: 'Security check action validation failed. Please try again.',
      };
    }

    // Verify expected hostname if configured
    if (expectedHostnames.size > 0 && data.hostname && !expectedHostnames.has(data.hostname)) {
      console.error(`Cloudflare Turnstile hostname mismatch: "${data.hostname}" not in allowed hostnames`, expectedHostnames);
      return {
        success: false,
        error: 'Security check hostname validation failed.',
      };
    }

    return {
      success: true,
      hostname: data.hostname,
      action: data.action,
    };
  } catch (err: any) {
    console.error('Error verifying Cloudflare Turnstile token:', err);
    return {
      success: false,
      error: 'Unable to connect to security verification service. Please try again.',
    };
  }
}

