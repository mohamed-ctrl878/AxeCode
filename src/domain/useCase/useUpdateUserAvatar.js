import { useAsyncUseCase } from './useAsyncUseCase';
import { MediaRepository } from '../../infrastructure/repository/MediaRepository';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../infrastructure/store/authSlice';
import { UserDTO } from '../../infrastructure/DTO/UserDTO';
import { EntityMapper } from '../../domain/mapper/EntityMapper';
import { UpdateUserRequest } from '../../infrastructure/DTO/Request/UpdateUserRequest';

/**
 * useUpdateUserAvatar: Orchestrates uploading an avatar and updating the user profile.
 * Standardizes the updated user data via UserDTO and refreshes the Redux store.
 */
export const useUpdateUserAvatar = () => {
    const dispatch = useDispatch();
    const mediaRepo = useMemo(() => new MediaRepository(), []);
    const userRepo = useMemo(() => new UserRepository(), []);
    const [progress, setProgress] = useState(0);

    const { execute, inProgress, error } = useAsyncUseCase(
        async (userId, file) => {
            if (!userId) throw new Error("User context lost.");
            if (!file) throw new Error("No file selected.");

            setProgress(0);

            // 1. Upload to Media Library with progress tracking
            const uploadedIds = await mediaRepo.uploadFiles([file], (p) => {
                setProgress(p);
            });
            if (!uploadedIds || uploadedIds.length === 0) {
                throw new Error("Cloud synchronization failed during upload.");
            }
            const imageId = uploadedIds[0];

            // 2. Link Avatar to User
            const requestDto = new UpdateUserRequest({ avatar: imageId });
            const updatedUserRaw = await userRepo.updateUser(userId, requestDto.toPayload());

            if (updatedUserRaw) {
                // 3. Normalize to UserEntity to ensure correct UI rendering (absolute URLs, etc.)
                const userDto = new UserDTO(updatedUserRaw);
                const userEntity = EntityMapper.toUser(userDto);
                
                dispatch(setUserData(userEntity));
                return userEntity;
            }

            return null;
        }
    );

    return {
        updateAvatar: execute,
        isUpdating: inProgress,
        updateError: error,
        progress
    };
};
