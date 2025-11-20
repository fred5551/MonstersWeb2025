package org.ldv.model.dao
import org.ldv.model.entity.Utilisateur
import org.springframework.data.jpa.repository.JpaRepository

interface UtilisateurDAO : JpaRepository<Utilisateur, Long>{
}