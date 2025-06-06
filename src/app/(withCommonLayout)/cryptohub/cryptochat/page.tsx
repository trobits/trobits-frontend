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

  if (typeof window !== "undefined") {
    if (
      previousPath !== "/cryptohub/cryptochat" &&
      currentPath === "/cryptohub/cryptochat"
    ) {
      dispatch(setPaths(pathName));
      window.location.reload();
    }
  }

  const allTopics = data?.data || [];

  // Dummy topics for testing
  const dummyTopics: ITopicInfo[] = [
    {
      id: "dummy-1",
      title: "Test Topic One",
      description: "This is a dummy topic for testing purposes.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: "test-topic-one",
    },
    {
      id: "dummy-2",
      title: "Test Topic Two",
      description: "Another test topic just for layout check.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: "test-topic-two",
    },
    {
      id: "dummy-3",
      title: "Test Topic Three",
      description: "Final dummy topic for now.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: "test-topic-three",
    },
    {
      id: "dummy-4",
      title: "Test Topic Four",
      description: "Final dummy topic for now.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slug: "test-topic-four",
    },
  ];

  const allRenderedTopics = [...allTopics, ...dummyTopics];

  if (allTopicLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen overflow-y-auto w-full bg-transparent">
      <div className="flex flex-wrap justify-center w-full gap-8 pt-24 lg:pt-4">
        {allRenderedTopics.length ? (
          allRenderedTopics.map((topic: ITopicInfo) => (
            <div
              key={topic.id}
              className="transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_25px_4px_rgba(59,130,246,0.5)] hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10 rounded-3xl shadow-[0_0_15px_2px_rgba(59,130,246,0.2)] border border-gray-600/40"
            >
              <TopicsCard topicInfo={topic} />
            </div>
          ))
        ) : (
          <div className="font-bold text-white">No Topics Found</div>
        )}
      </div>
    </div>
  );
};

export default CryptoChatPage;
