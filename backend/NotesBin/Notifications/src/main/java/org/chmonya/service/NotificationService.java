package org.chmonya.service;

import org.chmonya.kafka.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final KafkaProducer kafkaProducer;
    @Autowired
    public NotificationService(KafkaProducer kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }
}
