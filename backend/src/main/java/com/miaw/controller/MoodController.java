package com.miaw.controller;

import com.miaw.dto.MoodEntryRequest;
import com.miaw.dto.MoodEntryResponse;
import com.miaw.model.MoodEntry;
import com.miaw.model.User;
import com.miaw.service.AuthService;
import com.miaw.service.MoodService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/moods")
public class MoodController {
    private final AuthService authService;
    private final MoodService moodService;

    public MoodController(AuthService authService, MoodService moodService) {
        this.authService = authService;
        this.moodService = moodService;
    }

    @PostMapping
    public MoodEntryResponse upsert(@Valid @RequestBody MoodEntryRequest request) {
        User user = authService.getCurrentUser();
        MoodEntry entry = moodService.upsertEntry(user, request);
        return toResponse(entry);
    }

    @GetMapping
    public List<MoodEntryResponse> list(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        User user = authService.getCurrentUser();
        return moodService.listEntries(user, startDate, endDate).stream().map(this::toResponse).toList();
    }

    @PutMapping("/{entryId}")
    public MoodEntryResponse update(@PathVariable Long entryId, @Valid @RequestBody MoodEntryRequest request) {
        User user = authService.getCurrentUser();
        return toResponse(moodService.updateEntry(user, entryId, request));
    }

    @DeleteMapping("/{entryId}")
    public void delete(@PathVariable Long entryId) {
        User user = authService.getCurrentUser();
        moodService.deleteEntry(user, entryId);
    }

    private MoodEntryResponse toResponse(MoodEntry entry) {
        return new MoodEntryResponse(
            entry.getId(),
            entry.getEntryDate(),
            entry.getMoodLevel(),
            entry.getNote(),
            entry.getCreatedAt()
        );
    }
}
