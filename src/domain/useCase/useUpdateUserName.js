import { useAsyncUseCase } from './useAsyncUseCase';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../infrastructure/store/authSlice';
import { UserDTO } from '../../infrastructure/DTO/UserDTO';
import { EntityMapper } from '../../domain/mapper/EntityMapper';
import { UpdateUserRequest } from '../../infrastructure/DTO/Request/UpdateUserRequest';

/**
 * useUpdateUserName: Orchestrates updating the user's first and last names.
 * Maps the result to a UserEntity for UI consistency.
 */
export const useUpdateUserName = () => {
    const dispatch = useDispatch();
    const userRepo = useMemo(() => new UserRepository(), []);

    const { execute, inProgress, error } = useAsyncUseCase(
        async (userId, { firstname, lastname }) => {
            if (!userId) throw new Error("Synchronization context lost.");

            const requestDto = new UpdateUserRequest({ firstname, lastname });
            const updatedUserRaw = await userRepo.updateUser(userId, requestDto.toPayload());

            if (updatedUserRaw) {
                // Normalize to UserEntity to ensure absolute URLs and structural consistency
                const userDto = new UserDTO(updatedUserRaw);
                const userEntity = EntityMapper.toUser(userDto);
                
                dispatch(setUserData(userEntity));
                return userEntity;
            }

            return null;
        }
    );

    return {
        updateName: execute,
        isUpdating: inProgress,
        updateError: error
    };
};
