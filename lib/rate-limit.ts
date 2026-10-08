const rateLimitMap = new Map<
    string,
    { count: number; resetTime: number }
>();

export function rateLimit({
    key,
    limit = 10,
    windowMs = 60_000
}: {
    key: string;
    limit?: number;
    windowMs?: number;
}) {
    const now = Date.now();

    for (const [mapKey, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(mapKey);
        }
    }

    const record = rateLimitMap.get(key);

    if (!record) {
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + windowMs
        });

        return {
            success: true,
            remaining: limit - 1,
            resetTime: now + windowMs
        };
    }

    if (record.count >= limit) {
        return {
            success: false,
            remaining: 0,
            resetTime: record.resetTime
        };
    }

    record.count++;

    return {
        success: true,
        remaining: limit - record.count,
        resetTime: record.resetTime
    };
}