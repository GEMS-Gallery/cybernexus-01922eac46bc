import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    // Define types
    type CategoryId = Nat;
    type PostId = Nat;
    type CommentId = Nat;

    type Category = {
        id: CategoryId;
        name: Text;
        description: Text;
    };

    type Post = {
        id: PostId;
        categoryId: CategoryId;
        title: Text;
        content: Text;
        author: Principal;
        createdAt: Time.Time;
    };

    type Comment = {
        id: CommentId;
        postId: PostId;
        content: Text;
        author: Principal;
        createdAt: Time.Time;
    };

    // Stable variables for persistence
    stable var nextCategoryId: CategoryId = 0;
    stable var nextPostId: PostId = 0;
    stable var nextCommentId: CommentId = 0;

    stable var categoriesEntries: [(CategoryId, Category)] = [];
    stable var postsEntries: [(PostId, Post)] = [];
    stable var commentsEntries: [(CommentId, Comment)] = [];

    // Create HashMaps from stable variables
    let categories = HashMap.fromIter<CategoryId, Category>(categoriesEntries.vals(), 10, Nat.equal, Nat.hash);
    let posts = HashMap.fromIter<PostId, Post>(postsEntries.vals(), 10, Nat.equal, Nat.hash);
    let comments = HashMap.fromIter<CommentId, Comment>(commentsEntries.vals(), 10, Nat.equal, Nat.hash);

    // Category functions
    public func addCategory(name: Text, description: Text) : async CategoryId {
        let id = nextCategoryId;
        let category: Category = {
            id;
            name;
            description;
        };
        categories.put(id, category);
        nextCategoryId += 1;
        id
    };

    public query func getCategories() : async [Category] {
        Iter.toArray(categories.vals())
    };

    // Post functions
    public shared(msg) func addPost(categoryId: CategoryId, title: Text, content: Text) : async PostId {
        let id = nextPostId;
        let post: Post = {
            id;
            categoryId;
            title;
            content;
            author = msg.caller;
            createdAt = Time.now();
        };
        posts.put(id, post);
        nextPostId += 1;
        id
    };

    public query func getPosts(categoryId: CategoryId) : async [Post] {
        Iter.toArray(
            Iter.filter(posts.vals(), func (post: Post) : Bool {
                post.categoryId == categoryId
            })
        )
    };

    // Comment functions
    public shared(msg) func addComment(postId: PostId, content: Text) : async CommentId {
        let id = nextCommentId;
        let comment: Comment = {
            id;
            postId;
            content;
            author = msg.caller;
            createdAt = Time.now();
        };
        comments.put(id, comment);
        nextCommentId += 1;
        id
    };

    public query func getComments(postId: PostId) : async [Comment] {
        Iter.toArray(
            Iter.filter(comments.vals(), func (comment: Comment) : Bool {
                comment.postId == postId
            })
        )
    };

    // System functions for upgrades
    system func preupgrade() {
        categoriesEntries := Iter.toArray(categories.entries());
        postsEntries := Iter.toArray(posts.entries());
        commentsEntries := Iter.toArray(comments.entries());
    };

    system func postupgrade() {
        categoriesEntries := [];
        postsEntries := [];
        commentsEntries := [];
    };
}
