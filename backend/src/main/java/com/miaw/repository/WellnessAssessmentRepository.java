package com.miaw.repository;

import com.miaw.model.User;
import com.miaw.model.WellnessAssessment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WellnessAssessmentRepository extends JpaRepository<WellnessAssessment, Long> {
    List<WellnessAssessment> findAllByUserOrderByTakenAtDesc(User user);
}
