package org.ldv.model.entity
import jakarta.persistence.*
@Entity
class Commentaire(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    var message: String,
    var note: Int
)
