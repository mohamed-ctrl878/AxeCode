import { useState } from 'react';
import { BlogRepository } from '../../infrastructure/repository/BlogRepository';
import { UploadMediaRepository } from '../../infrastructure/repository/UploadMediaRepository';

/**
 * Custom hook to encapsulate the Blog Creation logic.
 * Coordinates uploading an image with progress, then creating the blog post itself.
 */
export const useCreateBlog = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const createBlog = async ({ description, imageFile, tags }) => {
        setLoading(true);
        setError(null);
        setUploadProgress(0);

        try {
            const blogRepo = new BlogRepository();
            const mediaRepo = new UploadMediaRepository();

            let imageId = null;

            // Step 1: Upload Image if provided
            if (imageFile) {
                // Tracking the progress directly here
                const uploadedMedia = await mediaRepo.uploadFilesWithProgress(imageFile, (progress) => {
                    setUploadProgress(progress);
                });

                if (uploadedMedia && uploadedMedia.length > 0) {
                    imageId = uploadedMedia[0].id; // Extracting the Strapi Media ID
                }
            }

            // Step 2: Construct request payload and create blog
            const blogData = {
                description,
                imageId, // Maps to `image` in BlogRequest
                tagIds: tags // Maps to `tags` in BlogRequest
            };

            const response = await blogRepo.create(blogData);
            return response;
        } catch (err) {
            console.error("Failed to create blog:", err);
            setError(err.message || 'An error occurred while creating the blog.');
            throw err;
        } finally {
            setLoading(false);
            setUploadProgress(0); // Reset for the next time
        }
    };

    return {
        createBlog,
        loading,
        error,
        uploadProgress
    };
};

export default useCreateBlog;
