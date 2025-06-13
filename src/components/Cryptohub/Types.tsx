import { StaticImageData } from "next/image";

// define user interface
export interface IUser {
    id: string;
    name: string;
    image: string | StaticImageData;
    follower: string[];
}

// define Like interface

export interface ILike {
    count: number;
    users: string[];
}

// define Comment interface
export interface IComment {
    id: string;
    content: string;
    createdAt: Date;
    author: IUser;
    like: number;
    dislikes: number;
}

// define post interface
export interface IPost {
    id: string;
    content: string;
    createdAt: Date;
    author: IUser;
    image?: string | StaticImageData;
    likes: ILike;
    comments: IComment[];
}

// define Topics interface
export interface ITopic {
    id: string;
    title: string;
    description: string;
    image: string;
    topicAuthor: string;
    createdAt: string;
    updatedAt: string;
}



// Define the type interface for each post
export interface ITopicPost {
    id: number;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | StaticImageData;
}

// Define the type interface
export interface ITopicInfo {
    id: string;
    title: string;
    description: string;
    posts: ITopicPost[];
    image?: string | StaticImageData;
}
