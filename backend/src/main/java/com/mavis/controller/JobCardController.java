package com.mavis.controller;

import com.mavis.entity.JobCard;
import com.mavis.service.JobCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class JobCardController {

    private final JobCardService jobCardService;

    public JobCardController(JobCardService jobCardService) {
        this.jobCardService = jobCardService;
    }

    @GetMapping("/api/jobs")
    public ResponseEntity<List<JobCard>> getAllJobs() {
        return ResponseEntity.ok(jobCardService.getAllJobs());
    }

    @GetMapping("/api/jobs/{id}")
    public ResponseEntity<JobCard> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(jobCardService.getJobById(id));
    }

    @GetMapping("/api/mechanics/{mechanicId}/jobs")
    public ResponseEntity<List<JobCard>> getMechanicJobs(@PathVariable Long mechanicId) {
        return ResponseEntity.ok(jobCardService.getJobsByMechanicId(mechanicId));
    }

    @PatchMapping("/api/jobs/{id}")
    public ResponseEntity<JobCard> updateJob(@PathVariable String id, @RequestBody JobCard updateData) {
        return ResponseEntity.ok(jobCardService.updateJob(id, updateData));
    }
}
