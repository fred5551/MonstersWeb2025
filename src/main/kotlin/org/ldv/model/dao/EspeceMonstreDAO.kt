package org.ldv.model.dao
import org.ldv.model.entity.EspeceMonstre
import org.springframework.data.jpa.repository.JpaRepository

interface EspeceMonstreDAO : JpaRepository<EspeceMonstre, Long>{
}