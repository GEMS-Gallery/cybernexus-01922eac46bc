import { backend } from 'declarations/backend';

let currentCategoryId = null;
let currentCategoryName = null;
let currentPostId = null;
let currentPostTitle = null;
let postEditor, commentEditor;

function initializeEditors() {
    postEditor = window.pell.init({
        element: document.getElementById('post-editor'),
        actions: ['bold', 'italic', 'underline', 'strikethrough', 'heading1', 'heading2', 'paragraph', 'quote', 'olist', 'ulist', 'code', 'line'],
        onChange: html => {
            // You can handle changes here if needed
        }
    });

    commentEditor = window.pell.init({
        element: document.getElementById('comment-editor'),
        actions: ['bold', 'italic', 'underline', 'strikethrough'],
        onChange: html => {
            // You can handle changes here if needed
        }
    });
}

function updateBreadcrumbs() {
    const breadcrumbsList = document.querySelector('#breadcrumbs ul');
    breadcrumbsList.innerHTML = '<li><a href="#" id="home-breadcrumb">Home</a></li>';
    
    if (currentCategoryName) {
        breadcrumbsList.innerHTML += `<li>${currentCategoryName}</li>`;
    }
    
    if (currentPostTitle) {
        breadcrumbsList.innerHTML += `<li>${currentPostTitle}</li>`;
    }

    document.getElementById('home-breadcrumb').onclick = loadCategories;
}

async function loadCategories() {
    currentCategoryId = null;
    currentCategoryName = null;
    currentPostId = null;
    currentPostTitle = null;
    updateBreadcrumbs();

    const categories = await backend.getCategories();
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-${getCategoryIcon(category.name)}"></i> ${category.name}`;
        li.onclick = () => {
            document.querySelectorAll('#category-list li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            loadPosts(category.id, category.name);
        };
        categoryList.appendChild(li);
    });
    showSection('categories');
}

function getCategoryIcon(categoryName) {
    const iconMap = {
        "Penetration Testing": "user-secret",
        "Red Team Operations": "shield-alt",
        "Blue Team Defense": "shield-virus",
        "Malware Analysis": "bug",
        "Network Security": "network-wired",
        "Web Application Security": "globe"
    };
    return iconMap[categoryName] || "folder";
}

async function loadPosts(categoryId, categoryName) {
    currentCategoryId = categoryId;
    currentCategoryName = categoryName;
    currentPostId = null;
    currentPostTitle = null;
    updateBreadcrumbs();

    const posts = await backend.getPosts(categoryId);
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';
    document.getElementById('category-title').innerHTML = `<i class="fas fa-${getCategoryIcon(categoryName)}"></i> ${categoryName}`;
    posts.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-file-alt"></i> ${post.title}`;
        li.onclick = () => loadPostDetail(post);
        postList.appendChild(li);
    });
    showSection('posts');
}

async function loadPostDetail(post) {
    currentPostId = post.id;
    currentPostTitle = post.title;
    updateBreadcrumbs();

    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-content').innerHTML = post.content;
    const comments = await backend.getComments(post.id);
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';
    comments.forEach(comment => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-comment"></i> ${comment.content}`;
        commentList.appendChild(li);
    });
    showSection('post-detail');
}

function showSection(sectionId) {
    ['categories', 'posts', 'post-detail'].forEach(id => {
        document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
    });
}

document.getElementById('new-post-btn').onclick = () => {
    document.getElementById('modal').style.display = 'block';
    postEditor.content.innerHTML = '';
};

document.getElementById('post-form').onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title-input').value;
    const content = postEditor.content.innerHTML;
    await backend.addPost(currentCategoryId, title, content);
    document.getElementById('modal').style.display = 'none';
    loadPosts(currentCategoryId, currentCategoryName);
};

document.getElementById('comment-form').onsubmit = async (e) => {
    e.preventDefault();
    const content = commentEditor.content.innerHTML;
    await backend.addComment(currentPostId, content);
    commentEditor.content.innerHTML = '';
    loadPostDetail({ id: currentPostId, title: currentPostTitle, content: document.getElementById('post-content').innerHTML });
};

document.getElementById('back-to-categories').onclick = loadCategories;

document.getElementById('back-to-posts').onclick = () => {
    loadPosts(currentCategoryId, currentCategoryName);
};

window.onload = () => {
    initializeEditors();
    loadCategories();
};
