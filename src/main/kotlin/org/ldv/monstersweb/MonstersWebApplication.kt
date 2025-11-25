package org.ldv.monstersweb

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@ComponentScan(basePackages = ["org.ldv.monstersweb", "org.ldv.service"])
@EnableJpaRepositories(basePackages = ["org.ldv.monstersweb.model.dao"])
@EntityScan(basePackages = ["org.ldv.monstersweb.model.entity"])
class MonstersWebApplication

fun main(args: Array<String>) {
    runApplication<MonstersWebApplication>(*args)
}