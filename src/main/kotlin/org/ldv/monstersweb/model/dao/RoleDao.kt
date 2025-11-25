package org.ldv.monstersweb.model.dao


import org.ldv.monstersweb.model.entity.Role
import org.springframework.data.jpa.repository.JpaRepository

interface RoleDAO : JpaRepository<Role, Long>{
}