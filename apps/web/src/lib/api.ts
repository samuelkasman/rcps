import { config } from "./config";

/**
 * Fetch data from the internal API with the required API key
 */
export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    const response = await fetch(`${config.API_URL}${endpoint}`, {
      ...options,
      headers: {
        "x-internal-api-key": config.INTERNAL_API_KEY,
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error(`API request failed: ${endpoint}`, response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`API request error: ${endpoint}`, error);
    return null;
  }
}
