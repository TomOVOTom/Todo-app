export class TodoHelper {
    constructor(data) {
        this.data = data;
    }

    async processLocalImage() {
        if (!this.data.currentImage) {
            return null;
        }

        if (typeof this.data.currentImage === 'string') {
            return this.data.currentImage;
        }

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(this.data.currentImage);
        });
    }

    createLocalTodo(text, imageUrl) {
        return {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString(),
            imageUrl: imageUrl
        };
    }

    async createServerTodo(text) {
        const formData = new FormData();
        formData.append('text', text);
        formData.append('completed', 'false');
        formData.append('priority', 'MEDIUM');

        if (this.data.currentImage instanceof File) {
            formData.append('image', this.data.currentImage);
        }

        const response = await fetch('/api/todos', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    }

    clearInputs() {
        const input = document.getElementById('newTodo');
        if (input) {
            input.value = '';
        }
        if (window.app && window.app.imageManager) {
            window.app.imageManager.removeImage();
        }
    }
} 