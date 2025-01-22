export class ImageManager {
    constructor(data) {
        this.data = data;
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.data.currentImage = this.data.useLocalStorage ? null : file;
            this.createImagePreview(file);
        }
    }

    removeImage() {
        this.data.currentImage = null;
        this.clearImagePreview();
    }

    createImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.data.useLocalStorage) {
                this.data.currentImage = e.target.result;
            }
            this.updatePreviewUI(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    updatePreviewUI(previewUrl) {
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.innerHTML = `
                <div class="preview-container">
                    <img src="${previewUrl}" alt="预览图片">
                    <button type="button" class="remove-image" onclick="app.imageManager.removeImage()">
                        <i class="mdi mdi-close"></i>
                    </button>
                </div>
            `;
        }
    }

    clearImagePreview() {
        const imagePreview = document.getElementById('imagePreview');
        const imageInput = document.getElementById('todoImage');
        
        if (imagePreview) {
            imagePreview.innerHTML = '';
        }
        if (imageInput) {
            imageInput.value = '';
        }
    }
} 