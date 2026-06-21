import { useCallback, useMemo } from 'react';
import { useAsyncUseCase } from '../useAsyncUseCase';
import { RecommendationRepository } from '@infrastructure/repository/RecommendationRepository';
import { EntityMapper } from '../../mapper/EntityMapper';

export const useFetchJobAds = () => {
    const repository = useMemo(() => new RecommendationRepository(), []);

    const fetchLogic = useCallback(async () => {
        const result = await repository.getJobAds(4); // limit 4
        return Array.isArray(result) 
            ? result.map(dto => EntityMapper.toJobAd(dto)).filter(Boolean)
            : [];
    }, [repository]);

    const { execute: fetchJobAds, returnedData: jobAds, inProgress: loading, error } = useAsyncUseCase(fetchLogic);

    return {
        fetchJobAds,
        jobAds,
        loading,
        error
    };
};
