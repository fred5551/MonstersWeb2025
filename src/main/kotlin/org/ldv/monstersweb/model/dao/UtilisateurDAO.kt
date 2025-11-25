package org.ldv.monstersweb.model.dao

import org.ldv.monstersweb.model.entity.Utilisateur
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface UtilisateurDAO : JpaRepository<Utilisateur, Long>{
    /**
     * Recherche un utilisateur par son email
     * @param email L'adresse email de l'utilisateur
     * @return L'utilisateur correspondant ou null si non trouvé
     */
    @Query("select u from Utilisateur u where u.email = ?1")
    fun findByEmail(email: String): Utilisateur?
}