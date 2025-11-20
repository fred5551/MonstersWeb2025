package org.ldv.model.entity

import jakarta.persistence.*

@Entity
class EspeceMonstre(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    var nom: String,
    var type: String,
    var description: String
)
