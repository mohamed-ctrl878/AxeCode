/**
 * DTO for content interactions (likes, comments, ratings).
 */
export class InteractionDTO {
    constructor(data = {}) {
        /**
         * @type {object}
         * @property {number} average
         * @property {number} total
         */
        this.rating = {
            average: data.rating?.average || 0,
            total: data.rating?.total || 0
        };

        this.likesCount = data.likesCount || 0; // {number}
        this.isLikedByMe = data.isLikedByMe || false; // {boolean}
        this.myRating = data.myRating || 0; // {number}
        this.commentsCount = data.commentsCount || 0; // {number}
    }
}
