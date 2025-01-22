const TodoStorage = {
    async loadTodos(useLocalStorage) {
        if (useLocalStorage) {
            const savedTodos = localStorage.getItem('todos');
            return savedTodos ? JSON.parse(savedTodos) : [];
        } else {
            try {
                const response = await fetch('/api/todos');
                return await response.json();
            } catch (error) {
                console.error('Error loading todos:', error);
                return [];
            }
        }
    },

    async saveTodos(todos, useLocalStorage) {
        if (useLocalStorage) {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    },

    async addTodo(text, useLocalStorage, imageFile = null) {
        if (useLocalStorage) {
            let imageUrl = null;
            if (imageFile) {
                // 将图片转换为 base64
                imageUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(imageFile);
                });
            }

            return {
                id: Date.now(),
                text: text,
                completed: false,
                priority: 'MEDIUM',
                createdAt: new Date().toISOString(),
                imageUrl: imageUrl
            };
        } else {
            try {
                const formData = new FormData();
                formData.append('text', text);
                formData.append('completed', 'false');
                formData.append('priority', 'MEDIUM');

                if (imageFile) {
                    formData.append('image', imageFile);
                }

                const response = await fetch('/api/todos', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.error('Error adding todo:', error);
                return null;
            }
        }
    },

    async toggleTodo(id, useLocalStorage) {
        if (!useLocalStorage) {
            try {
                await fetch(`/api/todos/${id}/toggle`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'}
                });
            } catch (error) {
                console.error('Error toggling todo:', error);
            }
        }
    },

    async changePriority(id, useLocalStorage) {
        if (!useLocalStorage) {
            try {
                const response = await fetch(`/api/todos/${id}/priority`, {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'}
                });
                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.error('Error changing priority:', error);
            }
        }
        return null;
    },

    async removeTodo(id, useLocalStorage, imageUrl = null) {
        if (!useLocalStorage) {
            try {
                await fetch(`/api/todos/${id}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Error removing todo:', error);
            }
        } else if (imageUrl && imageUrl.startsWith('data:')) {
            // 在本地存储模式下，不需要特别处理 base64 图片的删除
            // 因为它们会随着 todo 的删除自动从 localStorage 中移除
        }
    }
};

export default TodoStorage;