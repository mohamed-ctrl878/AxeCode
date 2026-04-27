import { BaseRequest } from './BaseRequest';
import { SecurityUtils } from '../../../core/utils/SecurityUtils';

/**
 * Request DTO for Event creation/update.
 * Handles the special { event, entitlement } structure expected by the backend.
 */
export class EventRequest extends BaseRequest {
    constructor(eventData = {}, entitlementData = null) {
        console.log(eventData, "eventData")
        super();
        this.data = {
            title: eventData.title,
            discription: eventData.description, // Backend typo 'discription' preserved
            location: eventData.location,
            date: eventData.date,
            onsite: !!eventData.onsite,
            duration: eventData.duration,
            speakers: eventData.speakerIds || [],
            event_activities: eventData.activityIds || [],
            image: eventData.imageIds || [],
            isDraft: eventData.isDraft ?? true
        };

        if (entitlementData) {
            this.entitlement = {
                title: entitlementData.title || eventData.title,
                description: entitlementData.description || eventData.description,
                price: entitlementData.price,
                currency: entitlementData.currency || 'USD',
                content_types: entitlementData.contentType || 'event',
                decision: entitlementData.decision ?? true,
                duration: entitlementData.duration
            };
        }
    }

    /**
     * Overrides BaseRequest.toPayload to match the backend expectations for Event.
     * The Event controller uses: const { event, entitlement } = ctx.request.body;
     */
    toPayload() {
        return {
            data: SecurityUtils.sanitizeData(this.data),
            entitlement: SecurityUtils.sanitizeData(this.entitlement)
        };
    }

    validate() {
        super.validate();
        if (!this.data.title) throw new Error("Event title is required.");
        if (this.entitlement && (!this.entitlement.price && this.entitlement.price !== 0)) {
            throw new Error("Entitlement price is required if entitlement is provided.");
        }
    }
}
