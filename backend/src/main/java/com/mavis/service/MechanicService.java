package com.mavis.service;

import com.mavis.entity.JobCard;
import com.mavis.entity.Mechanic;
import com.mavis.entity.ServiceBooking;
import com.mavis.entity.User;
import com.mavis.repository.JobCardRepository;
import com.mavis.repository.MechanicRepository;
import com.mavis.repository.ServiceBookingRepository;
import com.mavis.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MechanicService {

    private final MechanicRepository mechanicRepository;
    private final UserRepository userRepository;
    private final JobCardRepository jobCardRepository;
    private final ServiceBookingRepository bookingRepository;

    public MechanicService(MechanicRepository mechanicRepository,
                           UserRepository userRepository,
                           JobCardRepository jobCardRepository,
                           ServiceBookingRepository bookingRepository) {
        this.mechanicRepository = mechanicRepository;
        this.userRepository = userRepository;
        this.jobCardRepository = jobCardRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<Mechanic> getAllMechanics() {
        return mechanicRepository.findAll();
    }

    public Mechanic getMechanicById(Long id) {
        return mechanicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mechanic not found: " + id));
    }

    public Optional<Mechanic> getMechanicByUserId(Long userId) {
        return mechanicRepository.findByUserId(userId);
    }

    /**
     * Fetch assigned jobs for the authenticated mechanic derived strictly from JWT user email.
     */
    @Transactional
    public List<JobCard> getAssignedJobsForAuthenticatedUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Find matching mechanic entry
        Optional<Mechanic> optMech = mechanicRepository.findByUserId(user.getId());
        Long targetMechanicId = optMech.map(Mechanic::getId).orElse(user.getId());
        String mechanicName = optMech.map(Mechanic::getName).orElse(user.getName());

        // 1. Get existing job cards strictly for this mechanic ID
        List<JobCard> jobs = new ArrayList<>(jobCardRepository.findByMechanicId(targetMechanicId));

        // 2. Synchronize any bookings assigned to this mechanic that might not have a JobCard yet
        List<ServiceBooking> bookings = bookingRepository.findByMechanicId(targetMechanicId);

        for (ServiceBooking booking : bookings) {
            boolean hasCard = jobs.stream().anyMatch(j -> booking.getId().equals(j.getBookingId()));
            if (!hasCard) {
                JobCard newCard = new JobCard();
                newCard.setId("JC-" + booking.getId().replace("BK-", ""));
                newCard.setBookingId(booking.getId());
                newCard.setVehicleName(booking.getVehicleName());
                newCard.setCustomerName("Rahul Sharma");
                newCard.setCustomerPhone("+91 98765 43210");
                newCard.setMechanicId(targetMechanicId);
                newCard.setMechanicName(mechanicName);
                newCard.setStatus(booking.getStatus() != null ? booking.getStatus() : "In Progress");
                newCard.setPriority("Normal");
                newCard.setProgressPercent(booking.getStatus() != null && booking.getStatus().equalsIgnoreCase("Completed") ? 100 : 35);
                newCard.setNotes("Assigned via Admin Dispatch. Scheduled: " + booking.getBookingDate());
                newCard.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a")));
                
                jobCardRepository.save(newCard);
                jobs.add(newCard);
            }
        }

        return jobs;
    }
}
