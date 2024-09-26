import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category {
  'id' : CategoryId,
  'name' : string,
  'description' : string,
}
export type CategoryId = bigint;
export interface Comment {
  'id' : CommentId,
  'content' : string,
  'createdAt' : Time,
  'author' : Principal,
  'postId' : PostId,
}
export type CommentId = bigint;
export interface Post {
  'id' : PostId,
  'categoryId' : CategoryId,
  'title' : string,
  'content' : string,
  'createdAt' : Time,
  'author' : Principal,
}
export type PostId = bigint;
export type Time = bigint;
export interface _SERVICE {
  'addCategory' : ActorMethod<[string, string], CategoryId>,
  'addComment' : ActorMethod<[PostId, string], CommentId>,
  'addPost' : ActorMethod<[CategoryId, string, string], PostId>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getComments' : ActorMethod<[PostId], Array<Comment>>,
  'getPosts' : ActorMethod<[CategoryId], Array<Post>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
