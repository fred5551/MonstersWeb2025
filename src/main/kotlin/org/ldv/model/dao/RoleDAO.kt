package org.ldv.model.dao

import org.ldv.model.entity.Role
import org.springframework.data.jpa.repository.JpaRepository

interface RoleDAO : JpaRepository<Role, Long>{
}