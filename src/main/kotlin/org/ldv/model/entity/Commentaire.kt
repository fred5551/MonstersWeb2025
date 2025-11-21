package org.ldv.model.entity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
class Commentaire(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false, length = 2000)
    var message: String,

    @Column(nullable = false)
    var note: Int, // Entre 1 and 5

    @Column(nullable = false)
    var dateCreation: LocalDateTime = LocalDateTime.now(),

    // Relation ManyToOne avec Utilisateur (auteur)
    @ManyToOne
    @JoinColumn(name = "auteur_id", nullable = false)
    var auteur: Utilisateur,

    // Relation ManyToOne avec EspeceMonstre (espèce commentée)
    @ManyToOne
    @JoinColumn(name = "espece_id", nullable = false)
    var espece: EspeceMonstre
)
