/**
 * Response DTO for Analytics (Low -> High)
 * Standards for data delivery from repository to presentation
 */
export class CMSAnalyticsDTO {
    constructor(entity) {
        this.courses = entity.courses;
        this.events = entity.events;
        this.users = entity.users;
        this.reports = entity.reports;
        this.contributors = entity.contributors;
    }
}
