package com.Project.Backend.Repository;

import com.Project.Backend.DTO.ServicePackageDTO;
import com.Project.Backend.Entity.PackagesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackagesRepository extends JpaRepository<PackagesEntity, Integer> {


    @Query("SELECT new com.Project.Backend.DTO.ServicePackageDTO(sc.subcontractor_serviceName , p.packageName, p.packagePrice) " +
            "FROM PackageServicesEntity ps " +
            "JOIN ps.subcontractor sc " +
            "JOIN ps.packages p " +
            "WHERE p.packageName LIKE CONCAT('%', :packageName, '%')")
    List<ServicePackageDTO> findServicePackagesByPackageName(@Param("packageName") String packageName);


    @Query("SELECT new com.Project.Backend.DTO.ServicePackageDTO(sc.subcontractor_serviceName , p.packageName, p.packagePrice) " +
            "FROM PackageServicesEntity ps " +
            "JOIN ps.subcontractor sc " +
            "JOIN ps.packages p ")
    List<ServicePackageDTO> findALlPackageServices();

    @Query("SELECT p FROM PackagesEntity p WHERE p.packageName = :packageName")
    PackagesEntity findPackageByPackageName(String packageName);

}
