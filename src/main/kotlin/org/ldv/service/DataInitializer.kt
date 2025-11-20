package org.ldv.service

import org.ldv.model.dao.RoleDAO
import org.ldv.model.dao.UtilisateurDAO
import org.ldv.model.entity.Role
import org.ldv.model.entity.Utilisateur
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class DataInitializer(
    val roleDAO: RoleDAO,
    val utilisateurDAO: UtilisateurDAO,
    val  passwordEncoder: PasswordEncoder

): CommandLineRunner {
    override fun run(vararg args: String?) {


        // ROLE
        val roleAdmin = Role(

            nom = "ADMIN"
        )

        val roleClient = Role(

            nom = "CLIENT"
        )

        roleDAO.saveAll(listOf(roleAdmin, roleClient))

//Utilisateurs
        val admin = Utilisateur(
            id = null,
            pseudo = "Super",
            email = "admin@admin.com",
            password = passwordEncoder.encode("admin123"), // mot de passe hashé
            role = roleAdmin
        )

        val client = Utilisateur(
            id = null,
            pseudo = "Jean",
            email = "client@client.com",
            password= passwordEncoder.encode("client123"), // mot de passe hashé
            role = roleClient
        )
        utilisateurDAO.saveAll(listOf(admin, client))
        println("✅ Données initiales insérées : ${roleDAO.count()} Roles, ${utilisateurDAO.count()} utilisateurs.")
    }
}