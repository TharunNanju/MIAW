package com.miaw.controller;

import com.miaw.dto.AssessmentRequest;
import com.miaw.dto.AssessmentResponse;
import com.miaw.model.User;
import com.miaw.model.WellnessAssessment;
import com.miaw.service.AssessmentService;
import com.miaw.service.AuthService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {
    private final AuthService authService;
    private final AssessmentService assessmentService;

    public AssessmentController(AuthService authService, AssessmentService assessmentService) {
        this.authService = authService;
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public AssessmentResponse submit(@Valid @RequestBody AssessmentRequest request) {
        User user = authService.getCurrentUser();
        WellnessAssessment assessment = assessmentService.submitAssessment(user, request);
        return new AssessmentResponse(assessment.getId(), assessment.getScore(), assessment.getTakenAt());
    }

    @GetMapping
    public List<AssessmentResponse> list() {
        User user = authService.getCurrentUser();
        return assessmentService.listAssessments(user).stream()
            .map(assessment -> new AssessmentResponse(assessment.getId(), assessment.getScore(), assessment.getTakenAt()))
            .toList();
    }
}
