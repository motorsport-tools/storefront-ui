import { useStorage } from "@vueuse/core";

interface GeoLocation {
    city: string | null;
    country: string | null;
    country_id: number | null;
    postcode: string | null;
    error: string | null;
}

export function useGeoLocation(location) {

    const loading = ref(false)

    const setPostcode = (postcode: string) => {
        location.value = { ...location.value, postcode, error: null };
    };

    const setDeliveryCountry = (country: string, country_code: string) => {
        location.value = { ...location.value, country, country_code, postcode: null, error: null };
    };

    onMounted(() => {   
       
    })

    return {
        location,
        setPostcode,
        setDeliveryCountry,
        loading
    }
}