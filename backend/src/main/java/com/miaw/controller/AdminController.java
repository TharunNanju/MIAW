package com.miaw.controller;

import com.miaw.dto.AdminUserResponse;
import com.miaw.dto.UsageStatsResponse;
import com.miaw.service.AdminService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public List<AdminUserResponse> listUsers() {
        return adminService.listUsers().stream()
            .map(user -> new AdminUserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt()))
            .toList();
    }

    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
    }

    @GetMapping("/usage")
    public UsageStatsResponse usage() {
        return new UsageStatsResponse(
            adminService.totalUsers(),
            adminService.totalMoodEntries(),
            adminService.totalJournalEntries(),
            adminService.totalHabits(),
            adminService.totalAssessments()
        );
    }
}
