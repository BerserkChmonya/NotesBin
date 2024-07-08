package org.chmonya.repository;

import org.chmonya.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>{
    List<Notification> findByConsumerIdAndSeenFalse(int consumerId);
}
