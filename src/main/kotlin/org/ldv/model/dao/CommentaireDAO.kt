package org.ldv.model.dao

import org.ldv.model.entity.Commentaire
import org.springframework.data.jpa.repository.JpaRepository

interface CommentaireDAO : JpaRepository<Commentaire, Long>{

}
