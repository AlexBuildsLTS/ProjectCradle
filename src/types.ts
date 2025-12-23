import { ImageSourcePropType } from 'react-native';
import { NativeAppEventEmitter } from 'react-native';

export interface User {
  id: string;
  name: string;
  username: string;
  profileImage: ImageSourcePropType;
  numPosts: number;
  numFollowers: number;
  numFollowing: number;
  isFollowing: boolean;
}

export interface Post {
  id: string;
  user: User;
  image: ImageSourcePropType;
  numLikes: number;
  numComments: number;
  caption: string;
}
export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  user: User;
  post?: Post;
  timestamp: string;
}

export interface Message {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  users: User[];
  messages: Message[];
  lastMessage: Message;
}

export interface Story {
  id: string;
  user: User;
  image: ImageSourcePropType;
  timestamp: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ExploreCategory {
  id: string;
  name: string;
  image: ImageSourcePropType;
}

export interface ExplorePost {
  id: string;
  image: ImageSourcePropType;
  numLikes: number;
}

export interface SavedPost {
  id: string;
  post: Post;
  savedAt: string;
}

export interface User {
    id: string;
    name: string;
    username: string;
    profileImage: ImageSourcePropType;
    numPosts: number;
    numFollowers: number;
    numFollowing: number;
    isFollowing: boolean;
    }
export interface Post {
  id: string;
  user: User;
  image: ImageSourcePropType;
  numLikes: number;
  numComments: number;
  caption: string;
}
export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}   

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow";
  user: User;
  post?: Post;
  timestamp: string;
}   

export interface Message {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  users: User[];
  messages: Message[];
  lastMessage: Message;
}   