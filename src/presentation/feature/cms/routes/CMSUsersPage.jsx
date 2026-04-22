import React from 'react';
import { Users } from 'lucide-react';
import { useFetchAdminUsers } from '@domain/useCase/useFetchAdminUsers';
import { CMSResourceTable } from '../components/CMSResourceTable';

/**
 * CMSUsersPage: Admin page for User Management.
 */
const CMSUsersPage = () => {
    const { users, isLoading, reloadUsers, deleteUser } = useFetchAdminUsers();

    const tableItems = users.map(user => {
        const isConfirmed = user.confirmed === true;
        return {
            ...user,
            title: user.username || 'Unknown User',
            type: user.role?.name || 'User',
            createdAt: user.createdAt,
            isActive: isConfirmed,
            statusLabel: isConfirmed ? 'Confirmed' : 'Pending',
            statusStyles: isConfirmed 
                ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-900/30 text-amber-400 border-amber-500/30',
            metricValue: user.id // Using ID as the generic metric representation
        };
    });

    return (
        <CMSResourceTable 
            sectionName="Accounts" 
            items={tableItems} 
            columns={{ status: 'Account State', metric: 'User ID' }}
            isLoading={isLoading} 
            icon={Users} 
            onRefresh={reloadUsers}
            onDelete={deleteUser}
        />
    );
};

export default CMSUsersPage;
