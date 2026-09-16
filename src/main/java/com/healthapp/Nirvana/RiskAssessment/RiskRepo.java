package com.healthapp.Nirvana.RiskAssessment;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "risk_assessment")
public class RiskRepo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer riskScore;

    @Column(nullable = false)
    private String riskLevel;

    @Column(nullable = false)
    private String trend;

    @ElementCollection
    private List<String> factors;

    @Column(nullable = false)
    private LocalDateTime computedAt;

}
