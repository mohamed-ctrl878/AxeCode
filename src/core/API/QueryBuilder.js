import qs from 'qs';

/**
 * Utility for building Strapi 5 query parameters.
 * Separated from DTOs for cleaner infrastructure logic.
 */
const QueryBuilder = {
    /**
     * Builds a filter query string for a specific field.
     * @param {string} field - The field name to filter by.
     * @param {any} value - The value to filter for.
     * @returns {string} - Encoded query string (e.g., filters[title][$eq]=value)
     */
    buildFilter: (field, value) => {
        if (!field || value === undefined) return '';
        
        const queryObject = {
            filters: {
                [field]: {
                    $eq: value
                }
            }
        };
        
        return qs.stringify(queryObject, { encodeValuesOnly: true });
    },

    /**
     * Builds pagination parameters for infinite scroll or offset pagination.
     * @param {number} from - The starting index (offset).
     * @param {number} to - The ending index (limit calculation).
     * @returns {string} - Encoded query string (e.g., pagination[start]=from&pagination[limit]=count)
     */
    buildPagination: (from, to) => {
        const start = parseInt(from, 10) || 0;
        const end = parseInt(to, 10) || 0;
        const limit = end > start ? end - start : 10; // Default limit of 10 if invalid

        const queryObject = {
            pagination: {
                start: start,
                limit: limit
            }
        };

        return qs.stringify(queryObject, { encodeValuesOnly: true });
    },

    /**
     * Merges multiple query components into a single string.
     * @param {...string} queries - Multiple query strings built by build* methods.
     * @returns {string} - Combined query string.
     */
    combine: (...queries) => {
        return queries.filter(q => !!q).join('&');
    }
};

export default QueryBuilder;
