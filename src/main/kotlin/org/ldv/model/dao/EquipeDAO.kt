package org.ldv.model.dao

import org.ldv.model.entity.Equipe
import org.springframework.data.jpa.repository.JpaRepository

interface EspeceDAO : JpaRepository<Equipe, Long>{

}

