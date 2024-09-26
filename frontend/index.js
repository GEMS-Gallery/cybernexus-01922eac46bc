import { backend } from 'declarations/backend';

let currentCategoryId = null;
let currentPostId = null;

async function loadCategories() {
    const categories = await backend.getCategories();
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category.name;
        li.onclick = () => loadPosts(category.id, category.name);
        categoryList.appendChild(li);
    });
}

async function loadPosts(categoryId, categoryName) {
    currentCategoryId = categoryId;
    const posts = await backend.getPosts(categoryId);
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';
    document.getElementById('category-title').textContent = categoryName;
    posts.forEach(post => {
        const li = document.createElement('li');
        li.textContent = post.title;
        li.onclick = () => loadPostDetail(post);
        postList.appendChild(li);
    });
    document.getElementById('categories').style.display = 'none';
    document.getElementById('posts').style.display = 'block';
    document.getElementById('post-detail').style.display = 'none';
}

async function loadPostDetail(post) {
    currentPostId = post.id;
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-content').textContent = post.content;
    const comments = await backend.getComments(post.id);
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';
    comments.forEach(comment => {
        const li = document.createElement('li');
        li.textContent = comment.content;
        commentList.appendChild(li);
    });
    document.getElementById('posts').style.display = 'none';
    document.getElementById('post-detail').style.display = 'block';
}

document.getElementById('new-post-btn').onclick = () => {
    document.getElementById('modal').style.display = 'block';
};

document.getElementById('post-form').onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title-input').value;
    const content = document.getElementById('post-content-input').value;
    await backend.addPost(currentCategoryId, title, content);
    document.getElementById('modal').style.display = 'none';
    loadPosts(currentCategoryId, document.getElementById('category-title').textContent);
};

document.getElementById('comment-form').onsubmit = async (e) => {
    e.preventDefault();
    const content = document.getElementById('comment-content').value;
    await backend.addComment(currentPostId, content);
    document.getElementById('comment-content').value = '';
    loadPostDetail({ id: currentPostId, title: document.getElementById('post-title').textContent, content: document.getElementById('post-content').textContent });
};

window.onload = loadCategories;
