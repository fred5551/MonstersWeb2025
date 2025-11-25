package org.ldv.monstersweb.model.entity
import jakarta.persistence.*

@Entity
class IndividuMonstre(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false)
    var nom: String,

    @Column(nullable = false)
    var niveau: Int = 1,

    @Column(nullable = false)
    var attaque: Int,

    @Column(nullable = false)
    var defense: Int,

    @Column(nullable = false)
    var pv: Int,

    @Column(nullable = false)
    var pvMax: Int,

    // Relation ManyToOne avec EspeceMonstre
    @ManyToOne
    @JoinColumn(name = "espece_id", nullable = false)
    var espece: EspeceMonstre,

    // Relation ManyToOne avec Utilisateur (propriétaire)
    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    var proprietaire: Utilisateur? = null,

    // Relation ManyToOne avec Equipe
    @ManyToOne
    @JoinColumn(name = "equipe_id")
    var equipe: Equipe? = null
)
