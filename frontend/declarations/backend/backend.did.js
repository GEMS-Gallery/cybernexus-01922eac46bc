export const idlFactory = ({ IDL }) => {
  const CategoryId = IDL.Nat;
  const PostId = IDL.Nat;
  const CommentId = IDL.Nat;
  const Category = IDL.Record({
    'id' : CategoryId,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const Time = IDL.Int;
  const Comment = IDL.Record({
    'id' : CommentId,
    'content' : IDL.Text,
    'createdAt' : Time,
    'author' : IDL.Principal,
    'postId' : PostId,
  });
  const Post = IDL.Record({
    'id' : PostId,
    'categoryId' : CategoryId,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'createdAt' : Time,
    'author' : IDL.Principal,
  });
  return IDL.Service({
    'addCategory' : IDL.Func([IDL.Text, IDL.Text], [CategoryId], []),
    'addComment' : IDL.Func([PostId, IDL.Text], [CommentId], []),
    'addPost' : IDL.Func([CategoryId, IDL.Text, IDL.Text], [PostId], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getComments' : IDL.Func([PostId], [IDL.Vec(Comment)], ['query']),
    'getPosts' : IDL.Func([CategoryId], [IDL.Vec(Post)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
