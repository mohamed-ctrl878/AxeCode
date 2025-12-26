export class EntitlementDTO {
  constructor(data = {}) {
    this.title = data.title || "";
    this.description = data.description || "";
    this.price = data.price || 0;
    this.currency = data.currency || "USD";
    this.decision = data.decision || false;
    this.content_types = data.content_types || "VIDEO"; // Enum
    this.itemId = data.itemId || 0;
    this.duration = data.duration || null;
    this.content_id = data.content_id || null; // Link to Draft
  }
}
