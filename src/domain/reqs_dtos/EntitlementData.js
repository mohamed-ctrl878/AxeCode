import { Speakers } from "./Speakers";

export class EntitlementData {
    constructor(data) {
        this.content_types = data?.content_types;
        this.decision = data?.decision;
        this.price = data?.price;
        this.currency = data?.currency;
        this.description = data?.description;
        this.title = data?.title;
        this.duration = data?.duration;
        this.itemId = data?.itemId;
        this.speaker=data?.speaker?.map((item)=>new Speakers(item))
    }
}