package org.ldv.monstersweb.model.dao


import org.ldv.monstersweb.model.entity.Equipe
import org.springframework.data.jpa.repository.JpaRepository

interface EquipeDAO : JpaRepository<Equipe, Long> {

}
