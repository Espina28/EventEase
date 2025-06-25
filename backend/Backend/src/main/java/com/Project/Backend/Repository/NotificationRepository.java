package com.Project.Backend.Repository;

import com.Project.Backend.Entity.NotificationEntity;
import com.Project.Backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Integer> {
    
    // Find all notifications for a specific user
    List<NotificationEntity> findByUser(UserEntity user);
    
    // Find all unread notifications for a specific user
    List<NotificationEntity> findByUserAndIsReadFalseOrderByNotificationDateDesc(UserEntity user);
    
    // Count unread notifications for a specific user
    long countByUserAndIsReadFalse(UserEntity user);
    
    // Find notifications by type for a specific user
    List<NotificationEntity> findByUserAndNotificationTypeOrderByNotificationDateDesc(UserEntity user, String notificationType);
}
