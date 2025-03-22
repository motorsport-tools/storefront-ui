export default defineEventHandler(async (event) => {
    try {
        const ip = getRequestIP(event);

        let keyName = '';

        if (!ip) {
            const session = await useSession(event, {
                password: "b013b03ac2231e0b448e9a22ba488dcf",
            });
            keyName = session?.id ? `cache:loc:${session.id}` : '';
        } else {
            keyName = `cache:loc:${ip}`;
        }
        if (!keyName) {
            throw new Error('Could not determine cache key');
        }

        // Check Redis Cache
        const cachedData = await useStorage().getItem(keyName);
        if (cachedData) {
            console.log('Cache hit:', cachedData);
            return cachedData;
        }
        if(!ip) {
            throw new Error('Could not detect IP');
        }
        // Fetch Data from API
        const response = await fetch(`http://ipinfo.io/${ip}/json?token=6ed700814eb317`);
        const data = await response.json();
        console.log('API Response: ', data)
        // Build response
        const locationData = {
            country: data.country || "United Kingdom",
            country_id: data.country || 231,
            postcode: data.postal || null,
            city: data.city || null,
            error: null,
        };

        // Store result in cache (with expiry if needed)
        await useStorage().setItem(keyName, locationData);

        return locationData;
    } catch (error) {
        return { country: "United Kingdom", country_id: 213, city: null, postcode: null, error: error.message };
    }
});