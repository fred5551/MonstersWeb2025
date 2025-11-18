package org.ldv.monstersweb.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class MainController {

    /**
     * Page d'accueil de l'application
     * @return le chemin vers le template index.html
     */
    @GetMapping("/")
    fun home(): String {
        return "index"
    }

    /**
     * Page À propos
     * @return le chemin vers le template a-propos.html
     */
    @GetMapping("/a-propos")
    fun aPropos(): String {
        return "pagesVisiteur/a-propos"
    }

    /**
     * Page Contact
     * @return le chemin vers le template contact.html
     */
    @GetMapping("/contact")
    fun contact(): String {
        return "pagesVisiteur/contact"
    }

    /**
     * Page Inscription
     * @return le chemin vers le template inscription.html
     */
    @GetMapping("/inscription")
    fun inscription(): String {
        return "pagesVisiteur/inscription"
    }

    /**
     * Page Exploration
     * @return le chemin vers le template exploration.html
     */
    @GetMapping("/exploration")
    fun exploration(): String {
        return "pagesVisiteur/exploration"
    }

    /**
     * Page Mon Équipe
     * @return le chemin vers le template mon-equipe.html
     */
    @GetMapping("/mon-equipe")
    fun monEquipe(): String {
        return "pagesVisiteur/mon-equipe"
    }

    /**
     * Page Inventaire
     * @return le chemin vers le template inventaire.html
     */
    @GetMapping("/inventaire")
    fun inventaire(): String {
        return "pagesVisiteur/inventaire"
    }

    /**
     * Page Combat
     * @return le chemin vers le template combat.html
     */
    @GetMapping("/combat")
    fun combat(): String {
        return "pagesVisiteur/combat"
    }

    /**
     * Page RGPD
     * @return le chemin vers le template rgpd.html
     */
    @GetMapping("/rgpd")
    fun rgpd(): String {
        return "pagesVisiteur/rgpd"
    }
}