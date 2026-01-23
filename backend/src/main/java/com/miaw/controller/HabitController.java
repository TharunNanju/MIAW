package com.miaw.controller;

import com.miaw.dto.HabitConsistencyResponse;
import com.miaw.dto.HabitLogRequest;
import com.miaw.dto.HabitLogResponse;
import com.miaw.dto.HabitRequest;
import com.miaw.dto.HabitResponse;
import com.miaw.model.Habit;
import com.miaw.model.HabitLog;
import com.miaw.model.User;
import com.miaw.service.AuthService;
import com.miaw.service.HabitService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/habits")
public class HabitController {
    private final AuthService authService;
    private final HabitService habitService;

    public HabitController(AuthService authService, HabitService habitService) {
        this.authService = authService;
        this.habitService = habitService;
    }

    @GetMapping
    public List<HabitResponse> list() {
        User user = authService.getCurrentUser();
        return habitService.listHabits(user).stream().map(this::toResponse).toList();
    }

    @PostMapping
    public HabitResponse create(@Valid @RequestBody HabitRequest request) {
        User user = authService.getCurrentUser();
        Habit habit = habitService.createHabit(user, request);
        return toResponse(habit);
    }

    @PutMapping("/{habitId}")
    public HabitResponse update(@PathVariable Long habitId, @Valid @RequestBody HabitRequest request) {
        User user = authService.getCurrentUser();
        return toResponse(habitService.updateHabit(user, habitId, request));
    }

    @PostMapping("/{habitId}/logs")
    public HabitLogResponse log(@PathVariable Long habitId, @Valid @RequestBody HabitLogRequest request) {
        User user = authService.getCurrentUser();
        HabitLog log = habitService.logHabit(user, habitId, request);
        return new HabitLogResponse(log.getId(), habitId, log.getLogDate(), log.isCompleted(), log.getCreatedAt());
    }

    @GetMapping("/{habitId}/logs")
    public List<HabitLogResponse> logs(@PathVariable Long habitId) {
        User user = authService.getCurrentUser();
        return habitService.listLogs(user, habitId).stream()
            .map(log -> new HabitLogResponse(log.getId(), habitId, log.getLogDate(), log.isCompleted(), log.getCreatedAt()))
            .toList();
    }

    @GetMapping("/{habitId}/consistency")
    public HabitConsistencyResponse consistency(@PathVariable Long habitId, @RequestParam(defaultValue = "30") int days) {
        User user = authService.getCurrentUser();
        return habitService.getConsistency(user, habitId, days);
    }

    private HabitResponse toResponse(Habit habit) {
        return new HabitResponse(habit.getId(), habit.getName(), habit.getDescription(), habit.isActive(), habit.getCreatedAt());
    }
}
