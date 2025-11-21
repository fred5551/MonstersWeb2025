package org.ldv.monstersweb.controller.admincontrollers

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class AdminController {

    /**
     * Page d'accueil de l'administration
     * @return le chemin vers le template admin/index.html
     */
    @GetMapping("/monsters-web/admin")
    fun index(): String {
        return "admin/index"
    }
}