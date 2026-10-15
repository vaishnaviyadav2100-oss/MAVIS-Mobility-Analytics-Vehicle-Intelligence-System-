package com.mavis.repository;

import com.mavis.entity.JobCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobCardRepository extends JpaRepository<JobCard, String> {
    List<JobCard> findByMechanicId(Long mechanicId);
    List<JobCard> findByStatus(String status);
    Optional<JobCard> findByBookingId(String bookingId);
}
