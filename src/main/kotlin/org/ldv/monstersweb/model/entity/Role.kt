package org.ldv.monstersweb.model.entity
import jakarta.persistence.*
@Entity
class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var nom: String,

    // Relation OneToMany avec Utilisateur
    @OneToMany(mappedBy = "role", cascade = [CascadeType.ALL])
    var utilisateurs: MutableList<Utilisateur> = mutableListOf()
)