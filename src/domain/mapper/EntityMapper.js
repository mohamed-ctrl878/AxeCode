import { MediaEntity } from '../entity/MediaEntity';
import { UserEntity } from '../entity/UserEntity';
import { PostEntity } from '../entity/PostEntity';
import { LessonEntity } from '../entity/LessonEntity';
import { CourseEntity } from '../entity/CourseEntity';
import { BlogEntity } from '../entity/BlogEntity';
import { EventEntity } from '../entity/EventEntity';
import { ProblemEntity } from '../entity/ProblemEntity';
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
            title: dto.title,
            description: dto.description,
            thumbnail: this.toMedia(dto.picture),
            difficulty: dto.difficulty,
            price: dto.price,
            studentCount: dto.studentCount,
            hasAccess: dto.hasAccess,
            instructor: this.toUser(dto.instructor),
            weeks: Array.from(dto.weeks?.values() || [])
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
