package com.example.todo.service.impl;

import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import com.example.todo.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {
    private final TodoRepository todoRepository;

    @Override
    public List<Todo> findAll() {
        return todoRepository.findAll();
    }

    @Override
    public Todo create(Todo todo) {
        todo.setCreatedAt(LocalDateTime.now());
        return todoRepository.save(todo);
    }

    @Override
    public Todo toggleComplete(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        todo.setCompleted(!todo.isCompleted());
        return todoRepository.save(todo);
    }

    @Override
    public Todo updatePriority(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        Todo.Priority currentPriority = todo.getPriority();
        Todo.Priority nextPriority = switch (currentPriority) {
            case LOW -> Todo.Priority.MEDIUM;
            case MEDIUM -> Todo.Priority.HIGH;
            case HIGH -> Todo.Priority.LOW;
        };

        todo.setPriority(nextPriority);
        return todoRepository.save(todo);
    }

    @Override
    public void delete(Long id) {
        todoRepository.deleteById(id);
    }
}