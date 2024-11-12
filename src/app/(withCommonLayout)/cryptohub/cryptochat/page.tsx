/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import TopicsCard from '@/components/Cryptohub/TopicsCard';
import { ITopicInfo } from '@/components/Cryptohub/Types';
import Loading from '@/components/Shared/Loading';
import { useGetAllTopicQuery } from '@/redux/features/api/topicApi';

const CryptoChatPage = () => {
  const { data, isLoading: allTopicLoading } = useGetAllTopicQuery("");
  const allTopics = data?.data
  if (allTopicLoading) {
    return <Loading/>
  }


  return (
    <div className='flex flex-wrap justify-center w-full gap-4'>
      {allTopics?.length?allTopics?.map((topic: ITopicInfo) => (
        <TopicsCard key={topic.id} topicInfo={topic} />
      ))
    :
    <div className=' font-bold text-white'>
      No Topics Found
    </div>
    }
    </div>
  );
};

export default CryptoChatPage;
