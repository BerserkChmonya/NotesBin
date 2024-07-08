package org.chmonya.kafka;

import org.chmonya.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {
    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = "test-topic", groupId = "group_id")
    public void listen(String message) {
        System.out.println("Listened message: " + message);
    }

    @KafkaListener(topics = "friend-topic", groupId = "group_id")
    public void listenFriend(String message) {
        String[] parts = message.split("\\|");
        if (parts.length == 2) {
            String notificationMessage = parts[0];
            int consumerId;
            try {
                consumerId = Integer.parseInt(parts[1]);
            } catch (NumberFormatException e) {
                System.err.println("Error parsing consumerId from message: " + message);
                return;
            }
            System.out.println("Listened message from friend: " + notificationMessage + " for user: " + consumerId);
            notificationService.notify(consumerId, notificationMessage);
        } else {
            System.err.println("Received message does not conform to expected format: " + message);
        }
    }

    @KafkaListener(topics = "user-topic", groupId = "group_id")
    public void listenUser(String message) {
        System.out.println("Listened message from user: " + message);
    }

}
