package org.ldv.monstersweb.service

import org.ldv.monstersweb.dto.CombatDTO
import org.ldv.monstersweb.dto.ResultatCombatDTO
import org.ldv.monstersweb.model.dao.CombatDAO
import org.ldv.monstersweb.model.dao.IndividuMonstreDAO
import org.ldv.monstersweb.model.entity.Combat
import org.ldv.monstersweb.model.entity.IndividuMonstre
import org.ldv.monstersweb.model.entity.Utilisateur
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.math.max
import kotlin.random.Random

@Service
class CombatService(
    private val combatDAO: CombatDAO,
    private val individuMonstreDAO: IndividuMonstreDAO
) {

    /**
     * Calcule les dégâts infligés par un monstre
     */
    fun calculerDegats(attaquant: IndividuMonstre, defenseur: IndividuMonstre, defenseActive: Boolean = false): Int {
        val attaqueEffective = attaquant.attaque
        val defenseEffective = if (defenseActive) {
            (defenseur.defense * 1.5).toInt()
        } else {
            defenseur.defense
        }

        // Formule de dégâts : Attaque - (Défense / 2) + aléatoire
        val degatsBase = attaqueEffective - (defenseEffective / 2)
        val variabilite = Random.nextInt(-5, 6)

        return max(1, degatsBase + variabilite)
    }

    /**
     * Exécute une attaque dans le combat
     */
    fun executerAttaque(combat: CombatDTO): String {
        val degats = calculerDegats(combat.monstreJoueur, combat.monstreAdverse, combat.defenseActive)
        combat.monstreAdverse.pv = max(0, combat.monstreAdverse.pv - degats)

        combat.defenseActive = false
        combat.tourJoueur = false

        return "${combat.monstreJoueur.nom} attaque et inflige $degats dégâts !"
    }

    /**
     * Active la défense pour le prochain tour
     */
    fun executerDefense(combat: CombatDTO): String {
        combat.defenseActive = true
        combat.tourJoueur = false

        return "${combat.monstreJoueur.nom} se met en position défensive !"
    }

    /**
     * L'adversaire attaque
     */
    fun attaqueAdversaire(combat: CombatDTO): String {
        val degats = calculerDegats(combat.monstreAdverse, combat.monstreJoueur, combat.defenseActive)
        combat.monstreJoueur.pv = max(0, combat.monstreJoueur.pv - degats)

        combat.defenseActive = false
        combat.tourJoueur = true

        return "${combat.monstreAdverse.nom} attaque et inflige $degats dégâts !"
    }

    /**
     * Vérifie si le combat est terminé
     */
    fun verifierFinCombat(combat: CombatDTO): ResultatCombatDTO? {
        return when {
            combat.monstreJoueur.pv <= 0 -> {
                ResultatCombatDTO(
                    victoire = false,
                    experienceGagnee = 0,
                    orGagne = 0,
                    message = "Défaite ! ${combat.monstreJoueur.nom} est K.O."
                )
            }
            combat.monstreAdverse.pv <= 0 -> {
                val expGagnee = combat.monstreAdverse.niveau * 10
                val orGagne = combat.monstreAdverse.niveau * 5 + Random.nextInt(10, 30)

                ResultatCombatDTO(
                    victoire = true,
                    experienceGagnee = expGagnee,
                    orGagne = orGagne,
                    message = "Victoire ! Vous avez gagné $expGagnee XP et $orGagne pièces d'or !"
                )
            }
            else -> null
        }
    }

    /**
     * Sauvegarde le résultat d'un combat dans la base de données
     */
    fun sauvegarderCombat(
        joueur: Utilisateur,
        monstreJoueur: IndividuMonstre,
        monstreAdverse: IndividuMonstre,
        resultat: String,
        recompense: Int
    ) {
        val combat = Combat(
            resultat = resultat,
            date = LocalDateTime.now(),
            joueur = joueur,
            monstreJoueur = monstreJoueur,
            monstreAdverse = monstreAdverse,
            recompense = recompense
        )

        combatDAO.save(combat)
    }

    /**
     * Restaure les PV d'un monstre après le combat
     */
    fun restaurerMonstre(monstre: IndividuMonstre) {
        monstre.pv = monstre.pvMax
        individuMonstreDAO.save(monstre)
    }
}