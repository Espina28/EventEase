package com.Project.Backend.Repository;

import com.Project.Backend.Entity.PackageServicesEntity;
import com.Project.Backend.Entity.SubcontractorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackageServicesRepository extends JpaRepository<PackageServicesEntity, Integer> {

    @Query("SELECT p FROM PackageServicesEntity p JOIN FETCH p.subcontractor s JOIN FETCH s.user WHERE p.package_service_id = :id")
    Optional<PackageServicesEntity> findByIdWithSubcontractorAndUser(@Param("id") int id);
}
