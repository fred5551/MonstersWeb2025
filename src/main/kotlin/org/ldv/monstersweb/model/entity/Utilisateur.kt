package org.ldv.monstersweb.model.entity
import jakarta.persistence.*

@Entity
class Utilisateur(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var pseudo: String,

    @Column(nullable = false, unique = true)
    var email: String,

    @Column(nullable = false)
    var password: String,

    // Relation ManyToOne avec Role
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    var role: Role,

    // Relation OneToMany avec IndividuMonstre
    @OneToMany(mappedBy = "proprietaire", cascade = [CascadeType.ALL])
    var monstres: MutableList<IndividuMonstre> = mutableListOf(),

    // Relation OneToMany avec Equipe
    @OneToMany(mappedBy = "utilisateur", cascade = [CascadeType.ALL])
    var equipes: MutableList<Equipe> = mutableListOf(),

    // Relation OneToMany avec Commentaire
    @OneToMany(mappedBy = "auteur", cascade = [CascadeType.ALL])
    var commentaires: MutableList<Commentaire> = mutableListOf()
)
