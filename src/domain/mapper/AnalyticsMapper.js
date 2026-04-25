import { CMSAnalytics } from "../entity/CMSAnalytics";
import { CMSAnalyticsDTO } from "../../infrastructure/DTO/CMSAnalyticsDTO";

/**
 * Mapper for Analytics related data transformations
 */
export class AnalyticsMapper {
    /**
     * Maps Raw Data from API to Domain Entity
     */
    static toEntity(rawData) {
        return new CMSAnalytics(rawData);
    }

    /**
     * Maps Domain Entity to Response DTO for the UI
     */
    static toResponseDTO(entity) {
        return new CMSAnalyticsDTO(entity);
    }
}
