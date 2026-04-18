
import { EntityMapper } from '../../src/domain/mapper/EntityMapper';
import { CourseDTO } from '../../src/infrastructure/DTO/CourseDTO';

describe('EntityMapper Mock Removal Verification', () => {
    const mockCourseData = {
        documentId: 'course_123',
        title: 'Test Course',
        lessonCount: 15,
        duration: 120, // 2 hours
        interactions: {
            rating: {
                average: 4.2,
                count: 88
            }
        },
        instructor: {
            documentId: 'user_456',
            username: 'test_instructor',
            displayName: 'Real Instructor'
        }
    };

    it('should map real duration and reviewsCount correctly without mock fallbacks', () => {
        const dto = new CourseDTO(mockCourseData);
        const mapper = new EntityMapper();
        const entity = mapper.toCourse(dto);

        expect(entity.duration).toBe(120);
        expect(entity.reviewsCount).toBe(88);
        expect(entity.rating).toBe(4.2);
        expect(entity.instructor.displayName).toBe('Real Instructor');
    });

    it('should handle missing data gracefully (fallbacks to 0, not mock values)', () => {
        const emptyData = {
            documentId: 'course_789'
        };
        const dto = new CourseDTO(emptyData);
        const mapper = new EntityMapper();
        const entity = mapper.toCourse(dto);

        expect(entity.duration).toBe(0);
        expect(entity.reviewsCount).toBe(0);
        expect(entity.rating).toBe(0);
    });
});
