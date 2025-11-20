package org.ldv.model.entity
import jakarta.persistence.*
@Entity
class Utilisateur(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    var pseudo: String,
    var email: String,
    var password: String,
    var role : Role
)