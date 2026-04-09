/**
 * Utility to flatten Strapi v4/v5 responses.
 * Converts { id, attributes: { ... } } to { id, ...attributes }.
 * Also handles nested data arrays and objects.
 */
export const flattenStrapi = (data) => {
    if (!data) return null;

    // Handle Array
    if (Array.isArray(data)) {
        return data.map(item => flattenStrapi(item));
    }

    // Handle Strapi's { data: ... } wrapper
    if (data.data !== undefined) {
        return flattenStrapi(data.data);
    }

    // Handle item with attributes
    let result = {};
    if (data.id !== undefined) result.id = data.id;
    if (data.documentId !== undefined) result.documentId = data.documentId;

    const attributes = data.attributes || {};
    const rootFields = { ...data };
    delete rootFields.attributes;
    delete rootFields.data;

    const combined = { ...rootFields, ...attributes };

    Object.keys(combined).forEach(key => {
        const value = combined[key];
        if (value !== null && typeof value === 'object') {
            result[key] = flattenStrapi(value);
        } else {
            result[key] = value;
        }
    });

    return result;
};
