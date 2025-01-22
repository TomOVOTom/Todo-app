export const TodoRenderer = {
    updateTodoList(todos) {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');

        if (!todos.length) {
            todoList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        todoList.innerHTML = todos.map(todo => this.createTodoItem(todo)).join('');
    },

    createTodoItem(todo) {
        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority.toLowerCase()}" 
                data-id="${todo.id}">
                <div class="todo-content">
                    <div class="todo-main">
                        <i class="mdi ${todo.completed ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline'}"></i>
                        <span class="todo-title">${todo.text}</span>
                    </div>
                    ${todo.imageUrl ? `
                        <div class="todo-image-wrapper">
                            <img src="${todo.imageUrl}" alt="Todo image" class="todo-image">
                            <button class="remove-image" title="删除图片">
                                <i class="mdi mdi-close"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="todo-actions">
                    <button class="priority-btn" title="更改优先级">
                        <i class="mdi mdi-flag"></i>
                    </button>
                    <button class="delete-btn" title="删除">
                        <i class="mdi mdi-delete"></i>
                    </button>
                </div>
            </li>
        `;
    },

    updateStatistics(todos) {
        const totalCount = todos.length;
        const completedCount = todos.filter(todo => todo.completed).length;
        const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

        document.getElementById('totalCount').textContent = totalCount;
        document.getElementById('completedCount').textContent = completedCount;
        document.getElementById('completionRate').textContent = `${completionRate}%`;
        document.getElementById('progressValue').style.width = `${completionRate}%`;
    },

    updateTime() {
        const now = new Date();
        document.getElementById('currentTime').textContent = now.toLocaleString();
    },

    updateTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);
    },

    updateStorageIcon(useLocal) {
        const icon = document.querySelector('#storageSwitch i');
        icon.className = `mdi ${useLocal ? 'mdi-database' : 'mdi-cloud'}`;
    }
};