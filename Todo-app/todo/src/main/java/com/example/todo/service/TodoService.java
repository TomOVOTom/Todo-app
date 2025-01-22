package com.example.todo.service;

import com.example.todo.model.Todo;
import java.util.List;

public interface TodoService {
    List<Todo> findAll();
    Todo create(Todo todo);
    Todo toggleComplete(Long id);
    Todo updatePriority(Long id);
    void delete(Long id);
}