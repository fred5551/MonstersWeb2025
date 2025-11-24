package org.ldv.service

import org.ldv.model.dao.*
import org.ldv.model.entity.*
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class DataInitializer(
    val roleDAO: RoleDAO,
    val utilisateurDAO: UtilisateurDAO,
    val especeMonstreDAO: EspeceMonstreDAO,
    val individuMonstreDAO: IndividuMonstreDAO,
    val equipeDAO: EquipeDAO,
    val combatDAO: CombatDAO,
    val commentaireDAO: CommentaireDAO,
    val passwordEncoder: PasswordEncoder // Injection de l'encoder
): CommandLineRunner {

    override fun run(vararg args: String?) {

        // Vérifie si la base contient déjà des données
        if (roleDAO.count() > 0) {
            println("ℹ️ Données déjà présentes, initialisation ignorée.")
            return
        }

        println("🚀 Initialisation des données...")

        // === ROLES ===
        println("📝 Création des rôles...")
        val roleAdmin = Role(nom = "ADMIN")
        val roleClient = Role(nom = "CLIENT")
        roleDAO.saveAll(listOf(roleAdmin, roleClient))
        println("✅ Rôles créés : ADMIN, CLIENT")

        // === UTILISATEURS ===
        println("👥 Création des utilisateurs...")
        val admin = Utilisateur(
            pseudo = "SuperAdmin",
            email = "admin@admin.com",
            password = passwordEncoder.encode("admin123"), // Mot de passe hashé
            role = roleAdmin
        )

        val client = Utilisateur(
            pseudo = "Jean",
            email = "client@client.com",
            password = passwordEncoder.encode("client123"), // Mot de passe hashé
            role = roleClient
        )

        val marie = Utilisateur(
            pseudo = "Marie",
            email = "marie@client.com",
            password = passwordEncoder.encode("marie123"), // Mot de passe hashé
            role = roleClient
        )

        utilisateurDAO.saveAll(listOf(admin, client, marie))
        println("✅ Utilisateurs créés :")
        println("   - Admin : admin@admin.com / admin123")
        println("   - Client : client@client.com / client123")
        println("   - Marie : marie@client.com / marie123")

        // === ESPECES DE MONSTRES ===
        println("🐉 Création des espèces de monstres...")
        val dracoflame = EspeceMonstre(
            nom = "Dracoflame",
            type = "Feu",
            description = "Un dragon de feu puissant et majestueux",
            pvBase = 120,
            attaqueBase = 45,
            defenseBase = 35
        )

        val aquashark = EspeceMonstre(
            nom = "Aquashark",
            type = "Eau",
            description = "Un requin des profondeurs redoutable",
            pvBase = 100,
            attaqueBase = 40,
            defenseBase = 40
        )

        val terravolt = EspeceMonstre(
            nom = "Terravolt",
            type = "Terre",
            description = "Un rhinocéros blindé d'une force colossale",
            pvBase = 140,
            attaqueBase = 35,
            defenseBase = 50
        )

        val voltflash = EspeceMonstre(
            nom = "Voltflash",
            type = "Électrique",
            description = "Un éclair vivant ultra rapide",
            pvBase = 90,
            attaqueBase = 50,
            defenseBase = 30
        )

        val frostbite = EspeceMonstre(
            nom = "Frostbite",
            type = "Glace",
            description = "Un loup de glace qui gèle ses ennemis",
            pvBase = 110,
            attaqueBase = 42,
            defenseBase = 38
        )

        especeMonstreDAO.saveAll(listOf(dracoflame, aquashark, terravolt, voltflash, frostbite))
        println("✅ ${especeMonstreDAO.count()} espèces créées")

        // === INDIVIDUS MONSTRES ===
        println("👾 Création des individus monstres...")
        val flamby = IndividuMonstre(
            nom = "Flamby",
            niveau = 5,
            attaque = 55,
            defense = 40,
            pv = 145,
            pvMax = 145,
            espece = dracoflame,
            proprietaire = client
        )

        val splash = IndividuMonstre(
            nom = "Splash",
            niveau = 4,
            attaque = 48,
            defense = 44,
            pv = 116,
            pvMax = 116,
            espece = aquashark,
            proprietaire = client
        )

        val rocky = IndividuMonstre(
            nom = "Rocky",
            niveau = 6,
            attaque = 47,
            defense = 62,
            pv = 170,
            pvMax = 170,
            espece = terravolt,
            proprietaire = marie
        )

        val zappy = IndividuMonstre(
            nom = "Zappy",
            niveau = 7,
            attaque = 64,
            defense = 37,
            pv = 125,
            pvMax = 125,
            espece = voltflash,
            proprietaire = marie
        )

        val freezy = IndividuMonstre(
            nom = "Freezy",
            niveau = 3,
            attaque = 48,
            defense = 44,
            pv = 119,
            pvMax = 119,
            espece = frostbite,
            proprietaire = admin
        )

        individuMonstreDAO.saveAll(listOf(flamby, splash, rocky, zappy, freezy))
        println("✅ ${individuMonstreDAO.count()} individus monstres créés")

        // === EQUIPES ===
        println("⚔️ Création des équipes...")
        val equipeJean = Equipe(
            nom = "Équipe Fire & Water",
            utilisateur = client
        )

        val equipeMarie = Equipe(
            nom = "Équipe Puissance",
            utilisateur = marie
        )

        equipeDAO.saveAll(listOf(equipeJean, equipeMarie))

        // Associer les monstres aux équipes
        flamby.equipe = equipeJean
        splash.equipe = equipeJean
        rocky.equipe = equipeMarie
        zappy.equipe = equipeMarie

        individuMonstreDAO.saveAll(listOf(flamby, splash, rocky, zappy))
        println("✅ ${equipeDAO.count()} équipes créées")

        // === COMBATS ===
        println("🥊 Création des combats...")
        val combat1 = Combat(
            resultat = "VICTOIRE",
            date = LocalDateTime.now().minusDays(2),
            joueur = client,
            monstreJoueur = flamby,
            monstreAdverse = freezy,
            recompense = 50
        )

        val combat2 = Combat(
            resultat = "DEFAITE",
            date = LocalDateTime.now().minusDays(1),
            joueur = marie,
            monstreJoueur = rocky,
            monstreAdverse = flamby,
            recompense = 0
        )

        combatDAO.saveAll(listOf(combat1, combat2))
        println("✅ ${combatDAO.count()} combats créés")

        // === COMMENTAIRES ===
        println("💬 Création des commentaires...")
        val commentaire1 = Commentaire(
            message = "Dracoflame est vraiment impressionnant ! Très puissant en attaque.",
            note = 5,
            dateCreation = LocalDateTime.now().minusDays(3),
            auteur = client,
            espece = dracoflame
        )

        val commentaire2 = Commentaire(
            message = "Aquashark est équilibré, parfait pour débuter.",
            note = 4,
            dateCreation = LocalDateTime.now().minusDays(2),
            auteur = marie,
            espece = aquashark
        )

        val commentaire3 = Commentaire(
            message = "Terravolt est un tank incroyable mais un peu lent.",
            note = 4,
            dateCreation = LocalDateTime.now().minusDays(1),
            auteur = client,
            espece = terravolt
        )

        commentaireDAO.saveAll(listOf(commentaire1, commentaire2, commentaire3))
        println("✅ ${commentaireDAO.count()} commentaires créés")

        println("\n✅ ===== INITIALISATION TERMINÉE =====")
        println("   - ${roleDAO.count()} rôles")
        println("   - ${utilisateurDAO.count()} utilisateurs")
        println("   - ${especeMonstreDAO.count()} espèces de monstres")
        println("   - ${individuMonstreDAO.count()} individus monstres")
        println("   - ${equipeDAO.count()} équipes")
        println("   - ${combatDAO.count()} combats")
        println("   - ${commentaireDAO.count()} commentaires")
        println("=====================================\n")
    }
}