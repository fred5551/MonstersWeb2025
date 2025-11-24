package org.ldv.monstersweb.controller

import org.springframework.security.core.Authentication
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
class MainController {

    /**
     * Page d'accueil de l'application
     */
    @GetMapping("/")
    fun home(): String {
        return "index"
    }

    /**
     * Page de connexion
     * @param error indique si une erreur de connexion s'est produite
     */
    @GetMapping("/login")
    fun login(@RequestParam(required = false) error: Boolean?, model: Model): String {
        // Ajoute un attribut "error" au modèle si la requête contient une erreur
        model.addAttribute("error", error == true)
        return "pagesVisiteur/login"
    }

    /**
     * Page de profil - Redirection selon le rôle
     * - Si ADMIN : redirige vers le dashboard admin
     * - Si CLIENT : affiche la page profil client
     */
    @GetMapping("/profil")
    fun profile(authentication: Authentication): String {
        // Récupération des rôles (authorities) de l'utilisateur connecté
        val roles = authentication.authorities.map { it.authority }

        // Si l'utilisateur est admin → redirection vers le dashboard
        if ("ROLE_ADMIN" in roles) {
            return "redirect:/monsters-web/admin"
        }

        // Sinon → on affiche la page profile client
        return "pagesVisiteur/profile"
    }

    /**
     * Page À propos
     */
    @GetMapping("/a-propos")
    fun aPropos(): String {
        return "pagesVisiteur/a-propos"
    }

    /**
     * Page Contact
     */
    @GetMapping("/contact")
    fun contact(): String {
        return "pagesVisiteur/contact"
    }

    /**
     * Page Inscription
     */
    @GetMapping("/inscription")
    fun inscription(): String {
        return "pagesVisiteur/inscription"
    }

    /**
     * Page Exploration - Réservée aux clients connectés
     */
    @GetMapping("/exploration")
    fun exploration(): String {
        return "pagesVisiteur/exploration"
    }

    /**
     * Page Mon Équipe - Réservée aux clients connectés
     */
    @GetMapping("/mon-equipe")
    fun monEquipe(): String {
        return "pagesVisiteur/mon-equipe"
    }

    /**
     * Page Inventaire - Réservée aux clients connectés
     */
    @GetMapping("/inventaire")
    fun inventaire(): String {
        return "pagesVisiteur/inventaire"
    }

    /**
     * Page Combat - Réservée aux clients connectés
     */
    @GetMapping("/combat")
    fun combat(): String {
        return "pagesVisiteur/combat"
    }

    /**
     * Page RGPD
     */
    @GetMapping("/rgpd")
    fun rgpd(): String {
        return "pagesVisiteur/rgpd"
    }
}