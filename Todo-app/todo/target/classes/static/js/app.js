import TodoStorage from './storage.js';
import {TodoRenderer} from './render.js';
import {TodoManager} from './todoManager.js';
import {ImageManager} from './imageManager.js';

document.addEventListener('DOMContentLoaded', function () {
    const app = {
        data: {
            todos: [],
            isDarkTheme: false,
            useLocalStorage: false,
            currentImage: null
        },

        async init() {
            this.todoManager = new TodoManager(this.data, TodoStorage, TodoRenderer);
            this.imageManager = new ImageManager(this.data);

            // 设置全局访问
            window.app = this;

            this.data.useLocalStorage = localStorage.getItem('useLocalStorage') === 'true';
            this.data.isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

            if (this.data.isDarkTheme) {
                TodoRenderer.updateTheme(true);
            }

            await this.todoManager.loadTodos();
            this.setupEventListeners();
            TodoRenderer.updateTime();
            setInterval(() => TodoRenderer.updateTime(), 1000);
        },

        setupEventListeners() {
            // 输入框事件
            const input = document.getElementById('newTodo');
            input.addEventListener('keyup', async (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    try {
                        await this.todoManager.addTodo(input.value.trim());
                    } catch (error) {
                        alert('添加任务失败: ' + error.message);
                    }
                }
            });

            // 主题切换
            document.getElementById('themeSwitch').addEventListener('click', () => {
                this.toggleTheme();
            });

            // 存储模式切换
            document.getElementById('storageSwitch').addEventListener('click', () => {
                this.toggleStorage();
            });

            // 图片上传
            const imageInput = document.getElementById('todoImage');
            if (imageInput) {
                imageInput.addEventListener('change', (e) => this.imageManager.handleImageUpload(e));
            }

            // 修改 todo 列表的事件委托
            const todoList = document.getElementById('todoList');
            todoList.addEventListener('click', async (e) => {
                const todoItem = e.target.closest('.todo-item');
                if (!todoItem) return;

                const id = parseInt(todoItem.dataset.id);

                // 如果点击的是删除按钮或优先级按钮，执行相应操作
                if (e.target.closest('.delete-btn')) {
                    await this.todoManager.removeTodo(id);
                    return;
                }

                if (e.target.closest('.priority-btn')) {
                    await this.todoManager.changePriority(id);
                    return;
                }

                // 如果点击的不是按钮区域，则切换完成状态
                if (!e.target.closest('.todo-actions')) {
                    await this.todoManager.toggleTodo(id);
                }
            });
        },

        toggleStorage() {
            this.data.useLocalStorage = !this.data.useLocalStorage;
            localStorage.setItem('useLocalStorage', this.data.useLocalStorage);
            TodoRenderer.updateStorageIcon(this.data.useLocalStorage);
            this.todoManager.loadTodos();
        },

        toggleTheme() {
            this.data.isDarkTheme = !this.data.isDarkTheme;
            localStorage.setItem('isDarkTheme', this.data.isDarkTheme);
            TodoRenderer.updateTheme(this.data.isDarkTheme);
        },

        removeImage() {
            this.imageManager.removeImage();
        }
    };

    window.app = app;
    app.init();
});