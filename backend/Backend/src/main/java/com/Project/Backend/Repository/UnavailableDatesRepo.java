package com.Project.Backend.Repository;

import com.Project.Backend.Entity.UnavailableDatesEntity;
import com.Project.Backend.Entity.SubcontractorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface UnavailableDatesRepo extends JpaRepository<UnavailableDatesEntity, Integer> {

    @Query("SELECT u FROM UnavailableDatesEntity u WHERE u.subcontractor = :subcontractor")
    List<UnavailableDatesEntity> findBySubcontractorEntity(@Param("subcontractor") SubcontractorEntity subcontractor);

    @Query("SELECT u FROM UnavailableDatesEntity u WHERE u.subcontractor.subcontractor_Id =:subcontractorId")
    List<UnavailableDatesEntity> findBySubcontractorId(@Param("subcontractorId") int subcontractorId);

    @Query("SELECT u FROM UnavailableDatesEntity u WHERE u.subcontractor.user.email = :email")
    List<UnavailableDatesEntity> findBySubcontractorEmail(@Param("email") String email);

    // Check if a date already exists for a specific subcontractor
    boolean existsBySubcontractorAndDate(@Param("subcontractor") SubcontractorEntity subcontractor, @Param("date") Date date);
}
