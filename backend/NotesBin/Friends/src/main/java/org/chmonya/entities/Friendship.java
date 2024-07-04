package org.chmonya.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.chmonya.user.entities.User;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "friendships", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user1_id", "user2_id"})
})
public class Friendship {
    @Id
    @SequenceGenerator(name = "friends_sequence", sequenceName = "friends_sequence")
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "friends_sequence")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private Date createdAt;
}
