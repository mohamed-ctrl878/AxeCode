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
import { TestCaseEntity } from '../entity/TestCaseEntity';
import { TestCaseDTO } from '@infrastructure/DTO/TestCaseDTO';
import { SubmissionEntity } from '../entity/SubmissionEntity';
import { NotificationEntity } from '../entity/NotificationEntity';
import { ProjectEntity, ProjectRoleEntity, ProjectMemberEntity, ProjectApplicationEntity, JobTitleTagEntity } from '../entity/ProjectEntity';
import { TaskEntity, SprintEntity, CheckpointEntity } from '../entity/TaskEntity';
import { JobAdEntity } from '../entity/JobAdEntity';
import { WorkspaceItemEntity } from '../entity/WorkspaceItemEntity';
import { ReviewRequestEntity } from '../entity/ReviewRequestEntity';


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
     * Maps an UploadMediaDTO to MediaEntity.
     */
    static toUploadMedia(dto) {
        if (!dto) return null;
        return new MediaEntity({
            id: dto.id,
            url: dto.url,
            name: dto.name || dto.alternativeText || 'media_file',
            mime: dto.mime,
            size: dto.size * 1024, // Assuming strapi returns size in KB, but if bytes, remove * 1024
            width: dto.width,
            height: dto.height
        });
    }

    /**
     * Maps a UserDTO or raw user object to UserEntity.
     * @param {object|UserDTO} data 
     * @param {object} stats - Optional direct counts { total, passed }
     */
    static toUser(data, stats = {}) {
        if (!data) return null;
        console.log('[ProfileSync] Mapping toUser - Data:', data);
        console.log('[ProfileSync] Mapping toUser - Stats Prop:', stats);

        return new UserEntity({
            id: data.id,
            uid: data.documentId,
            username: data.username,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
            university: data.university,
            bio: data.bio,
            avatar: this.toMedia(data.avatar),
            confirmed: data.confirmed,
            blocked: data.blocked,
            role: data.role,
            createdAt: data.createdAt,
            submissionCount: stats.total || 0,
            passedSubmissionsCount: stats.passed || 0
        });
    }

    /**
     * Maps a PostDTO to PostEntity.
     */
    static toPost(dto) {
        if (!dto) return null;
        console.log("dto", dto)
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
            article: dto.article ? this.toArticle(dto.article) : null,
            isDraft: !!dto.isDraft
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
            instructor: this.toUser(dto.instructor),
            isDraft: !!dto.isDraft,
            embedSource: dto.embedSource,
            embedUrl: dto.embedUrl,
            embedMetadata: dto.embedMetadata,
        });
    }

    /**
     * Maps a CourseDTO to CourseEntity.
     */
    static toCourse(dto) {
        console.log("dto", dto)
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
            rating: dto.rating || 0,
            reviewsCount: dto.reviewsCount || 0,
            duration: dto.duration || 0,
            completedLessonsCount: dto.completedLessonsCount,
            lessonCount: dto.lessonCount,
            isDraft: !!dto.isDraft
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
            likesCount: dto.interactions?.likesCount || dto.likesCount || 0,
            commentsCount: dto.interactions?.commentsCount || dto.commentsCount || 0,
            isLiked: dto.interactions?.isLikedByMe || dto.interactions?.isLiked || dto.isLikedByMe || false,
            rating: dto.interactions?.rating || { average: 0, count: 0 },
            myRating: dto.interactions?.myRating || 0,
            title: dto.title,
            type: dto.onsite && dto.live_streaming ? 'Hybrid' : dto.onsite ? 'Onsite' : dto.live_streaming ? 'Live' : 'Event',
            startDate: dto.date, // Note: dto.date handles startDate
            endDate: dto.date,   // Assuming one day event mostly based on Strapi response, could be enhanced
            location: dto.location,
            cover: dto.images?.size > 0 ? this.toMedia(Array.from(dto.images.values())[0]) : null,
            images: Array.from(dto.images?.values() || []).map(img => this.toMedia(img)),
            price: dto.price,
            registeredCount: dto.studentCount,
            hasAccess: dto.hasAccess,
            description: dto.description,
            duration: dto.duration,
            entitlementsId: dto.entitlementsId,
            speakers: Array.from(dto.speakers?.values() || []).map(s => ({
                id: s.id,
                name: s.name,
                title: s.title,
                linkedin: s.linkedin,
                avatar: s.userId ? null : null // Currently SpeakerDTO doesn't have avatar extracted directly without relationship mapping
            })),
            activities: Array.from(dto.event_activities?.values() || []).map(a => ({
                id: a.id,
                title: a.title,
                description: a.description,
                time: a.time
            })),
            organizer: dto.organizer ? this.toUser(dto.organizer) : null,
            scanners: Array.from(dto.scanners?.values() || []).map(s => ({
                id: s.id,
                documentId: s.documentId,
                user: s.users_permissions_user ? {
                    id: s.users_permissions_user.id,
                    username: s.users_permissions_user.username,
                    email: s.users_permissions_user.email,
                } : null
            })),
            isDraft: !!dto.isDraft
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
            rating: dto.rating || 0,
            reviewsCount: dto.reviewsCount || 0,
            duration: dto.duration || 0,
            completedLessonsCount: dto.completedLessonsCount,
            lessonCount: dto.lessonCount
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
        console.log(dto, "dto")

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
            rating: dto.rating || 0,
            reviewsCount: dto.reviewsCount || 0,
            duration: dto.duration || 0,
            completedLessonsCount: dto.completedLessonsCount,
            lessonCount: dto.lessonCount,
            isDraft: dto.isDraft,
            course_types: Array.from(dto.course_types?.values() || [])
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
            slug: dto.slug,
            difficulty: dto.difficulty,
            description: dto.description,
            constraints: dto.constraints,
            examples: dto.examples,
            hints: dto.hints,
            functionName: dto.functionName,
            functionParams: dto.functionParams,
            returnType: dto.returnType,
            timeLimit: dto.timeLimit,
            memoryLimit: dto.memoryLimit,
            submissionStatus: dto.submissionStatus || 'New',

            problemTypes: Array.from(dto.problem_types?.values?.() || []),
            testCases: Array.from(dto.test_cases?.values?.() || []).map(tc => ({
                id: tc.id,
                documentId: tc.documentId,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                isHidden: tc.isHidden,
                order: tc.order
            })),
            codeTemplates: Array.from(dto.code_templates?.values?.() || []).map(tpl => ({
                id: tpl.id,
                documentId: tpl.documentId,
                language: tpl.language,
                starterCode: EntityMapper.decodeHtmlEntities(tpl.starterCode),
                wrapperCode: EntityMapper.decodeHtmlEntities(tpl.wrapperCode)
            })),
            problemTypes: Array.from(dto.problem_types?.values?.() || []).map(pt => ({
                id: pt.id,
                name: pt.name || pt.title
            })),

            // Interactions
            likesCount: dto.interactions?.likesCount || 0,
            isLiked: dto.interactions?.isLikedByMe || false,
            commentsCount: dto.interactions?.commentsCount || 0,

            availableLanguages: dto.availableLanguages,
            points: dto.points,
            isDraft: !!dto.isDraft
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
     * Consolidates mapping of publisher (author) and feature image.
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
            author: dto.publisher ? this.toUser(dto.publisher) : null,
            isDraft: !!dto.isDraft,
            type: dto.type || 'blog',
            projectRole: dto.project_role ? this.toProjectRole(dto.project_role) : null,
            project: dto.project ? this.toProject(dto.project) : null
        });
    }

    /**
     * Maps an ArticleDTO to ArticleEntity.
     * @param {ArticleDTO} dto
     * @returns {ArticleEntity|null}
     */
    static toArticle(dto) {
        if (!dto) return null;
        // console.log("dto", dto)
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
            commentsCount: dto.interactions?.commentsCount || dto.commentsCount || 0,
            rating: dto.interactions?.rating || { average: 0, count: 0 },
            myRating: dto.interactions?.myRating || 0,
            author: dto.author
                ? { username: dto.author.username, avatar: dto.author.avatar ? this.toMedia(dto.author.avatar) : null }
                : null,
            isDraft: !!dto.isDraft
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
            author: this.toUser(dto.author),
            isDraft: !!dto.isDraft
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

    /**
     * Maps a TestCaseDTO to TestCaseEntity.
     */
    static toTestCase(dto) {
        if (!dto) return null;
        return new TestCaseEntity({
            id: dto.id,
            documentId: dto.documentId,
            input: dto.input,
            expectedOutput: dto.expectedOutput,
            isHidden: dto.isHidden,
            order: dto.order,
            problemId: dto.problemId
        });
    }

    /**
     * Reverses HTML entity encoding (e.g. &amp;gt; to >) 
     * Ensures code blocks render perfectly regardless of backend security middleware configurations
     */
    static decodeHtmlEntities(text) {
        if (!text) return text;
        const entities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&#x2F;': '/'
        };
        return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, match => entities[match]);
    }

    /**
     * Maps a SubmissionDTO to SubmissionEntity.
     */
    static toSubmission(dto) {
        if (!dto) return null;
        return new SubmissionEntity({
            id: dto.id,
            uid: dto.documentId,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            code: EntityMapper.decodeHtmlEntities(dto.code),
            language: dto.language,
            verdict: dto.verdict,
            executionTime: dto.executionTime,
            memoryUsed: dto.memoryUsed,
            judgeOutput: dto.judgeOutput,
            testCasesPassed: dto.testCasesPassed,
            totalTestCases: dto.totalTestCases,
            problem: dto.problem,
            user: dto.user,
        });
    }

    /**
     * Maps a NotificationDTO to NotificationEntity.
     */
    static toNotification(dto) {
        console.log("dto", dto)
        if (!dto) return null;
        return new NotificationEntity({
            id: dto.id,
            uid: dto.documentId,
            type: dto.type,
            contentType: dto.contentType,
            contentDocId: dto.contentDocId,
            messageAr: dto.messageAr,
            messageEn: dto.messageEn,
            actionUrl: dto.actionUrl,
            extra: dto.extra,
            read: dto.read,
            createdAt: dto.createdAt,
            actor: this.toUser(dto.actor)
        });
    }

    /**
     * Maps a ProjectDTO to ProjectEntity
     */
    static toProject(dto) {
        if (!dto) return null;
        return new ProjectEntity({
            id: dto.id,
            uid: dto.documentId,
            title: dto.title,
            description: dto.description,
            methodology: dto.methodology,
            status: dto.status,
            visibility: dto.visibility,
            githubRepoUrl: dto.github_repo_url,
            githubRepoId: dto.github_repo_id,
            engagementScore: dto.engagement_score,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            publisher: this.toUser(dto.publisher),
            roles: Array.isArray(dto.project_roles || dto.roles) ? (dto.project_roles || dto.roles).map(r => this.toProjectRole(r)) : [],
            members: Array.isArray(dto.project_members || dto.members) ? (dto.project_members || dto.members).map(m => this.toProjectMember(m)) : [],
            sprints: Array.isArray(dto.sprints) ? dto.sprints.map(s => this.toSprint(s)) : [],
            wikiDocs: dto.wiki_docs,
            architectureDiagram: dto.architecture_diagram
        });
    }

    /**
     * Maps a ProjectRoleDTO to ProjectRoleEntity
     */
    static toProjectRole(dto) {
        if (!dto) return null;
        return new ProjectRoleEntity({
            id: dto.id,
            uid: dto.documentId,
            customLabel: dto.custom_label,
            permissions: dto.permissions,
            isOpen: dto.is_open,
            requiredLevel: dto.required_level,
            slots: dto.slots,
            jobTitleTag: this.toJobTitleTag(dto.job_title_tag)
        });
    }

    /**
     * Maps a ProjectMemberDTO to ProjectMemberEntity
     */
    static toProjectMember(dto) {
        if (!dto) return null;
        return new ProjectMemberEntity({
            id: dto.id,
            uid: dto.documentId,
            user: this.toUser(dto.user),
            projectRole: this.toProjectRole(dto.project_role),
            githubUsername: dto.github_username,
            isActive: dto.is_active,
            joinedAt: dto.joined_at
        });
    }

    /**
     * Maps a ProjectApplicationDTO to ProjectApplicationEntity
     */
    static toProjectApplication(dto) {
        if (!dto) return null;
        return new ProjectApplicationEntity({
            id: dto.id,
            uid: dto.documentId,
            type: dto.type,
            status: dto.status,
            message: dto.message,
            createdAt: dto.createdAt,
            user: this.toUser(dto.user),
            project: this.toProject(dto.project),
            projectRole: this.toProjectRole(dto.project_role)
        });
    }

    /**
     * Maps a JobTitleTagDTO to JobTitleTagEntity
     */
    static toJobTitleTag(dto) {
        if (!dto) return null;
        return new JobTitleTagEntity({
            id: dto.id,
            uid: dto.documentId,
            slug: dto.slug,
            labelAr: dto.label_ar,
            labelEn: dto.label_en,
            category: dto.category
        });
    }

    /**
     * Maps a TaskDTO to TaskEntity
     */
    static toTask(dto) {
        if (!dto) return null;
        return new TaskEntity({
            id: dto.id,
            uid: dto.documentId,
            title: dto.title,
            description: dto.description,
            status: dto.status,
            priority: dto.priority,
            branchPattern: dto.branch_pattern,
            githubPrId: dto.github_pr_id,
            ciStatus: dto.ci_status,
            lastCommitSha: dto.last_commit_sha,
            prUrl: dto.pr_url,
            prTitle: dto.pr_title,
            order: dto.order,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            assignee: this.toProjectMember(dto.assignee),
            sprint: this.toSprint(dto.sprint),
            projectId: dto.projectId,
            taskType: dto.task_type,
            layerId: dto.layer_id,
            stage: dto.stage,
            checkpointId: dto.checkpoint?.documentId || (typeof dto.checkpoint === 'string' ? dto.checkpoint : null),
            checkpoint: dto.checkpoint ? (typeof dto.checkpoint === 'object' ? this.toCheckpoint(dto.checkpoint) : null) : null
        });
    }


    /**
     * Maps a CheckpointDTO to CheckpointEntity
     */
    static toCheckpoint(dto) {
        if (!dto) return null;
        return new CheckpointEntity({
            id: dto.id,
            uid: dto.documentId,
            name: dto.name,
            stage: dto.stage,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
            sprint: this.toSprint(dto.sprint),
            tasks: Array.isArray(dto.tasks) ? dto.tasks.map(t => this.toTask(t)).filter(Boolean) : [],
            projectId: dto.projectId
        });
    }

    /**
     * Maps a SprintDTO to SprintEntity
     */
    static toSprint(dto) {
        if (!dto) return null;
        return new SprintEntity({
            id: dto.id,
            uid: dto.documentId,
            number: dto.number,
            goal: dto.goal,
            status: dto.status,
            startDate: dto.start_date,
            endDate: dto.end_date,
            retrospectiveNotes: dto.retrospective_notes,
            projectId: dto.projectId
        });
    }

    /**
     * Maps a JobAdDTO to JobAdEntity
     */
    static toJobAd(dto) {
        if (!dto) return null;
        return new JobAdEntity({
            roleId: dto.role_id,
            roleUid: dto.role_documentId,
            jobTitle: dto.job_title,
            customLabel: dto.custom_label,
            requiredLevel: dto.required_level,
            slots: dto.slots,
            isMatched: dto.is_matched,
            hasApplied: dto.has_applied,
            project: dto.project ? {
                uid: dto.project.documentId,
                title: dto.project.title,
                methodology: dto.project.methodology,
                status: dto.project.status,
                publisher: dto.project.publisher ? {
                    uid: dto.project.publisher.documentId,
                    username: dto.project.publisher.username
                } : null
            } : null
        });
    }

    /**
     * Maps a WorkspaceItemDTO to WorkspaceItemEntity
     */
    static toWorkspaceItem(dto) {
        if (!dto) return null;
        return new WorkspaceItemEntity({
            id: dto.id,
            uid: dto.documentId,
            projectId: dto.projectId,
            projectMemberId: dto.project_member,
            type: dto.type,
            title: dto.title,
            content: dto.content,
            status: dto.status,
            linkedTaskId: dto.linked_task?.documentId || dto.linked_task,
            linkedTask: this.toTask(dto.linked_task)
        });
    }

    /**
     * Maps a ReviewRequestDTO to ReviewRequestEntity
     */
    static toReviewRequest(dto) {
        if (!dto) return null;
        return new ReviewRequestEntity({
            id: dto.id,
            uid: dto.documentId,
            projectId: dto.projectId,
            taskId: dto.task?.documentId || dto.task,
            task: this.toTask(dto.task),
            workspaceItemId: dto.workspace_item?.documentId || dto.workspace_item,
            workspaceItem: this.toWorkspaceItem(dto.workspace_item),
            externalLink: dto.external_link,
            requesterId: dto.requester?.documentId || dto.requester,
            requester: this.toProjectMember(dto.requester),
            reviewerId: dto.reviewer?.documentId || dto.reviewer,
            reviewer: this.toProjectMember(dto.reviewer),
            status: dto.status,
            message: dto.message,
            feedback: dto.feedback,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        });
    }
}
