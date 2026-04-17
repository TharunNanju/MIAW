package com.miaw.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class JournalEntryResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDate entryDate;
    private LocalDateTime createdAt;

    public JournalEntryResponse(Long id, String title, String content, LocalDate entryDate, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.entryDate = entryDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
