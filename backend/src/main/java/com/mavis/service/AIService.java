package com.mavis.service;

import com.mavis.dto.AIComplaintRequest;
import com.mavis.dto.AIComplaintResponse;
import com.mavis.entity.AIInteraction;
import com.mavis.repository.AIInteractionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class AIService {

    private final AIInteractionRepository aiInteractionRepository;

    public AIService(AIInteractionRepository aiInteractionRepository) {
        this.aiInteractionRepository = aiInteractionRepository;
    }

    public AIComplaintResponse analyzeComplaint(AIComplaintRequest request) {
        String complaint = request.getComplaint() != null ? request.getComplaint().toLowerCase() : "";

        String category;
        String priority;
        Double urgencyScore;
        String summary;
        List<String> inspectionAreas;
        String preliminaryGuidance;
        String suggestedService;
        String estimatedTime;
        String safetyNotice;

        if (complaint.contains("brake") || complaint.contains("grind") || complaint.contains("squeak") || complaint.contains("stopping")) {
            category = "Braking & Hydraulic System";
            priority = "High";
            urgencyScore = 8.5;
            summary = "Potential friction material depletion or brake rotor scoring detected.";
            inspectionAreas = Arrays.asList(
                    "Front/rear disc brake pads thickness & backing plate wear",
                    "Brake rotor runout and surface grooving",
                    "Caliper sliding pins and hydraulic piston seals",
                    "Brake fluid moisture content and master cylinder pressure"
            );
            preliminaryGuidance = "A metallic grinding noise when braking typically indicates that the brake pad friction material is severely worn down to the wear indicator or metal backing plate. Continuing to drive may damage the brake rotors and increase stopping distances.";
            suggestedService = "Brake Inspection & Pad Replacement";
            estimatedTime = "1.5 - 2.5 hours";
            safetyNotice = "⚠️ Preliminary Guidance: Avoid high-speed driving and schedule an immediate inspection by a qualified mechanic.";
        } else if (complaint.contains("smoke") || complaint.contains("overheat") || complaint.contains("coolant") || complaint.contains("temp")) {
            category = "Engine Cooling & Thermal Management";
            priority = "Critical";
            urgencyScore = 9.6;
            summary = "Thermal regulation failure risking severe engine head warp or cylinder blowout.";
            inspectionAreas = Arrays.asList(
                    "Radiator core & coolant expansion tank level",
                    "Thermostat valve opening/closing temperature cycle",
                    "Electric cooling fan relay & motor actuation",
                    "Water pump impeller shaft seal leakage"
            );
            preliminaryGuidance = "Elevated coolant temperatures and vapor/smoke signify insufficient heat dissipation. Continued operation in this state can cause catastrophic cylinder head warping or piston seizure.";
            suggestedService = "Cooling System Overhaul & Pressure Test";
            estimatedTime = "2.0 - 4.0 hours";
            safetyNotice = "🚨 Critical Safety Alert: Do NOT open the hot radiator cap. Safely park vehicle and avoid running the engine.";
        } else if (complaint.contains("vibrat") || complaint.contains("shake") || complaint.contains("steering") || complaint.contains("wobble")) {
            category = "Steering, Suspension & Wheel Alignment";
            priority = "Medium";
            urgencyScore = 6.2;
            summary = "Wheel imbalance or steering linkage bushing play detected.";
            inspectionAreas = Arrays.asList(
                    "Dynamic wheel rim balance & tire radial runout",
                    "Tie rod ends, ball joints, and steering rack play",
                    "Suspension control arm rubber bushings condition",
                    "Front wheel camber/caster/toe 3D laser alignment"
            );
            preliminaryGuidance = "Steering wheel vibrations at cruising speed frequently stem from unbalanced wheels, bent rims, or worn tie-rod bushings. Prompt alignment prevents uneven tire tread wear.";
            suggestedService = "Wheel Alignment, Balancing & Suspension Check";
            estimatedTime = "1.0 - 2.0 hours";
            safetyNotice = "ℹ️ Preliminary Guidance: Have wheel balancing and suspension linkage checked during your next routine service.";
        } else {
            category = "General Powertrain & Periodic Maintenance";
            priority = "Moderate";
            urgencyScore = 5.0;
            summary = "General vehicle performance inquiry requiring standard multi-point inspection.";
            inspectionAreas = Arrays.asList(
                    "OBD-II On-Board Diagnostic scanner DTC fault codes",
                    "Engine oil viscosity, level, and oil filter condition",
                    "Air intake filter and mass airflow sensor cleaning",
                    "Comprehensive 40-point safety and fluid checkup"
            );
            preliminaryGuidance = "Based on your description, a comprehensive multi-point diagnostic check will help pinpoint the underlying component behavior and establish an accurate maintenance plan.";
            suggestedService = "Comprehensive Multi-Point Diagnostic Service";
            estimatedTime = "1.5 - 3.0 hours";
            safetyNotice = "⚠️ Preliminary Service Guidance: Certified technicians will conduct physical inspection before initiating repairs.";
        }

        // Save AI interaction in MySQL audit table
        try {
            AIInteraction interaction = new AIInteraction();
            interaction.setComplaint(request.getComplaint());
            interaction.setCategory(category);
            interaction.setPriority(priority);
            interaction.setGuidance(preliminaryGuidance);
            interaction.setCreatedAt(LocalDateTime.now().toString());
            aiInteractionRepository.save(interaction);
        } catch (Exception ignored) {}

        return new AIComplaintResponse(
                category, priority, urgencyScore, summary,
                inspectionAreas, preliminaryGuidance,
                suggestedService, estimatedTime, safetyNotice
        );
    }
}
