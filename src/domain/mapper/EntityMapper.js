import { MediaEntity } from '../entity/MediaEntity';
import { UserEntity } from '../entity/UserEntity';
import { PostEntity } from '../entity/PostEntity';
import { LessonEntity } from '../entity/LessonEntity';
import { CourseEntity, CardCourseEntity, CoursePreviewEntity } from '../entity/CourseEntity';
import { BlogEntity } from '../entity/BlogEntity';
import { EventEntity, CardEventEntity } from '../entity/EventEntity';
import { ProblemEntity, CardProblemEntity } from '../entity/ProblemEntity';
import { ArticleEntity } from '../entity/ArticleEntity';
import { CommentEntity } from '../entity/CommentEntity';
import { RoadmapEntity } from '../entity/RoadmapEntity';
import { ConversationEntity } from '../entity/ConversationEntity';
import { MessageEntity } from '../entity/MessageEntity';

/**
 * EntityMapper utility for converting DTOs to Domain Entities.
 */
export class EntityMapper {
    /**
     * Maps a MediaDTO or raw media object to MediaEntity.
     */
    static toMedia(data) {
        if (!data) return null;
        console.log("data", data)
        return new MediaEntity({
            id: data.id,
            url: data.url,
            name: data.display_name || data.name,
            mime: data.mime,
            size: data.size,
            width: data.width,
            height: data.height
        });
    }

    /**
     * Maps a UserDTO or raw user object to UserEntity.
     */
    static toUser(data) {
        if (!data) return null;
        return new UserEntity({
            id: data.id,
            uid: data.documentId,
            username: data.username,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
            university: data.university,
            avatar: this.toMedia(data.avatar)
        });
    }

    /**
     * Maps a PostDTO to PostEntity.
     */
    static toPost(dto) {
        if (!dto) return null;
        return new PostEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            isLiked: dto.isLiked,
            caption: dto.caption,
            author: this.toUser(dto.author),
            media: Array.from(dto.media?.values() || []).map(m => this.toMedia(m)),
            article: dto.article ? this.toArticle(dto.article) : null
        });
    }

    /**
     * Maps an ArticleDTO or raw article object to ArticleEntity.
     */
    static toArticle(data) {
        if (!data) return null;
        // Check if it's a DTO or raw object
        return new ArticleEntity({
            id: data.id,
            uid: data.documentId,
            createdAt: data.createdAt ? new Date(data.createdAt) : null,
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
            engagementScore: data.engagementScore || data.engagement_score || 0,
            tags: data.tags || [],
            likesCount: data.likesCount || 0,
            commentsCount: data.commentsCount || 0,
            isLiked: !!data.isLikedByMe,
            content: data.content,
            author: this.toUser(data.users_permissions_user || data.author),
            title: data.title
        });
    }

    /**
     * Maps a LessonDTO to LessonEntity.
     */
    static toLesson(dto) {
        if (!dto) return null;
        return new LessonEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            isLiked: dto.isLiked,
            title: dto.title,
            type: dto.typeOfLesson,
            isCompleted: dto.isCompleted,
            video: this.toMedia(dto.video),
            description: dto.description,
            isPublic: dto.public,
            instructor: this.toUser(dto.instructor)
        });
    }

    /**
     * Maps a CourseDTO to CourseEntity.
     */
    static toCourse(dto) {
        if (!dto) return null;
        return new CourseEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            isLiked: dto.isLiked,
            title: dto.title,
            description: dto.description,
            thumbnail: this.toMedia(dto.picture),
            difficulty: dto.difficulty,
            price: dto.price,
            studentCount: dto.studentCount,
            hasAccess: dto.hasAccess,
            instructor: this.toUser(dto.instructor),
            weeks: Array.from(dto.weeks?.values() || []),
            rating: dto.interactions?.rating?.average || 0 // Mapping from interactions if available
        });
    }

    /**
     * Maps a BlogDTO to BlogEntity.
     */
    static toBlog(dto) {
        if (!dto) return null;
        return new BlogEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            isLiked: dto.isLiked,
            description: dto.description,
            image: this.toMedia(dto.image),
            author: this.toUser(dto.author)
        });
    }

    /**
     * Maps an EventDTO to EventEntity.
     */
    static toEvent(dto) {
        if (!dto) return null;
        return new EventEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            isLiked: dto.isLiked,
            title: dto.title,
            type: dto.type,
            startDate: dto.startDate,
            endDate: dto.endDate,
            location: dto.location,
            cover: this.toMedia(dto.cover),
            price: dto.price,
            registeredCount: dto.registeredCount
        });
    }

    /**
     * Maps a CourseDTO to CardCourseEntity (lightweight card representation).
     * @param {CourseDTO} dto
     * @returns {CardCourseEntity|null}
     */
    static toCardCourse(dto) {
        if (!dto) return null;
        return new CardCourseEntity({
            uid: dto.documentId,
            title: dto.title,
            thumbnail: this.toMedia(dto.picture),
            difficulty: dto.difficulty,
            contentType: dto.contentType,
            price: dto.price,
            studentCount: dto.studentCount,
            hasAccess: dto.hasAccess,
            entitlementsId: dto.entitlementsId,
            instructor: dto.instructor?.username || dto.instructor,
            weeks: Array.from(dto.weeks?.values() || []),
            rating: dto.interactions?.rating?.average || 0
        });
    }

    /**
     * Maps a CourseDTO to CoursePreviewEntity (full preview for details page).
     * Deeply maps weeks → lessons via toLesson().
     * @param {CourseDTO} dto
     * @returns {CoursePreviewEntity|null}
     */
    static toCoursePreview(dto) {
        if (!dto) return null;

        const weeks = Array.from(dto.weeks?.values() || []).map(week => ({
            id: week.id,
            documentId: week.documentId,
            title: week.title,
            lessons: Array.from(week.lessons?.values() || []).map(lesson => this.toLesson(lesson))
        }));

        return new CoursePreviewEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            isLiked: dto.isLiked,
            title: dto.title,
            description: dto.description,
            thumbnail: this.toMedia(dto.picture),
            difficulty: dto.difficulty,
            contentType: dto.contentType,
            price: dto.price,
            studentCount: dto.studentCount,
            hasAccess: dto.hasAccess,
            entitlementsId: dto.entitlementsId,
            instructor: this.toUser(dto.instructor),
            weeks,
            rating: dto.interactions?.rating?.average || 0
        });
    }

    /**
     * Maps an EventDTO to CardEventEntity (lightweight card representation).
     * @param {EventDTO} dto
     * @returns {CardEventEntity|null}
     */
    static toCardEvent(dto) {
        if (!dto) return null;
        const firstImage = dto.images?.size > 0 ? this.toMedia(Array.from(dto.images.values())[0]) : null;
        return new CardEventEntity({
            uid: dto.documentId,
            title: dto.title,
            type: dto.onsite && dto.live_streaming ? 'Hybrid' : dto.onsite ? 'Onsite' : dto.live_streaming ? 'Live' : 'Event',
            startDate: dto.date,
            location: dto.location,
            cover: firstImage?.url || null,
            price: dto.price,
            registeredCount: dto.studentCount,
            hasAccess: dto.hasAccess,
            duration: dto.duration
        });
    }

    /**
     * Maps a ProblemDTO to ProblemEntity.
     */
    static toProblem(dto) {
        if (!dto) return null;
        return new ProblemEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            title: dto.title,
            difficulty: dto.difficulty,
            description: dto.description,
            availableLanguages: dto.availableLanguages,
            points: dto.points
        });
    }

    /**
     * Maps a ProblemDTO to CardProblemEntity (lightweight card representation).
     * @param {ProblemDTO|object} dto
     * @returns {CardProblemEntity|null}
     */
    static toCardProblem(dto) {
        if (!dto) return null;
        return new CardProblemEntity({
            id: dto.id,
            documentId: dto.documentId,
            title: dto.title,
            difficulty: dto.difficulty,
            status: dto.submissionStatus || 'New',
            points: dto.points || dto.engagement_score || 0,
            tags: Array.isArray(dto.tags) ? dto.tags.map(t => t.name || t) : [],
        });
    }

    /**
     * Maps a BlogDTO to BlogEntity.
     * @param {BlogDTO} dto
     * @returns {BlogEntity|null}
     */
    static toBlog(dto) {
        if (!dto) return null;
        return new BlogEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            likesCount: dto.likesCount,
            commentsCount: dto.commentsCount,
            isLiked: dto.isLiked,
            title: dto.title,
            description: dto.description,
            image: dto.image ? this.toMedia(dto.image) : null,
            author: dto.publisher
                ? { username: dto.publisher.username, avatar: dto.publisher.avatar ? this.toMedia(dto.publisher.avatar) : null }
                : null,
        });
    }

    /**
     * Maps an ArticleDTO to ArticleEntity.
     * @param {ArticleDTO} dto
     * @returns {ArticleEntity|null}
     */
    static toArticle(dto) {
        if (!dto) return null;
        return new ArticleEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            title: dto.title,
            content: dto.contentBlocks,
            author: dto.author
                ? { username: dto.author.username, avatar: dto.author.avatar ? this.toMedia(dto.author.avatar) : null }
                : null,
        });
    }

    /**
     * Maps a CommentDTO to CommentEntity.
     */
    static toComment(dto) {
        if (!dto) return null;
        return new CommentEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            parentId: dto.parentId,
            targetId: dto.docId,
            targetType: dto.contentType,
            body: dto.commentBody,
            author: this.toUser(dto.author)
        });
    }

    /**
     * Maps a RoadmapDTO to RoadmapEntity.
     */
    static toRoadmap(dto) {
        if (!dto) return null;
        return new RoadmapEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            title: dto.title,
            description: dto.description,
            flowData: dto.flowData,
            color: dto.color,
            icon: dto.icon,
            author: this.toUser(dto.author)
        });
    }

    /**
     * Maps a ConversationDTO to ConversationEntity.
     */
    static toConversation(dto) {
        if (!dto) return null;
        return new ConversationEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            title: dto.title,
            description: dto.description,
            photo: this.toMedia(dto.photo),
            creator: this.toUser(dto.creator),
            members: Array.from(dto.members?.values() || []).map(m => this.toUser(m)),
            admins: Array.from(dto.admins?.values() || []).map(a => this.toUser(a))
        });
    }

    /**
     * Maps a MessageDTO to MessageEntity.
     */
    static toMessage(dto) {
        if (!dto) return null;
        return new MessageEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publishedAt: dto.publishedAt,
            engagementScore: dto.engagementScore,
            tags: dto.tags,
            conversationId: dto.conversationId,
            sender: this.toUser(dto.user),
            text: dto.message
        });
    }
}
