package org.ldv.monstersweb.model.dao


import org.ldv.monstersweb.model.entity.Combat
import org.springframework.data.jpa.repository.JpaRepository

interface CombatDAO : JpaRepository<Combat, Long>{

}