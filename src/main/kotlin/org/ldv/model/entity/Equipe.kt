package org.ldv.model.entity
import jakarta.persistence.*
@Entity
class Equipe(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    var nom: String
)
