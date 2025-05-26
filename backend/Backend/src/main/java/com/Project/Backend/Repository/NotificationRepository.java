package com.Project.Backend.Repository;

import com.Project.Backend.Entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Integer> {
    
    // Find all notifications for a specific user
    List<NotificationEntity> findByUserUserIdOrderByNotificationDateDesc(int userId);
    
    // Find all unread notifications for a specific user
    List<NotificationEntity> findByUserUserIdAndIsReadFalseOrderByNotificationDateDesc(int userId);
    
    // Count unread notifications for a specific user
    long countByUserUserIdAndIsReadFalse(int userId);
    
    // Find notifications by type for a specific user
    List<NotificationEntity> findByUserUserIdAndNotificationTypeOrderByNotificationDateDesc(int userId, String notificationType);
}
