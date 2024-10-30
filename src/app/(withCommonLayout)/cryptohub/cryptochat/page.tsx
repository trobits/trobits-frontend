"use client"
import TopicsCard from '@/components/Cryptohub/TopicsCard';
import { ITopicInfo } from '@/components/Cryptohub/Types';
import { LoadingAnimation } from '@/components/LoadingAnimation/LoadingAnimation';
import React, { useEffect, useState } from 'react';

const CryptoChatPage = () => {
  const [ topicsInfo, setTopicsInfo ] = useState<ITopicInfo[]>([]); 
  const [ loading, setLoading ] = useState<boolean>(true); 

  useEffect(() => {
    const fetchTopicsData = async () => {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        setTopicsInfo(data); 
      } catch (error) {
        console.error("Error fetching topics data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchTopicsData();
  }, []); 

  if (loading) {
    return <LoadingAnimation />; 
  }

  return (
    <div className='flex flex-wrap justify-center w-full gap-4'>
      {topicsInfo.map((topic) => (
        <TopicsCard key={topic.id} topicInfo={topic} />
      ))}
    </div>
  );
};

export default CryptoChatPage;
