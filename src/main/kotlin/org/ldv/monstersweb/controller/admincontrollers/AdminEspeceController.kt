package org.ldv.monstersweb.controller.admincontrollers

import org.ldv.model.dao.EspeceMonstreDAO
import org.ldv.model.entity.EspeceMonstre
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.support.RedirectAttributes

@Controller
@RequestMapping("/monsters-web/admin/especes")
class AdminEspeceController(
    val especeMonstreDAO: EspeceMonstreDAO
) {

    // INDEX - Afficher toutes les espèces
    @GetMapping
    fun index(model: Model): String {
        val especes = especeMonstreDAO.findAll()
        model.addAttribute("especes", especes)
        return "admin/espece/index"
    }

    // SHOW - Afficher une espèce
    @GetMapping("/{id}")
    fun show(@PathVariable id: Long, model: Model): String {
        val espece = especeMonstreDAO.findById(id).orElseThrow()
        model.addAttribute("espece", espece)
        return "admin/espece/show"
    }

    // CREATE - Formulaire de création
    @GetMapping("/create")
    fun create(model: Model): String {
        model.addAttribute("espece", EspeceMonstre(
            nom = "",
            type = "",
            description = ""
        ))
        return "admin/espece/create"
    }

    // STORE - Enregistrer une nouvelle espèce
    @PostMapping
    fun store(
        @RequestParam nom: String,
        @RequestParam type: String,
        @RequestParam description: String,
        @RequestParam pvBase: Int,
        @RequestParam attaqueBase: Int,
        @RequestParam defenseBase: Int,
        redirectAttributes: RedirectAttributes
    ): String {
        val espece = EspeceMonstre(
            nom = nom,
            type = type,
            description = description,
            pvBase = pvBase,
            attaqueBase = attaqueBase,
            defenseBase = defenseBase
        )
        especeMonstreDAO.save(espece)
        redirectAttributes.addFlashAttribute("success", "Espèce créée avec succès !")
        return "redirect:/monsters-web/admin/especes"
    }

    // EDIT - Formulaire de modification
    @GetMapping("/edit/{id}")
    fun edit(@PathVariable id: Long, model: Model): String {
        val espece = especeMonstreDAO.findById(id).orElseThrow()
        model.addAttribute("espece", espece)
        return "admin/espece/edit"
    }

    // UPDATE - Modifier une espèce
    @PostMapping("/update/{id}")
    fun update(
        @PathVariable id: Long,
        @RequestParam nom: String,
        @RequestParam type: String,
        @RequestParam description: String,
        @RequestParam pvBase: Int,
        @RequestParam attaqueBase: Int,
        @RequestParam defenseBase: Int,
        redirectAttributes: RedirectAttributes
    ): String {
        val espece = especeMonstreDAO.findById(id).orElseThrow()
        espece.nom = nom
        espece.type = type
        espece.description = description
        espece.pvBase = pvBase
        espece.attaqueBase = attaqueBase
        espece.defenseBase = defenseBase
        especeMonstreDAO.save(espece)
        redirectAttributes.addFlashAttribute("success", "Espèce modifiée avec succès !")
        return "redirect:/monsters-web/admin/especes"
    }

    // DELETE - Supprimer une espèce
    @GetMapping("/delete/{id}")
    fun delete(@PathVariable id: Long, redirectAttributes: RedirectAttributes): String {
        especeMonstreDAO.deleteById(id)
        redirectAttributes.addFlashAttribute("success", "Espèce supprimée avec succès !")
        return "redirect:/monsters-web/admin/especes"
    }
}