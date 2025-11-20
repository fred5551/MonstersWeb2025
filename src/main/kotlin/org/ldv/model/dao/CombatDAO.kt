package org.ldv.model.dao

import org.ldv.model.entity.Combat
import org.springframework.data.jpa.repository.JpaRepository

interface CombatDAO : JpaRepository<Combat, Long>{

}