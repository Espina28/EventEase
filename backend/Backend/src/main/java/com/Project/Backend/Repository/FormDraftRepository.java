package com.Project.Backend.Repository;

import com.Project.Backend.Entity.FormDraftEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FormDraftRepository extends JpaRepository<FormDraftEntity, Integer> {
    FormDraftEntity findByEmail(String email);

    @Query("SELECT a FROM FormDraftEntity a WHERE a.eventName = :eventName AND a.email = :email ")
    FormDraftEntity findByEmailAndEventName(@Param("eventName") String eventName, @Param("email") String email);

    @Modifying
    @Query("DELETE FROM FormDraftEntity f WHERE f.email = :email AND f.eventName = :eventName")
    void deleteByEmailAndEventName(@Param("email") String email, @Param("eventName") String eventName);

}
