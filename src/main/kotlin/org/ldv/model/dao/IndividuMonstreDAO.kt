package org.ldv.model.dao

import org.ldv.model.entity.IndividuMonstre
import org.springframework.data.jpa.repository.JpaRepository


interface IndividuMonstreDAO : JpaRepository<IndividuMonstre, Long> {
}