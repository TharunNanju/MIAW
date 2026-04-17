package com.miaw.service;

import com.miaw.dto.AssessmentRequest;
import com.miaw.model.User;
import com.miaw.model.WellnessAssessment;
import com.miaw.repository.WellnessAssessmentRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AssessmentService {
    private final WellnessAssessmentRepository wellnessAssessmentRepository;

    public AssessmentService(WellnessAssessmentRepository wellnessAssessmentRepository) {
        this.wellnessAssessmentRepository = wellnessAssessmentRepository;
    }

    public WellnessAssessment submitAssessment(User user, AssessmentRequest request) {
        int score = request.getAnswers().stream().mapToInt(Integer::intValue).sum();
        WellnessAssessment assessment = new WellnessAssessment();
        assessment.setUser(user);
        assessment.setScore(score);
        return wellnessAssessmentRepository.save(assessment);
    }

    public List<WellnessAssessment> listAssessments(User user) {
        return wellnessAssessmentRepository.findAllByUserOrderByTakenAtDesc(user);
    }
}
