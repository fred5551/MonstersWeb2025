package org.ldv.monstersweb.model.dao


import org.ldv.monstersweb.model.entity.Commentaire
import org.springframework.data.jpa.repository.JpaRepository

interface CommentaireDAO : JpaRepository<Commentaire, Long>{

}
