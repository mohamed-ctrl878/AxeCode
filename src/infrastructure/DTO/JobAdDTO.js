export class JobAdDTO {
    constructor(data = {}) {
        this._type = 'job_ad';
        this.role_id = data.role_id;
        this.role_documentId = data.role_documentId;
        this.job_title = data.job_title || {}; // { slug, label_ar, label_en }
        this.custom_label = data.custom_label;
        this.required_level = data.required_level;
        this.slots = data.slots;
        this.is_matched = data.is_matched;
        this.has_applied = data.has_applied;
        
        // Project summary
        this.project = data.project || {}; // { documentId, title, methodology, status, publisher: { username, documentId } }
    }
}
