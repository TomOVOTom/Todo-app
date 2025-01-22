package com.example.todo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private boolean completed;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String imageUrl;
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    public enum Priority {
        LOW("low"),
        MEDIUM("medium"),
        HIGH("high");

        private final String value;

        Priority(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

    }
}