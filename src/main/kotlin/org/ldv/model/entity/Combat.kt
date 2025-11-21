package org.ldv.model.entity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
class Combat(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false)
    var resultat: String, // "VICTOIRE", "DEFAITE", "NUL"

    @Column(nullable = false)
    var date: LocalDateTime = LocalDateTime.now(),

    // Relation ManyToOne avec Utilisateur (joueur)
    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    var joueur: Utilisateur,

    // Relation ManyToOne avec IndividuMonstre (monstre du joueur)
    @ManyToOne
    @JoinColumn(name = "monstre_joueur_id", nullable = false)
    var monstreJoueur: IndividuMonstre,

    // Relation ManyToOne avec IndividuMonstre (monstre adverse)
    @ManyToOne
    @JoinColumn(name = "monstre_adverse_id", nullable = false)
    var monstreAdverse: IndividuMonstre,

    @Column
    var recompense: Int = 0 // Or gagné
)

