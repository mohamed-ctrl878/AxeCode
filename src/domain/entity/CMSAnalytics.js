/**
 * Domain Entity for Analytics
 * Represents the core business logic and structure.
 */
export class CMSAnalytics {
    constructor({ users, courses, events, reports, contributors }) {
        this.users = this._normalize(users);
        this.courses = this._normalize(courses);
        this.events = this._normalize(events);
        this.reports = this._normalize(reports);
        this.contributors = {
            authors: this._normalize(contributors?.authors),
            organizers: this._normalize(contributors?.organizers)
        };
    }

    _normalize(data) {
        return {
            total: data?.total || 0,
            timeline: (data?.timeline || []).map(t => ({
                time: t.time,
                count: Number(t.count || 0)
            }))
        };
    }

    getSummaryStats() {
        return {
            totalCourses: this.courses.total,
            totalEvents: this.events.total,
            totalUsers: this.users.total,
            pendingReports: this.reports.total,
            courseAuthors: this.contributors.authors.total,
            eventOrganizers: this.contributors.organizers.total
        };
    }
}
