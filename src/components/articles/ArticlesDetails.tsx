/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import {
  useGetSingleArticleQuery,
  useLikeToggleMutation,
} from "@/redux/features/api/articleApi";
import Image from "next/image";
import Loading from "../Shared/Loading";
import DummyImage from "@/assets/dummy-blog.png";
import { Article } from "@/app/(withCommonLayout)/articles/page";
import { HeartIcon } from "lucide-react";
import PostCommentCard from "../Post/PostCommentCard";
import { FormEvent, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { IUser } from "../Cryptohub/Types";
import toast from "react-hot-toast";
import { useCreateCommentMutation } from "@/redux/features/api/postApi";
import { Button } from "../ui/button";

function ArticleDetailsPage({ articleId }: { articleId: string }) {
  const { data: articleData, isLoading: articleLoading } =
    useGetSingleArticleQuery(articleId);
  const user: IUser | null = useAppSelector((state) => state.auth.user);
  const [toggleLikeMutation, { isLoading: toggleLikeLoading }] =
    useLikeToggleMutation();

  const article: Article | undefined = articleData?.data;

  // State for optimistic updates
  const [likeCount, setLikeCount] = useState(article?.likeCount || 0);
  const [likers, setLikers] = useState<string[]>(article?.likers || []);

  const [newComment, setNewComment] = useState("");
  const [createComment, { isLoading: createCommentLoading }] =
    useCreateCommentMutation();

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("Please Login first!");
      return;
    }

    const userId = user.id;
    const isLiked = likers.includes(userId);

    // Optimistically update the UI
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setLikers((prev) =>
      isLiked ? prev.filter((id) => id !== userId) : [...prev, userId]
    );

    try {
      await toggleLikeMutation({ authorId: userId, id: article?.id });
    } catch (error: any) {
      // Rollback on failure
      toast.error("Failed to update like status.");
      setLikeCount(article?.likeCount || 0); // Revert to original count
      setLikers(article?.likers || []); // Revert to original likers
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please Login first!");
      return;
    }
    try {
      if (newComment.trim()) {
        const response = await createComment({
          authorId: user.id,
          content: newComment.trim(),
          articleId: article?.id,
        });

        if (response?.error) {
          toast.error("Failed to create a new comment! Try again.");
        } else {
          toast.success("Comment added successfully.");
          setNewComment(""); // Clear the input
        }
      }
    } catch {
      toast.error("Something went wrong! Try again.");
    }
  };

  if (articleLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <article className="max-w-5xl mx-auto bg-[#ffffffce] border-4 border-cyan-500 text-black tracking-wide leading-9 shadow-lg rounded-lg overflow-hidden">
        <div className="w-full flex justify-center">
          <div className="relative w-[40rem] h-[20rem] md:h-[25rem] mt-2 max-h-[30rem]">
            <Image
              src={article?.image || DummyImage}
              alt={article?.title || "Article image"}
              className="rounded-md border-4 border-cyan-600 p-1"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-600 text-center mb-6">
            {article?.title}
          </h1>

          {/* Article Content */}
          <div
            className="prose font-bold leading-9 max-w-none"
            dangerouslySetInnerHTML={{ __html: article?.content || "" }}
          />

          {/* Like Button */}
          <div className="flex justify-end mt-4">
            <Button
              disabled={toggleLikeLoading}
              className={`bg-cyan-700 px-8 flex items-center space-x-2 ${
                toggleLikeLoading ? "scale-110" : ""
              }`}
              onClick={handleLikeToggle}
            >
              <span>Like</span>
              <HeartIcon
                scale={2}
                size={12}
                fill={article?.likers?.includes(user?.id || "") ? "red" : ""}
                className="w-6 h-6 transform transition-transform duration-200"
              />
              <span>{article?.likeCount}</span>
            </Button>
          </div>

          {/* Comment Section */}
          <div className="bg-gray-800 rounded-xl p-6 mt-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>

            {/* Comment Input Section */}
            <form
              onSubmit={handleCommentSubmit}
              className="flex items-center gap-2 mb-6"
            >
              <input
                type="text"
                placeholder="Leave a comment..."
                value={newComment}
                required
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                {createCommentLoading ? "Sending..." : "Send"}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {article?.comments?.length && article?.comments?.length > 0 ? (
                article?.comments?.map((comment) => (
                  <PostCommentCard key={comment?.id} comment={comment} />
                ))
              ) : (
                <p className="text-gray-400">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </article>
      <div
        className="_0cbf1c3d417e250a"
        data-options="count=1,interval=1,burst=1"
        data-placement="7b3b9874f5764c699e7183abeecc123d"
        style={{ display: "none" }}
      ></div>
    </div>
  );
}

export default ArticleDetailsPage;
