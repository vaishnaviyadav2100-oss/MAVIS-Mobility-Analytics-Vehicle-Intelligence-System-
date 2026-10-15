import { apiRequest } from './api';

export const aiService = {
  async analyzeComplaint(complaintText, vehicleDetails = {}) {
    // 1. Attempt call to Spring Boot backend AI endpoint
    const res = await apiRequest('/ai/complaint', {
      method: 'POST',
      body: JSON.stringify({
        complaint: complaintText,
        vehicle: vehicleDetails,
      }),
    });

    if (res.data) return res.data;

    // 2. Intelligent Automotive Rules Fallback for live offline testing/demo
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate AI thought latency

    const text = complaintText.toLowerCase();

    if (text.includes('brake') || text.includes('grind') || text.includes('squeak') || text.includes('stopping')) {
      return {
        category: 'Braking & Hydraulic System',
        priority: 'High',
        priorityColor: 'amber',
        urgencyScore: 8.5,
        summary: 'Potential friction material depletion or brake rotor scoring detected.',
        inspectionAreas: [
          'Front/rear disc brake pads thickness & backing plate wear',
          'Brake rotor runout and surface grooving',
          'Caliper sliding pins and piston boot integrity',
          'Brake fluid moisture content and hydraulic line pressure',
        ],
        preliminaryGuidance:
          'A metallic grinding noise when braking typically indicates that the brake pad friction material is severely worn down to the wear indicator or metal backing plate. Continuing to drive may damage the brake rotors and increase stopping distances.',
        suggestedService: 'Brake Inspection & Pad Replacement',
        estimatedTime: '1.5 - 2.5 hours',
        safetyNotice: '⚠️ Preliminary Guidance: Avoid high-speed driving and schedule an immediate inspection by a certified mechanic.',
      };
    }

    if (text.includes('smoke') || text.includes('overheat') || text.includes('temperature') || text.includes('coolant')) {
      return {
        category: 'Engine Cooling & Thermal Management',
        priority: 'Critical',
        priorityColor: 'red',
        urgencyScore: 9.6,
        summary: 'Thermal regulation failure risking severe engine head warp or gasket blowout.',
        inspectionAreas: [
          'Radiator core & coolant expansion tank level',
          'Thermostat valve opening/closing temperature cycle',
          'Electric cooling fan relay & motor actuation',
          'Water pump impeller shaft seal leakage',
        ],
        preliminaryGuidance:
          'Elevated coolant temperatures and vapor/smoke signify insufficient heat dissipation. Continued operation in this state can cause catastrophic cylinder head warping or piston seizure.',
        suggestedService: 'Cooling System Overhaul & Pressure Test',
        estimatedTime: '2.0 - 4.0 hours',
        safetyNotice: '🚨 Critical Safety Alert: Do NOT open the hot radiator cap. Safely park vehicle and avoid running the engine.',
      };
    }

    if (text.includes('vibrat') || text.includes('shake') || text.includes('wobbl') || text.includes('steering')) {
      return {
        category: 'Steering, Suspension & Wheel Alignment',
        priority: 'Medium',
        priorityColor: 'blue',
        urgencyScore: 6.2,
        summary: 'Wheel imbalance or steering linkage bushing play detected.',
        inspectionAreas: [
          'Dynamic wheel rim balance & tire radial runout',
          'Tie rod ends, ball joints, and steering rack play',
          'Suspension control arm rubber bushings condition',
          'Front wheel camber/caster/toe 3D laser alignment',
        ],
        preliminaryGuidance:
          'Steering wheel vibrations at cruising speed frequently stem from unbalanced wheels, bent rims, or worn tie-rod bushings. Prompt alignment prevents uneven tire tread wear.',
        suggestedService: 'Wheel Alignment, Balancing & Suspension Check',
        estimatedTime: '1.0 - 2.0 hours',
        safetyNotice: 'ℹ️ Preliminary Guidance: Have wheel balancing and suspension linkage checked during your next routine service.',
      };
    }

    if (text.includes('battery') || text.includes('start') || text.includes('crank') || text.includes('alternator')) {
      return {
        category: 'Electrical & Starting System',
        priority: 'Medium',
        priorityColor: 'yellow',
        urgencyScore: 5.8,
        summary: 'Low terminal voltage or starter solenoid resistance issue.',
        inspectionAreas: [
          '12V battery Cold Cranking Amps (CCA) health rating',
          'Alternator charging voltage under full electrical load (13.8V - 14.4V)',
          'Battery terminal corrosion and grounding strap connection',
          'Starter motor current draw during ignition',
        ],
        preliminaryGuidance:
          'Sluggish engine cranking usually points to a degrading battery cell or inadequate charging current from the alternator.',
        suggestedService: 'Battery Health Diagnosis & Electrical Scan',
        estimatedTime: '45 mins - 1 hour',
        safetyNotice: 'ℹ️ Preliminary Guidance: Avoid leaving headlights or accessories on while the engine is turned off.',
      };
    }

    // Default general diagnosis
    return {
      category: 'General Powertrain & Periodic Maintenance',
      priority: 'Moderate',
      priorityColor: 'cyan',
      urgencyScore: 5.0,
      summary: 'General vehicle performance inquiry requiring standard multi-point inspection.',
      inspectionAreas: [
        'OBD-II On-Board Diagnostic scanner DTC fault codes',
        'Engine oil viscosity, level, and oil filter condition',
        'Air intake filter and mass airflow sensor cleaning',
        'Comprehensive 40-point safety and fluid checkup',
      ],
      preliminaryGuidance:
        'Based on your description, a comprehensive multi-point diagnostic check will help pinpoint the underlying component behavior and establish an accurate maintenance plan.',
      suggestedService: 'Comprehensive Multi-Point Diagnostic Service',
      estimatedTime: '1.5 - 3.0 hours',
      safetyNotice: '⚠️ Preliminary Service Guidance: Certified technicians will conduct physical inspection before initiating repairs.',
    };
  },
};

export default aiService;
