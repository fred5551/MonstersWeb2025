package org.ldv.model.entity
import jakarta.persistence.*
@Entity
class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?=null,

    var nom: String
)