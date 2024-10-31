

import React from "react";
import Image from "next/image";
import { ITopicInfo } from "./Types";
import Link from "next/link";
import { motion } from "framer-motion"; // Import framer-motion

// Now define the TopicsCard interface which accepts topicInfo prop
interface TopicsCardProps {
    topicInfo: ITopicInfo;
}

const TopicsCard: React.FC<TopicsCardProps> = ({ topicInfo }) => {
    return (
        <motion.div
            // Initial state for mounting (slightly smaller and moves up when it enters viewport)
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }} // Final state after animation
            transition={{ duration: 0.3, ease: "linear" }} // Smooth, linear transition for mounting effect
            whileInView={{ y: 0, opacity: 1 }} // Effect when coming into the viewport
            viewport={{ once: true }} // Trigger only once when the component comes into view
            whileHover={{ scale: 1.05 }} // Subtle hover effect to increase the card's size slightly
            className="bg-transparent mb-2 border-[1.5px] border-cyan-400 rounded-xl p-5 w-[400px]  text-white shadow-lg backdrop-blur-md transition-all duration-100 ease-linear"
        >
            <Link href={`/cryptohub/cryptochat/${topicInfo.id}`}>
                <div>
                    <div className="flex justify-between">
                        <p className="font-bold">
                            {topicInfo?.title}
                        </p>
                        <Link
                            className="text-cyan-400"
                            href={`/cryptohub/cryptochat/${topicInfo.id}`}
                        >
                            Details
                        </Link>
                    </div>

                    {topicInfo?.image && (
                        <div className="w-full mt-3">
                            <Image
                                className="w-full rounded-lg object-cover"
                                src={topicInfo?.image as string}
                                alt="image"
                                height={300}
                                width={300}
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
