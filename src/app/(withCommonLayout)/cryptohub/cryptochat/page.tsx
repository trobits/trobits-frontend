/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import TopicsCard from "@/components/Cryptohub/TopicsCard";
import { ITopicInfo } from "@/components/Cryptohub/Types";
import Loading from "@/components/Shared/Loading";
import { useGetAllTopicQuery } from "@/redux/features/api/topicApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { setPaths } from "@/redux/features/slices/authSlice";

const CryptoChatPage = () => {
  const { data, isLoading: allTopicLoading } = useGetAllTopicQuery("");
  const dispatch = useAppDispatch();
  const previousPath = useAppSelector((state) => state.auth.previousPath);
  const currentPath = useAppSelector((state) => state.auth.currentPath);
  const pathName = usePathname();

  if (window) {
    if (
      previousPath !== "/cryptohub/cryptochat" &&
      currentPath === "/cryptohub/cryptochat"
    ) {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }
  const allTopics = data?.data;
  if (allTopicLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-wrap justify-center w-full gap-4 pt-24 lg:pt-4">
      {allTopics?.length ? (
        allTopics?.map((topic: ITopicInfo) => (
          <TopicsCard key={topic.id} topicInfo={topic} />
        ))
      ) : (
        <div className=" font-bold text-white">No Topics Found</div>
      )}
    </div>
  );
};

export default CryptoChatPage;
