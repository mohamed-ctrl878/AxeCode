import React from 'react';
import { Card, Typography, Button, Tag, Space, Divider, Row, Col } from 'antd';
import { FireOutlined, TeamOutlined, ControlOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

export const JobAdCard = ({ jobAd }) => {
    if (!jobAd) return null;

    return (
        <Card 
            hoverable
            style={{ 
                marginBottom: '20px', 
                borderLeft: '4px solid #1890ff', // Distinct brand color for Job Ads
                background: 'linear-gradient(180deg, #1f1f1f 0%, #141414 100%)' 
            }}
            bodyStyle={{ padding: '20px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Tag color="blue" icon={<FireOutlined />} style={{ marginBottom: '10px' }}>
                        PROJECT OPPORTUNITY
                    </Tag>
                    <Title level={4} style={{ margin: 0 }}>
                        {jobAd.customLabel || jobAd.jobTitle?.labelEn || 'Open Role'}
                    </Title>
                    <Text type="secondary">
                        at <Text strong style={{ color: '#fff' }}>{jobAd.project?.title}</Text>
                    </Text>
                </div>
                {jobAd.isMatched && (
                    <Tag color="success" icon={<CheckCircleOutlined />}>Matches Your Profile</Tag>
                )}
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Row gutter={[16, 16]}>
                <Col span={24} md={16}>
                    <Space direction="vertical" size="small">
                        <div>
                            <Text type="secondary">Experience Level: </Text>
                            <Tag>{jobAd.requiredLevel?.toUpperCase()}</Tag>
                        </div>
                        <div>
                            <Text type="secondary">Project Methodology: </Text>
                            <Tag icon={<ControlOutlined />}>{jobAd.project?.methodology}</Tag>
                        </div>
                        <div>
                            <Text type="secondary">Available Slots: </Text>
                            <Tag icon={<TeamOutlined />}>{jobAd.slots}</Tag>
                        </div>
                    </Space>
                </Col>
                
                <Col span={24} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {jobAd.hasApplied ? (
                        <Button block disabled type="dashed">
                            Application Submitted
                        </Button>
                    ) : (
                        <Link to={`/projects/${jobAd.project?.uid}`}>
                            <Button type="primary" block size="large">
                                View & Apply
                            </Button>
                        </Link>
                    )}
                </Col>
            </Row>
        </Card>
    );
};
