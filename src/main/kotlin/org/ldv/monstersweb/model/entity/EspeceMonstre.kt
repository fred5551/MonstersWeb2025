package org.ldv.monstersweb.model.entity

import jakarta.persistence.*

@Entity
class EspeceMonstre(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false)
    var nom: String,

    @Column(nullable = false)
    var type: String,

    @Column(length = 1000)
    var description: String,

    @Column(nullable = false)
    var pvBase: Int = 100,

    @Column(nullable = false)
    var attaqueBase: Int = 20,

    @Column(nullable = false)
    var defenseBase: Int = 15,

    // Relation OneToMany avec IndividuMonstre
    @OneToMany(mappedBy = "espece", cascade = [CascadeType.ALL])
    var individus: MutableList<IndividuMonstre> = mutableListOf()
)
