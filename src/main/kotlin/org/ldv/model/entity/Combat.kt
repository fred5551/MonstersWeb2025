package org.ldv.model.entity
import jakarta.persistence.*
@Entity
class Combat(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    var resultat: String,
    var date: String // ou LocalDate
)
