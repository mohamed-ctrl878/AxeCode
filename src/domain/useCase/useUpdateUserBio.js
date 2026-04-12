import { useAsyncUseCase } from './useAsyncUseCase';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../infrastructure/store/authSlice';
import { UserDTO } from '../../infrastructure/DTO/UserDTO';
import { EntityMapper } from '../../domain/mapper/EntityMapper';
import { UpdateUserRequest } from '../../infrastructure/DTO/Request/UpdateUserRequest';

/**
 * useUpdateUserBio: Handles updating the user's biography.
 * Refreshes local state on success.
 */
export const useUpdateUserBio = () => {
    const dispatch = useDispatch();
    const userRepo = useMemo(() => new UserRepository(), []);

    const { execute, inProgress, error } = useAsyncUseCase(
        async (userId, bio) => {
            if (!userId) throw new Error("Connection lost.");

            const requestDto = new UpdateUserRequest({ bio });
            const updatedUserRaw = await userRepo.updateUser(userId, requestDto.toPayload());

            if (updatedUserRaw) {
                // Normalize to UserEntity for UI consistency
                const userDto = new UserDTO(updatedUserRaw);
                const userEntity = EntityMapper.toUser(userDto);
                
                dispatch(setUserData(userEntity));
                return userEntity;
            }

            return null;
        }
    );

    return {
        updateBio: execute,
        isUpdating: inProgress,
        updateError: error
    };
};
