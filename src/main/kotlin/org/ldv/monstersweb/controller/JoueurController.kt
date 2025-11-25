package org.ldv.monstersweb.controller.joueurcontrollers

import org.ldv.monstersweb.model.dao.*
import org.ldv.monstersweb.model.entity.*
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.support.RedirectAttributes
import kotlin.random.Random

@Controller
@RequestMapping("/monsters-web/joueur")
class JoueurController(
    val utilisateurDAO: UtilisateurDAO,
    val especeMonstreDAO: EspeceMonstreDAO,
    val individuMonstreDAO: IndividuMonstreDAO,
    val equipeDAO: EquipeDAO,
    val combatDAO: CombatDAO,
    val commentaireDAO: CommentaireDAO
) {

    /**
     * Page profil du joueur - Point d'entrée principal
     * Affiche les statistiques et permet de commencer une nouvelle partie ou continuer
     */
    @GetMapping("/profil")
    fun index(authentication: Authentication, model: Model): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        // Statistiques du joueur
        val nbMonstres = utilisateur.monstres.size
        val nbCombats = combatDAO.findAll().count { it.joueur.id == utilisateur.id }
        val nbVictoires = combatDAO.findAll().count {
            it.joueur.id == utilisateur.id && it.resultat == "VICTOIRE"
        }
        val equipeActive = utilisateur.equipes.firstOrNull()

        model.addAttribute("utilisateur", utilisateur)
        model.addAttribute("nbMonstres", nbMonstres)
        model.addAttribute("nbCombats", nbCombats)
        model.addAttribute("nbVictoires", nbVictoires)
        model.addAttribute("equipeActive", equipeActive)
        model.addAttribute("hasStarter", nbMonstres > 0)

        return "pagesJoueur/profil"
    }

    /**
     * Affichage des 3 monstres starter
     * Génère 3 individus monstres aléatoires pour que le joueur choisisse
     */
    @GetMapping("/starter")
    fun showStarter(authentication: Authentication, model: Model): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        // Vérifier si le joueur a déjà un starter
        if (utilisateur.monstres.isNotEmpty()) {
            return "redirect:/monsters-web/joueur/zone"
        }

        // Sélectionner 3 espèces aléatoires
        val toutesEspeces = especeMonstreDAO.findAll()
        val especesStarter = toutesEspeces.shuffled().take(3)

        // Créer 3 individus temporaires (non sauvegardés)
        val startersIndividus = especesStarter.map { espece ->
            IndividuMonstre(
                nom = espece.nom,
                niveau = 5,
                attaque = espece.attaqueBase + 5,
                defense = espece.defenseBase + 5,
                pv = espece.pvBase + 25,
                pvMax = espece.pvBase + 25,
                espece = espece
            )
        }

        model.addAttribute("starters", startersIndividus)
        return "pagesJoueur/starter"
    }

    /**
     * Choix du monstre starter
     * Ajoute le monstre choisi à l'inventaire du joueur et crée son équipe
     */
    @GetMapping("/starter/{especeId}")
    fun choixStarter(
        @PathVariable especeId: Long,
        authentication: Authentication,
        redirectAttributes: RedirectAttributes
    ): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        // Vérifier si le joueur a déjà un starter
        if (utilisateur.monstres.isNotEmpty()) {
            return "redirect:/monsters-web/joueur/zone"
        }

        val espece = especeMonstreDAO.findById(especeId).orElseThrow()

        // Créer le monstre starter
        val starter = IndividuMonstre(
            nom = espece.nom,
            niveau = 5,
            attaque = espece.attaqueBase + 5,
            defense = espece.defenseBase + 5,
            pv = espece.pvBase + 25,
            pvMax = espece.pvBase + 25,
            espece = espece,
            proprietaire = utilisateur
        )

        // Créer l'équipe du joueur
        val equipe = Equipe(
            nom = "Équipe de ${utilisateur.pseudo}",
            utilisateur = utilisateur
        )
        equipeDAO.save(equipe)

        // Associer le monstre à l'équipe
        starter.equipe = equipe
        individuMonstreDAO.save(starter)

        redirectAttributes.addFlashAttribute("success",
            "Félicitations ! ${starter.nom} a rejoint votre équipe !")

        return "redirect:/monsters-web/joueur/zone"
    }

    /**
     * Zone de jeu principale
     * Affiche les options d'exploration et de gestion
     */
    @GetMapping("/zone")
    fun zoneJeu(authentication: Authentication, model: Model): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        // Rediriger vers starter si pas de monstre
        if (utilisateur.monstres.isEmpty()) {
            return "redirect:/monsters-web/joueur/starter"
        }

        val equipe = utilisateur.equipes.firstOrNull()
        val monstresActifs = equipe?.monstres ?: emptyList()

        model.addAttribute("utilisateur", utilisateur)
        model.addAttribute("equipe", equipe)
        model.addAttribute("monstresActifs", monstresActifs)
        model.addAttribute("nbMonstresActifs", monstresActifs.size)

        return "pagesJoueur/zone"
    }

    /**
     * Exploration d'une zone
     * Génère une rencontre aléatoire avec un monstre sauvage
     */
    @GetMapping("/exploration/{zone}")
    fun explorer(
        @PathVariable zone: String,
        authentication: Authentication,
        model: Model
    ): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        // Déterminer le niveau selon la zone
        val niveauBase = when(zone) {
            "forest" -> 3
            "mountain" -> 7
            "volcano" -> 12
            "ocean" -> 17
            else -> 3
        }

        // Sélectionner une espèce aléatoire
        val especes = especeMonstreDAO.findAll()
        val especeAleatoire = especes.random()

        // Créer un monstre sauvage
        val niveau = niveauBase + Random.nextInt(-2, 3)
        val monstreSauvage = IndividuMonstre(
            nom = especeAleatoire.nom,
            niveau = niveau,
            attaque = especeAleatoire.attaqueBase + (niveau * 2),
            defense = especeAleatoire.defenseBase + (niveau * 2),
            pv = especeAleatoire.pvBase + (niveau * 5),
            pvMax = especeAleatoire.pvBase + (niveau * 5),
            espece = especeAleatoire
        )

        // Sauvegarder temporairement le monstre (sans propriétaire)
        individuMonstreDAO.save(monstreSauvage)

        model.addAttribute("monstreSauvage", monstreSauvage)
        model.addAttribute("zone", zone)
        model.addAttribute("utilisateur", utilisateur)

        return "pagesJoueur/rencontre"
    }

    /**
     * Tentative de capture d'un monstre
     */
    @PostMapping("/capturer/{idMonstre}")
    fun capturerMonstre(
        @PathVariable idMonstre: Long,
        authentication: Authentication,
        redirectAttributes: RedirectAttributes
    ): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        val monstre = individuMonstreDAO.findById(idMonstre).orElseThrow()

        // Calcul du taux de capture (50% base + bonus selon niveau)
        val tauxCapture = 50 + (10 - monstre.niveau.coerceIn(1, 10)) * 5
        val reussite = Random.nextInt(100) < tauxCapture

        if (reussite) {
            // Capture réussie
            monstre.proprietaire = utilisateur

            // Si l'équipe a moins de 6 monstres, ajouter automatiquement
            val equipe = utilisateur.equipes.firstOrNull()
            if (equipe != null && equipe.monstres.size < 6) {
                monstre.equipe = equipe
            }

            individuMonstreDAO.save(monstre)

            redirectAttributes.addFlashAttribute("success",
                "Félicitations ! Vous avez capturé ${monstre.nom} !")
        } else {
            // Capture échouée - supprimer le monstre temporaire
            individuMonstreDAO.delete(monstre)

            redirectAttributes.addFlashAttribute("error",
                "${monstre.nom} s'est échappé...")
        }

        return "redirect:/monsters-web/joueur/zone"
    }

    /**
     * Affichage de l'équipe complète
     */
    @GetMapping("/equipe")
    fun afficherEquipe(authentication: Authentication, model: Model): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        val equipe = utilisateur.equipes.firstOrNull()
        val monstresActifs = equipe?.monstres ?: emptyList()
        val monstresReserve = utilisateur.monstres.filter { it.equipe == null }

        model.addAttribute("utilisateur", utilisateur)
        model.addAttribute("equipe", equipe)
        model.addAttribute("monstresActifs", monstresActifs)
        model.addAttribute("monstresReserve", monstresReserve)
        model.addAttribute("peutAjouter", monstresActifs.size < 6)

        return "pagesJoueur/equipe"
    }

    /**
     * Activer un monstre dans l'équipe
     */
    @PostMapping("/equipe/activer/{idMonstre}")
    fun activerMonstre(
        @PathVariable idMonstre: Long,
        authentication: Authentication,
        redirectAttributes: RedirectAttributes
    ): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        val equipe = utilisateur.equipes.firstOrNull()
        val monstre = individuMonstreDAO.findById(idMonstre).orElseThrow()

        // Vérifier que le monstre appartient au joueur
        if (monstre.proprietaire?.id != utilisateur.id) {
            redirectAttributes.addFlashAttribute("error", "Ce monstre ne vous appartient pas !")
            return "redirect:/monsters-web/joueur/equipe"
        }

        // Vérifier la limite de 6 monstres
        if (equipe != null && equipe.monstres.size >= 6) {
            redirectAttributes.addFlashAttribute("error",
                "Votre équipe est complète (maximum 6 monstres) !")
            return "redirect:/monsters-web/joueur/equipe"
        }

        // Ajouter le monstre à l'équipe
        if (equipe != null) {
            monstre.equipe = equipe
            individuMonstreDAO.save(monstre)
            redirectAttributes.addFlashAttribute("success",
                "${monstre.nom} a rejoint votre équipe active !")
        }

        return "redirect:/monsters-web/joueur/equipe"
    }

    /**
     * Désactiver un monstre de l'équipe
     */
    @PostMapping("/equipe/desactiver/{idMonstre}")
    fun desactiverMonstre(
        @PathVariable idMonstre: Long,
        authentication: Authentication,
        redirectAttributes: RedirectAttributes
    ): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        val monstre = individuMonstreDAO.findById(idMonstre).orElseThrow()

        // Vérifier que le monstre appartient au joueur
        if (monstre.proprietaire?.id != utilisateur.id) {
            redirectAttributes.addFlashAttribute("error", "Ce monstre ne vous appartient pas !")
            return "redirect:/monsters-web/joueur/equipe"
        }

        // Retirer le monstre de l'équipe
        monstre.equipe = null
        individuMonstreDAO.save(monstre)

        redirectAttributes.addFlashAttribute("success",
            "${monstre.nom} a été retiré de votre équipe active.")

        return "redirect:/monsters-web/joueur/equipe"
    }

    /**
     * Affichage de l'inventaire (pour future implémentation)
     */
    @GetMapping("/inventaire")
    fun afficherInventaire(authentication: Authentication, model: Model): String {
        val utilisateur = utilisateurDAO.findByEmail(authentication.name)
            ?: return "redirect:/login"

        model.addAttribute("utilisateur", utilisateur)
        // TODO: Implémenter système d'inventaire avec objets

        return "pagesJoueur/inventaire"
    }
}