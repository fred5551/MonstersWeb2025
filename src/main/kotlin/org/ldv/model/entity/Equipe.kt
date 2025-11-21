package org.ldv.model.entity
import jakarta.persistence.*
@Entity
class Equipe(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false)
    var nom: String,

    // Relation ManyToOne avec Utilisateur
    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    var utilisateur: Utilisateur,

    // Relation OneToMany avec IndividuMonstre
    @OneToMany(mappedBy = "equipe", cascade = [CascadeType.ALL])
    var monstres: MutableList<IndividuMonstre> = mutableListOf()
)
