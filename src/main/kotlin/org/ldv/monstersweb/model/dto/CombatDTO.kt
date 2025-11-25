package org.ldv.monstersweb.dto

import org.ldv.monstersweb.model.entity.IndividuMonstre

/**
 * DTO représentant l'état d'un combat en cours
 */
data class CombatDTO(
    var monstreJoueur: IndividuMonstre,
    var monstreAdverse: IndividuMonstre,
    var tourJoueur: Boolean = true,
    var defenseActive: Boolean = false,
    var historique: MutableList<String> = mutableListOf()
)

/**
 * DTO pour une rencontre avec un monstre sauvage
 */
data class RencontreDTO(
    var monstreSauvage: IndividuMonstre,
    var zone: String,
    var tauxCapture: Int = 50
)

/**
 * DTO pour le résultat d'un combat
 */
data class ResultatCombatDTO(
    var victoire: Boolean,
    var experienceGagnee: Int = 0,
    var orGagne: Int = 0,
    var message: String
)