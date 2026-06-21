import React, { useEffect, useState } from 'react';
import { Select, Button, Typography, Tag, Space, Spin, Alert } from 'antd';
import { useJobTitleTags } from '@domain/useCase/project/useJobTitleTags';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const JobTitleSettings = () => {
    const { 
        fetchTags, tags, loadingTags, 
        fetchMyTitles, myTitles, loadingMyTitles, 
        addMyTitle, isAdding, 
        removeMyTitle, isRemoving 
    } = useJobTitleTags();

    const [selectedTagId, setSelectedTagId] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('junior');

    useEffect(() => {
        fetchTags();
        fetchMyTitles();
    }, [fetchTags, fetchMyTitles]);

    const handleAdd = async () => {
        if (!selectedTagId || !selectedLevel) return;
        await addMyTitle(selectedTagId, selectedLevel);
        setSelectedTagId(null);
        fetchMyTitles(); // Refresh list
    };

    const handleRemove = async (tagId) => {
        await removeMyTitle(tagId);
        fetchMyTitles(); // Refresh list
    };

    if (loadingTags || loadingMyTitles) return <Spin style={{ display: 'block', margin: '20px auto' }} />;

    return (
        <div style={{ maxWidth: '600px', background: '#141414', padding: '24px', borderRadius: '12px' }}>
            <Title level={4}>Professional Identity Tags</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
                Adding tags helps our recommendation engine match you with the right Project Roles and Kanban tasks.
            </Text>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Select
                    showSearch
                    placeholder="Select a Job Title"
                    optionFilterProp="children"
                    onChange={(val) => setSelectedTagId(val)}
                    value={selectedTagId}
                    style={{ flex: 1 }}
                    options={(tags || []).map(t => ({
                        value: t.id,
                        label: t.labelEn
                    }))}
                />
                
                <Select
                    placeholder="Level"
                    onChange={(val) => setSelectedLevel(val)}
                    value={selectedLevel}
                    style={{ width: '120px' }}
                    options={[
                        { value: 'junior', label: 'Junior' },
                        { value: 'mid', label: 'Mid' },
                        { value: 'senior', label: 'Senior' }
                    ]}
                />

                <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleAdd}
                    loading={isAdding}
                    disabled={!selectedTagId}
                >
                    Add
                </Button>
            </div>

            <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Your Current Tags:</Text>
                {(!myTitles || myTitles.length === 0) && (
                    <Alert message="No tags added yet. Add tags to get project recommendations." type="info" showIcon />
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(myTitles || []).map(junction => (
                        <Tag 
                            key={junction.id} 
                            closable 
                            onClose={(e) => {
                                e.preventDefault();
                                handleRemove(junction.id);
                            }}
                            color="blue"
                            style={{ padding: '4px 10px', fontSize: '14px' }}
                        >
                            {junction.job_title_tag?.labelEn} ({junction.experience_level})
                        </Tag>
                    ))}
                </div>
            </Space>
        </div>
    );
};
