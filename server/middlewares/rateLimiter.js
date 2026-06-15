export const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    global.rateLimitStore ??= {};

    const now = Date.now();
    const WINDOW_MS = 60 * 1000; // 1 minute
    const MAX_REQUESTS = 10;

    const timestamps = global.rateLimitStore[ip] || [];
    const recentRequests = timestamps.filter(
        (time) => now - time < WINDOW_MS
    );
    if (recentRequests.length >= MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    }
    recentRequests.push(now);
    global.rateLimitStore[ip] = recentRequests;
    next();
};