package com.miaw.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class JournalEntryRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private LocalDate entryDate;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }
}
