package com.miaw.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class AssessmentRequest {
    @NotEmpty
    private List<Integer> answers;

    public List<Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Integer> answers) {
        this.answers = answers;
    }
}
