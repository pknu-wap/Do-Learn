package com.wap.web1.repository;

import com.wap.web1.domain.Category;
import com.wap.web1.domain.RecruitStatus;
import com.wap.web1.domain.Region;
import com.wap.web1.domain.StudyGroup;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudyGroupRepository extends JpaRepository<StudyGroup,Long>, StudyGroupRepositoryCustom {
    Optional<StudyGroup> findByName(String name);

    List<StudyGroup> findByRecruitStatus(RecruitStatus recruitStatus);

    // 검색 + 필터링
    @Query("SELECT sg FROM StudyGroup sg " +
            "WHERE (:keyword IS NULL OR " +
            "       LOWER(sg.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(sg.type) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:categories IS NULL OR sg.category IN :categories) " +
            "AND (:regions IS NULL OR sg.region IN :regions) " +
            "AND sg.id > :cursor " +
            "ORDER BY sg.id ASC")
    List<StudyGroup> searchWithFilters(
            @Param("keyword") String keyword,
            @Param("categories") List<Category> categories,
            @Param("regions") List<Region> regions,
            @Param("cursor") Long cursor,
            Pageable pageable);

}
