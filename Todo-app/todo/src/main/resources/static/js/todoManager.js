import {TodoHelper} from './todoHelper.js';

export class TodoManager {
    constructor(data, storage, renderer) {
        this.data = data;
        this.storage = storage;
        this.renderer = renderer;
        this.helper = new TodoHelper(data);
    }

    async loadTodos() {
        this.data.todos = await this.storage.loadTodos(this.data.useLocalStorage);
        this.render();
    }

    async addTodo(text) {
        try {
            if (this.data.useLocalStorage) {
                let imageUrl = await this.helper.processLocalImage();
                const newTodo = this.helper.createLocalTodo(text, imageUrl);
                this.data.todos.push(newTodo);
                await this.storage.saveTodos(this.data.todos, true);
            } else {
                await this.helper.createServerTodo(text);
                await this.loadTodos();
            }

            this.helper.clearInputs();
            this.render();
        } catch (error) {
            console.error('Error adding todo:', error);
            throw error;
        }
    }

    async toggleTodo(id) {
        try {
            if (this.data.useLocalStorage) {
                const todo = this.data.todos.find(t => t.id === id);
                if (todo) {
                    todo.completed = !todo.completed;
                    await this.storage.saveTodos(this.data.todos, true);
                    this.render();
                }
            } else {
                await this.storage.toggleTodo(id, false);
                await this.loadTodos();
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    }

    async changePriority(id) {
        try {
            if (this.data.useLocalStorage) {
                const todo = this.data.todos.find(t => t.id === id);
                if (todo) {
                    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
                    const currentIndex = priorities.indexOf(todo.priority);
                    todo.priority = priorities[(currentIndex + 1) % 3];
                    await this.storage.saveTodos(this.data.todos, true);
                    this.render();
                }
            } else {
                const updatedTodo = await this.storage.changePriority(id, false);
                if (updatedTodo) {
                    await this.loadTodos();
                }
            }
        } catch (error) {
            console.error('Error changing priority:', error);
        }
    }

    async removeTodo(id) {
        try {
            if (confirm('确定要删除这个任务吗？')) {
                if (this.data.useLocalStorage) {
                    this.data.todos = this.data.todos.filter(t => t.id !== id);
                    await this.storage.saveTodos(this.data.todos, true);
                    this.render();
                } else {
                    await this.storage.removeTodo(id, false);
                    await this.loadTodos();
                }
            }
        } catch (error) {
            console.error('Error removing todo:', error);
        }
    }

    render() {
        this.renderer.updateStatistics(this.data.todos);
        this.renderer.updateTodoList(this.data.todos);
    }
}