package org.ldv.monstersweb.model.dao

import org.ldv.monstersweb.model.entity.EspeceMonstre
import org.springframework.data.jpa.repository.JpaRepository

interface EspeceMonstreDAO : JpaRepository<EspeceMonstre, Long>{
}