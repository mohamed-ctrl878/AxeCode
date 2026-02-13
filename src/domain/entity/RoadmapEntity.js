import { ContentEntity } from './ContentEntity';

/**
 * RoadmapEntity class for learning paths and flow diagrams.
 */
export class RoadmapEntity extends ContentEntity {
    /**
     * @param {object} props
     * @param {string} props.title
     * @param {object|array} props.description - Blocks
     * @param {object} props.flowData - JSON for React Flow
     * @param {string} props.color
     * @param {string} props.icon
     * @param {UserEntity|null} props.author
     */
    constructor(props = {}) {
        super(props);
        this.title = props.title;
        this.description = props.description;
        this.flowData = props.flowData;
        this.color = props.color;
        this.icon = props.icon;
        this.author = props.author;
    }

    /**
     * Returns total number of nodes in the roadmap flow.
     * @returns {number}
     */
    get nodeCount() {
        return this.flowData?.nodes?.length || 0;
    }
}
