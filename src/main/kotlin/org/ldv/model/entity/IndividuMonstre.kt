package org.ldv.model.entity
import jakarta.persistence.*

@Entity
class IndividuMonstre(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    var nom: String,
    var niveau: Int,
    var attaque: Int,
    var defense: Int,
    var pv: Int
)
