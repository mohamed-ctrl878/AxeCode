export const MOCK_POST_DATA = {
    caption: "Test Post Caption",
    mediaIds: [1, 2],
    tagIds: [10, 20]
};

export const MOCK_BLOG_DATA = {
    description: "Test Blog Description",
    imageId: 5,
    tagIds: [30]
};

export const MOCK_LESSON_DATA = {
    title: "Test Lesson",
    type: "video",
    videoId: 100,
    description: "Test Lesson Description",
    weekId: 1
};

export const MOCK_COURSE_DATA = {
    title: "Test Course",
    description: "Test Course Description",
    price: 100
};

export const MOCK_API_RESPONSE = {
    data: {
        id: 1,
        attributes: {
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z"
        }
    }
};

export const MOCK_USER_DATA = {
    id: 1,
    username: "TestUser",
    email: "test@example.com",
    bio: "Test Bio",
    avatar: { url: "avatar.jpg" }
};

export const MOCK_AUTH_RESPONSE = {
    jwt: "fake-jwt-token",
    user: MOCK_USER_DATA
};

export const MOCK_LOGIN_CREDENTIALS = {
    identifier: "test@example.com",
    password: "password123"
};

export const MOCK_REGISTER_DATA = {
    username: "NewUser",
    email: "new@example.com",
    password: "password123"
};
export const MOCK_ARTICLE_DATA = {
    title: "Test Article",
    content: "Test Content",
    description: "Test Description",
    categoryId: 1
};

export const MOCK_EVENT_DATA = {
    title: "Test Event",
    description: "Test Event Description",
    date: "2024-05-01T10:00:00.000Z",
    platform: "Agora"
};

export const MOCK_PROBLEM_DATA = {
    title: "Test Problem",
    description: "Solve X",
    difficulty: "Easy",
    starterCode: "print('hello')"
};
export const MOCK_LIST_RESPONSE = [
    { ...MOCK_API_RESPONSE.data, id: 1 },
    { ...MOCK_API_RESPONSE.data, id: 2 }
];

export const MOCK_SEARCH_RESULTS = [
    { id: 1, attributes: { title: "Result 1" } },
    { id: 2, attributes: { title: "Result 2" } }
];
