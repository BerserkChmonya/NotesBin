package org.chmonya.service;

import org.chmonya.entity.Notification;
import org.chmonya.kafka.KafkaProducer;
import org.chmonya.repository.NotificationRepository;
import org.chmonya.user.entities.User;
import org.chmonya.user.repository.UserRepository;
import org.chmonya.user.service.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Service
public class NotificationService {
    private final KafkaProducer kafkaProducer;
    private final NotificationRepository notificationRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private JWTTokenProvider jwtTokenProvider;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    public NotificationService(KafkaProducer kafkaProducer, NotificationRepository notificationRepository) {
        this.kafkaProducer = kafkaProducer;
        this.notificationRepository = notificationRepository;
    }

    public void sendNotification(String topic, String message) {
        kafkaProducer.sendMessage(topic, message);
    }

    public void notify(int consumerId, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setConsumerId(consumerId);
        notification.setSeen(false);
        notificationRepository.save(notification);

        simpMessagingTemplate.convertAndSend("/topic/notifications/" + consumerId, Collections.singletonMap(notification.getId(), message));
    }

    public List<Notification> getUnseenNotifications(int consumerId) {
        System.out.println("bebra");
        if (!validateUser(consumerId)) {
            throw new IllegalArgumentException("Invalid user");
        }

        return notificationRepository.findByConsumerIdAndSeenFalse(consumerId);
    }

    public void markAsSeen(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        if (!validateUser(notification.getConsumerId())) {
            throw new IllegalArgumentException("Invalid user");
        }

        notification.setSeen(true);
        notificationRepository.save(notification);
    }

    private boolean validateUser(int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not validated with id: " + userId));
        return jwtTokenProvider.validateToken(user.getUsername());
    }
}
