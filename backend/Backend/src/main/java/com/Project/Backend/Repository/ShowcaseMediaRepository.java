package com.Project.Backend.Repository;

import com.Project.Backend.Entity.ShowcaseMediaEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowcaseMediaRepository extends JpaRepository<ShowcaseMediaEntity, Integer> {

    @Query("SELECT sm FROM ShowcaseMediaEntity sm WHERE sm.showcase.showcase_title = :showcase_title")
    List<ShowcaseMediaEntity> findByShowcaseMediaByShowcaseTitle(@Param("showcase_title") String showcase_title);

    @Transactional
    @Modifying
    @Query("DELETE FROM ShowcaseMediaEntity sm WHERE sm.showcaseMedia_id IN :ids")
    void deleteMediaByIds(@Param("ids") List<Integer> ids);

}
