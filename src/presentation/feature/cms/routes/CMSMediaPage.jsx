import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useFetchAdminMedia } from '@domain/useCase/useFetchAdminMedia';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSMediaPage: Admin page for Media Management.
 */
const CMSMediaPage = () => {
    const { mediaFiles, isLoading, reloadMedia, deleteMediaFile } = useFetchAdminMedia();

    const tableItems = mediaFiles.map(file => ({
        ...file,
        title: file.name || 'Unknown File',
        type: file.mime || 'Media',
        createdAt: file.createdAt,
        isActive: true, // Files don't have draft states
        statusLabel: 'Hosted',
        statusStyles: 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30',
        metricValue: `${(file.size / 1024).toFixed(1)} KB`
    }));

    return (
        <CMSResourceTable 
            sectionName="Media" 
            items={tableItems} 
            columns={{ status: 'Storage', metric: 'File Size' }}
            isLoading={isLoading} 
            icon={ImageIcon} 
            onRefresh={reloadMedia}
            onDelete={deleteMediaFile}
        />
    );
};

export default CMSMediaPage;
