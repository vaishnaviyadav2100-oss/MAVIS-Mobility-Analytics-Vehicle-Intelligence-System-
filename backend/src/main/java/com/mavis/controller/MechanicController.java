package com.mavis.controller;

import com.mavis.dto.JobStatusRequest;
import com.mavis.entity.JobCard;
import com.mavis.entity.Mechanic;
import com.mavis.service.JobCardService;
import com.mavis.service.MechanicService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class MechanicController {

    private final MechanicService mechanicService;
    private final JobCardService jobCardService;

    public MechanicController(MechanicService mechanicService, JobCardService jobCardService) {
        this.mechanicService = mechanicService;
        this.jobCardService = jobCardService;
    }

    @GetMapping("/api/mechanics")
    public ResponseEntity<List<Mechanic>> getAllMechanics() {
        return ResponseEntity.ok(mechanicService.getAllMechanics());
    }

    @GetMapping("/api/mechanics/{id}")
    public ResponseEntity<Mechanic> getMechanicById(@PathVariable Long id) {
        return ResponseEntity.ok(mechanicService.getMechanicById(id));
    }

    /**
     * Primary endpoint: GET /api/mechanic/jobs/assigned
     * Derives mechanic identity from authenticated JWT token.
     */
    @GetMapping({"/api/mechanic/jobs/assigned", "/api/mechanics/jobs/assigned"})
    public ResponseEntity<List<JobCard>> getAssignedJobs(Principal principal,
                                                         @RequestParam(required = false) String email) {
        String userEmail = null;
        if (principal != null) {
            userEmail = principal.getName();
        } else {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                userEmail = auth.getName();
            }
        }

        if (userEmail == null || userEmail.isEmpty()) {
            userEmail = (email != null && !email.isEmpty()) ? email : "mechanic@mavis.com";
        }

        List<JobCard> jobs = mechanicService.getAssignedJobsForAuthenticatedUser(userEmail);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Mechanic updates repair status of an assigned job
     */
    @PatchMapping({"/api/mechanic/jobs/{id}/status", "/api/jobs/{id}/status"})
    public ResponseEntity<JobCard> updateRepairStatus(@PathVariable String id,
                                                      @RequestBody JobStatusRequest request) {
        JobCard updateData = new JobCard();
        updateData.setStatus(request.getStatus());
        if (request.getNotes() != null) updateData.setNotes(request.getNotes());
        if (request.getProgressPercent() != null) updateData.setProgressPercent(request.getProgressPercent());

        JobCard updated = jobCardService.updateJob(id, updateData);
        return ResponseEntity.ok(updated);
    }
}
