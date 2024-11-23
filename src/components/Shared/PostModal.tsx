/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCreatePostMutation } from '@/redux/features/api/postApi';
import { useAppSelector } from '@/redux/hooks';
import { Images } from 'lucide-react';
import Image from 'next/image';
import { useState, FC, ChangeEvent, FormEvent } from 'react';
import toast from 'react-hot-toast';
import AnimatedButton from './AnimatedButton';
import AuthGuard from '../Auth/AuthGuard';

interface ModalProps {
    topicId: string;
    isOpen: boolean;
    onClose: () => void;
}

const PostModal: FC<ModalProps> = ({ topicId, isOpen, onClose }) => {
    const [ postContent, setPostContent ] = useState<string>('');
    const [ selectedFile, setSelectedFile ] = useState<File | null>(null);
    const [ imagePreview, setImagePreview ] = useState<string | null>(null);
    const user = useAppSelector((state) => state.auth.user)
    const [ createPost, { isLoading: createPostLoading } ] = useCreatePostMutation();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[ 0 ];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePostSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please Login first!")
            return;
        }
        const formData = new FormData();
        formData.append("authorId", user?.id);
        formData.append("topicId", topicId);
        formData.append("content", postContent);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }
        const createPostLoadingToast = toast.loading("new post creating ...")
        try {
            const response = await createPost(formData);
            if (response.error) {
                toast.error("Failed to create a new post!")
                return
            }
            toast.success("New post created successfully!")
        } catch (error) {
        } finally {
            toast.dismiss(createPostLoadingToast)
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AuthGuard>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-gray-800 w-full max-w-lg p-6 rounded-lg text-white relative">
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-white"
                        onClick={onClose}
                        aria-label="Close Modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h3 className="text-lg font-semibold mb-4">Write Your Post</h3>
                    <form onSubmit={handlePostSubmit} className="border border-gray-600 rounded-lg p-3 mb-4 bg-gray-700">
                        <textarea
                            placeholder="Write your topic here..."
                            className="w-full bg-transparent border-none focus:outline-none resize-none h-20 text-white"
                            value={postContent}
                            name='textContent'
                            required
                            onChange={(e) => setPostContent(e.target.value)}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <label htmlFor="fileInput" className="cursor-pointer text-gray-400 hover:text-white flex items-center">
                                <Images />
                                <input
                                    id="fileInput"
                                    name='fileInput'
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>


                            <button
                                type='submit'
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1 rounded-lg"
                            >
                                {createPostLoading ? <AnimatedButton className=' w-full px-10 py-5' loading={createPostLoading} /> : "Send"}
                            </button>


                        </div>
                    </form>
                    {imagePreview && (
                        <div className="mt-4 flex items-center">
                            <p className="text-sm text-gray-400 mr-4">Selected file:</p>
                            <Image
                                className="w-16 h-16 object-cover rounded-lg border border-gray-500"
                                src={imagePreview}
                                height={300}
                                width={300}
                                alt="Selected Preview"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
};

export default PostModal;
