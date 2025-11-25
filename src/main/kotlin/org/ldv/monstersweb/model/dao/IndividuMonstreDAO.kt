package org.ldv.monstersweb.model.dao


import org.ldv.monstersweb.model.entity.IndividuMonstre
import org.springframework.data.jpa.repository.JpaRepository


interface IndividuMonstreDAO : JpaRepository<IndividuMonstre, Long> {
}