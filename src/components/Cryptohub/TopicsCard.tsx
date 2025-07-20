import React from "react";
import Image from "next/image";
import { ITopicInfo } from "./Types";
import Link from "next/link";
import { MessageCircle, ArrowUpRight } from "lucide-react";

interface TopicsCardProps {
  topicInfo: ITopicInfo;
}

const TopicsCard: React.FC<TopicsCardProps> = ({ topicInfo }) => {
  console.log("Topic ID:", topicInfo.id);

  return (
    <Link href={`/cryptohub/cryptochat/${topicInfo.id}`}>
      <div className="group bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 h-full hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-300 cursor-pointer">
        {/* Topic Image */}
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <Image
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/topic_${topicInfo.id}.jpg`}
            alt={topicInfo.title}
            height={300}
            width={600}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2">
              {topicInfo?.title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-all duration-200 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
            {topicInfo?.description?.length > 120
              ? topicInfo.description.slice(0, 120) + "..."
              : topicInfo.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MessageCircle className="w-3 h-3" />
              <span>Discussion</span>
            </div>

            {/* Topic Indicator */}
            <div className="w-2 h-2 bg-cyan-400 rounded-full group-hover:bg-cyan-300 transition-colors duration-200" />
          </div>
        </div>

        {/* Subtle hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
};

export default TopicsCard;
