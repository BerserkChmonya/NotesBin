package org.chmonya.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @SequenceGenerator(name = "notification_sequence", sequenceName = "notification_sequence")
    @GeneratedValue(
            strategy = GenerationType.IDENTITY,
            generator = "notification_sequence"
    )
    private Long id;
    private String message;
    private int consumerId;
    private boolean seen;
}
