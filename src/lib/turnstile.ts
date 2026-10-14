export async function verifyTurnstileToken(token?: string | null, remoteIp?: string): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return { success: false, error: 'Security verification token is missing. Please complete the captcha.' };
  }

  const secret = process.env.CLOUDFLARE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('Turnstile secret key is not configured in environment variables.');
    // If not configured in dev, bypass or fail
    return { success: false, error: 'Turnstile is not properly configured.' };
  }

  try {
    const formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      console.error('Cloudflare Turnstile verification failed:', data);
      return { 
        success: false, 
        error: 'Security check failed. Please refresh the page and try again.' 
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error verifying Cloudflare Turnstile token:', err);
    return { 
      success: false, 
      error: 'Unable to connect to security verification service. Please try again.' 
    };
  }
}
