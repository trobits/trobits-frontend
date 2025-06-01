import React from "react";
import Image from "next/image";
import { ITopicInfo } from "./Types";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Clock } from "lucide-react";

interface TopicsCardProps {
    topicInfo: ITopicInfo;
}

const TopicsCard: React.FC<TopicsCardProps> = ({ topicInfo }) => {
    // Format date if available
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Recent';
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-gray-900/80 hover:border-gray-700/80 transition-all duration-500 hover:shadow-2xl hover:shadow-black/40"
        >
            <Link href={`/cryptohub/cryptochat/${topicInfo.id}`}>
                <div className="relative">
                    {/* Image Section */}
                    {topicInfo?.image && (
                        <div className="relative w-full h-48 overflow-hidden">
                            <Image
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                src={topicInfo.image}
                                alt={topicInfo.title || "Topic image"}
                                height={600}
                                width={600}
                            />
                            
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Floating badge */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-3 h-3 text-white" />
                                    <span className="text-xs text-white font-medium">Discussion</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white group-hover:text-gray-100 transition-colors duration-300 line-clamp-2 leading-snug">
                                    {topicInfo?.title}
                                </h3>
                            </div>
                            
                            {/* Details button */}
                            <div className="ml-4 flex items-center gap-1 text-white bg-white/10 px-3 py-1 rounded-full text-xs font-medium group-hover:bg-white group-hover:text-black transition-all duration-300">
                                <span>Details</span>
                                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                            {topicInfo?.description?.length > 80
                                ? topicInfo.description.slice(0, 80) + "..."
                                : topicInfo?.description || "Join the discussion about this topic"}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                            {/* Engagement indicators */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500">Discussion</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500">
                                        {formatDate(topicInfo?.createdAt || new Date().toISOString())}
                                    </span>
                                </div>
                            </div>

                            {/* Action indicator */}
                            <div className="w-6 h-6 bg-gray-800/50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-black transition-colors duration-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default TopicsCard;