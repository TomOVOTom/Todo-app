package com.example.todo.controller;

import com.example.todo.model.Todo;
import com.example.todo.service.TodoService;
import com.example.todo.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {
    private final TodoService todoService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.findAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Todo> createTodo(@RequestParam("text") String text,
                                           @RequestParam(value = "completed", defaultValue = "false") boolean completed,
                                           @RequestParam(value = "priority", defaultValue = "MEDIUM") String priority,
                                           @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            log.info("Received todo creation request - text: {}, completed: {}, priority: {}, hasImage: {}",
                    text, completed, priority, (image != null && !image.isEmpty()));
            
            Todo todo = new Todo();
            todo.setText(text);
            todo.setCompleted(completed);
            todo.setPriority(Todo.Priority.valueOf(priority));
            
            if (image != null && !image.isEmpty()) {
                try {
                    String imageUrl = fileStorageService.storeFile(image);
                    todo.setImageUrl(imageUrl);
                    log.info("Stored image for todo at: {}", imageUrl);
                } catch (Exception e) {
                    log.error("Failed to store image for todo: {}", e.getMessage());
                }
            }
            
            Todo savedTodo = todoService.create(todo);
            log.info("Successfully created todo with id: {}", savedTodo.getId());
            return ResponseEntity.ok(savedTodo);
        } catch (Exception e) {
            log.error("Error creating todo: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/toggle")
    public Todo toggleTodo(@PathVariable Long id) {
        return todoService.toggleComplete(id);
    }

    @PatchMapping("/{id}/priority")
    public Todo updatePriority(@PathVariable Long id) {
        return todoService.updatePriority(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        try {
            Todo todo = todoService.findAll().stream()
                    .filter(t -> t.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));

            if (todo.getImageUrl() != null) {
                try {
                    fileStorageService.deleteFile(todo.getImageUrl());
                } catch (Exception e) {
                    log.error("Failed to delete image for todo {}: {}", id, e.getMessage());
                }
            }
            todoService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting todo: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}