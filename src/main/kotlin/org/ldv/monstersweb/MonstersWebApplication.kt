package org.ldv.monstersweb

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MonstersWebApplication

fun main(args: Array<String>) {
    runApplication<MonstersWebApplication>(*args)
}
