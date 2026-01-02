import { Speakers } from "./Speakers";

export class EventDTO {
    constructor(data) {
        this.title = data.title;
        this.discription = data.discription;//rich blocks
        this.media = data.media;
        this.date = data.date;
        this.onsite = data.onsite;//boolean input
        this.live_streaming = data.live_streaming;//boolean input
        this.location = data.location;
        this.duration = data.duration;//number input
        this.speakers = data?.speakers?.map((speaker) => new Speakers(speaker))
    }
}