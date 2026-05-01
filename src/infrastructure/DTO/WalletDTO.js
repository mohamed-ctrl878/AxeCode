/**
 * Data Transfer Object for Wallet responses
 */
export class WalletDTO {
    constructor(data) {
        if (!data) return;

        this.id = data.id;
        this.documentId = data.documentId;
        this.ownerType = data.owner_type;
        this.balance = Number(data.balance || 0);
        this.pendingBalance = Number(data.pending_balance || 0);
        this.currency = data.currency || 'EGP';
        this.commissionRate = data.commission_rate ? Number(data.commission_rate) : 0;
        this.isActive = Boolean(data.is_active);
        
        // Owner info (can be populated)
        this.owner = data.owner ? {
            id: data.owner.id,
            username: data.owner.username,
            email: data.owner.email,
        } : null;

        this.transactions = Array.isArray(data.transactions) ? data.transactions.map(t => new TransactionDTO(t)) : [];
        this.payouts = Array.isArray(data.payouts) ? data.payouts.map(p => new PayoutDTO(p)) : [];
        
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
    }
}

export class TransactionDTO {
    constructor(data) {
        if (!data) return;
        
        this.id = data.id;
        this.type = data.type; // 'credit' | 'debit' | 'commission' | 'withdrawal' | 'refund'
        this.amount = Number(data.amount || 0);
        this.description = data.description || '';
        this.referenceType = data.reference_type;
        this.referenceId = data.reference_id;
        this.metadata = data.metadata || {};
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
    }
}

export class PayoutDTO {
    constructor(data) {
        if (!data) return;
        
        this.id = data.id;
        this.amount = Number(data.amount || 0);
        this.status = data.status; // 'pending' | 'processing' | 'completed' | 'failed' | 'rejected'
        this.method = data.method;
        this.details = data.details || {};
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
    }
}
