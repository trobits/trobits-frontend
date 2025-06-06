import React from "react";
import Image from "next/image";
import { ITopicInfo } from "./Types";
import Link from "next/link";
import { motion } from "framer-motion";

interface TopicsCardProps {
  topicInfo: ITopicInfo;
}

const TopicsCard: React.FC<TopicsCardProps> = ({ topicInfo }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "linear" }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="group bg-transparent mb-2 border-[1.5px] border-gray-600/40 rounded-3xl p-5 w-[400px] text-white shadow-lg backdrop-blur-md transition-all duration-100 ease-linear"
    >
      <Link href={`/cryptohub/cryptochat/${topicInfo.id}`}>
        <div>
          <div className="flex justify-between items-center">
            <p className="font-bold text-white group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 ease-in-out">
              {topicInfo?.title}
            </p>
            <span className="text-cyan-400">Details</span>
          </div>

          {topicInfo?.image && (
            <div className="w-full mt-3">
              <Image
                className="w-full h-64 rounded-lg object-cover"
                src={topicInfo?.image}
                alt="image"
                height={600}
                width={600}
              />
            </div>
          )}

          <p className="text-sm font-bold mt-3">
            {topicInfo?.description?.length < 60
              ? topicInfo.description
              : topicInfo?.description.slice(0, 60) + "..."}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default TopicsCard;
