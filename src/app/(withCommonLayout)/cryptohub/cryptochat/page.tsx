/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import TopicsCard from '@/components/Cryptohub/TopicsCard';
import { ITopic, ITopicInfo } from '@/components/Cryptohub/Types';
import { LoadingAnimation } from '@/components/LoadingAnimation/LoadingAnimation';
import Loading from '@/components/Shared/Loading';
import { useGetAllTopicQuery } from '@/redux/features/api/topicApi';
import React, { useEffect, useState } from 'react';

const CryptoChatPage = () => {
  const [ loading, setLoading ] = useState<boolean>(true);
  const { data, isLoading: allTopicLoading } = useGetAllTopicQuery("");
  const allTopics = data?.data
  console.log(data)
  if (allTopicLoading) {
    return <LoadingAnimation />
  }


  return (
    <div className='flex flex-wrap justify-center w-full gap-4'>
      {allTopics?.map((topic: ITopicInfo) => (
        <TopicsCard key={topic.id} topicInfo={topic} />
      ))}
    </div>
  );
};

export default CryptoChatPage;
