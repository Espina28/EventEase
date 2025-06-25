package com.Project.Backend.Repository;

import com.Project.Backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);

    @Query("SELECT u FROM UserEntity u WHERE u.role = :role")
    List<UserEntity> findAllByRole(@Param("role") String role);

    @Query("SELECT u FROM UserEntity u JOIN u.subcontractor s JOIN s.packageServices ps WHERE ps.packages.packageId = :packageId")
    List<UserEntity> findSubcontractorsByPackageId(@Param("packageId") int packageId);
}
