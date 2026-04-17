package com.miaw.dto;

import java.time.LocalDateTime;

public class AssessmentResponse {
    private Long id;
    private int score;
    private LocalDateTime takenAt;

    public AssessmentResponse(Long id, int score, LocalDateTime takenAt) {
        this.id = id;
        this.score = score;
        this.takenAt = takenAt;
    }

    public Long getId() {
        return id;
    }

    public int getScore() {
        return score;
    }

    public LocalDateTime getTakenAt() {
        return takenAt;
    }
}
