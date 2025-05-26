package com.Project.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Project.Backend.Entity.SubcontractorEntity;

import java.sql.Date;
import java.util.List;

@Repository
public interface SubContractorRepository extends JpaRepository<SubcontractorEntity, Integer>{

    @Query("SELECT s FROM SubcontractorEntity s WHERE s.user.email = :email")
    SubcontractorEntity findByEmail(@Param("email") String email);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM SubcontractorEntity s WHERE s.subcontractor_serviceCategory = :subcontractor_serviceCategory")
    List<SubcontractorEntity> findBySubcontractorServiceCategory(@org.springframework.data.repository.query.Param("subcontractor_serviceCategory") String subcontractor_serviceCategory);

    @Query(value = """
    SELECT * FROM subcontractors s
    WHERE NOT EXISTS (
        SELECT 1 FROM unavailable_dates ud
        WHERE ud.subcontractor_id = s.subcontractor_id
          AND ud.date = :eventDate
    )
""", nativeQuery = true)
    List<SubcontractorEntity> findAvailableSubcontractors(@Param("eventDate") Date eventDate);
}
