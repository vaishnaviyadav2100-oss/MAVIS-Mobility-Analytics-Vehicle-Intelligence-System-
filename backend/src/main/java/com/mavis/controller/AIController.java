package com.mavis.controller;

import com.mavis.dto.AIComplaintRequest;
import com.mavis.dto.AIComplaintResponse;
import com.mavis.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/complaint")
    public ResponseEntity<AIComplaintResponse> analyzeComplaint(@RequestBody AIComplaintRequest request) {
        return ResponseEntity.ok(aiService.analyzeComplaint(request));
    }
}
