package com.mavis.service;

import com.mavis.entity.JobCard;
import com.mavis.entity.ServiceBooking;
import com.mavis.repository.JobCardRepository;
import com.mavis.repository.ServiceBookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class BookingService {

    private final ServiceBookingRepository bookingRepository;
    private final JobCardRepository jobCardRepository;

    public BookingService(ServiceBookingRepository bookingRepository, JobCardRepository jobCardRepository) {
        this.bookingRepository = bookingRepository;
        this.jobCardRepository = jobCardRepository;
    }

    public List<ServiceBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<ServiceBooking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public ServiceBooking createBooking(ServiceBooking booking) {
        if (booking.getId() == null || booking.getId().isEmpty()) {
            booking.setId("BK-" + (1000 + new Random().nextInt(9000)));
        }
        if (booking.getStatus() == null) {
            booking.setStatus("Pending");
        }
        if (booking.getAssignedMechanic() == null) {
            booking.setAssignedMechanic("Unassigned");
        }
        if (booking.getCreatedAt() == null) {
            booking.setCreatedAt(LocalDate.now().toString());
        }
        return bookingRepository.save(booking);
    }

    @Transactional
    public ServiceBooking updateStatus(String bookingId, String newStatus) {
        ServiceBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        booking.setStatus(newStatus);
        ServiceBooking saved = bookingRepository.save(booking);

        // Synchronize linked JobCard in MySQL
        Optional<JobCard> optJob = jobCardRepository.findByBookingId(bookingId);
        if (optJob.isPresent()) {
            JobCard job = optJob.get();
            job.setStatus(newStatus);
            if ("Completed".equalsIgnoreCase(newStatus)) {
                job.setProgressPercent(100);
            }
            job.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a")));
            jobCardRepository.save(job);
        }

        return saved;
    }

    @Transactional
    public ServiceBooking assignMechanic(String bookingId, String mechanicName, Long mechanicId) {
        ServiceBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        booking.setAssignedMechanic(mechanicName);
        booking.setMechanicId(mechanicId);
        booking.setStatus("In Progress");
        ServiceBooking saved = bookingRepository.save(booking);

        // Ensure JobCard is created or updated and persisted in MySQL
        Optional<JobCard> optJob = jobCardRepository.findByBookingId(bookingId);
        JobCard job = optJob.orElseGet(() -> {
            JobCard j = new JobCard();
            j.setId("JC-" + bookingId.replace("BK-", ""));
            j.setBookingId(bookingId);
            j.setVehicleName(booking.getVehicleName() != null ? booking.getVehicleName() : "Vehicle");
            j.setCustomerName("Rahul Sharma");
            j.setCustomerPhone("+91 98765 43210");
            j.setPriority("High");
            return j;
        });

        job.setMechanicId(mechanicId);
        job.setMechanicName(mechanicName);
        job.setStatus("In Progress");
        if (job.getProgressPercent() == null || job.getProgressPercent() == 0) {
            job.setProgressPercent(25);
        }
        job.setNotes("Assigned to " + mechanicName + " for service execution.");
        job.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a")));

        jobCardRepository.save(job);

        return saved;
    }
}
