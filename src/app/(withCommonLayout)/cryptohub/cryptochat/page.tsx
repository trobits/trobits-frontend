/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import TopicsCard from '@/components/Cryptohub/TopicsCard';
import { ITopicInfo } from '@/components/Cryptohub/Types';
import Loading from '@/components/Shared/Loading';
import { useGetAllTopicQuery } from '@/redux/features/api/topicApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { usePathname } from 'next/navigation'
import { setPaths } from '@/redux/features/slices/authSlice'
import { MessageCircle, Users, TrendingUp } from 'lucide-react';

const CryptoChatPage = () => {
  const { data, isLoading: allTopicLoading } = useGetAllTopicQuery("");
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  if (typeof window !== "undefined") {
    if (previousPath !== "/cryptohub/cryptochat" && currentPath === "/cryptohub/cryptochat") {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }
  
  const allTopics = data?.data
  
  if (allTopicLoading) {
    return <Loading/>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">.
        
        {allTopics?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTopics.map((topic: ITopicInfo) => (
              <TopicsCard key={topic.id} topicInfo={topic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="space-y-4">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto" />
              <h3 className="text-2xl font-semibold text-gray-400">No Topics Found</h3>
              <p className="text-gray-500">Be the first to start a conversation!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoChatPage;