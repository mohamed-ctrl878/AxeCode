export class JobAdEntity {
    constructor(data = {}) {
        this.type = 'job_ad';
        this.roleId = data.roleId;
        this.roleUid = data.roleUid;
        this.jobTitle = data.jobTitle; // { slug, labelAr, labelEn }
        this.customLabel = data.customLabel;
        this.requiredLevel = data.requiredLevel;
        this.slots = data.slots;
        this.isMatched = data.isMatched;
        this.hasApplied = data.hasApplied;
        
        // Embedded Project summary
        this.project = data.project; 
        /* 
        { 
            uid, 
            title, 
            methodology, 
            status, 
            publisher: { username, uid } 
        } 
        */
    }
}
