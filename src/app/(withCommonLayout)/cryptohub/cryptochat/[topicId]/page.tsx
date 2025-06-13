import TopicDetailsPage from '@/components/Cryptohub/TopicDetails';
import React from 'react'

interface PageProps {
    params: {
        topicId: string;
    }
}

const page = ({ params: { topicId } }: PageProps) => {
    return (
        <div>
            <TopicDetailsPage topicId={topicId} />
        </div>
    )
}

export default page
