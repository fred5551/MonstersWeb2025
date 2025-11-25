package org.ldv.monstersweb.service

import org.ldv.monstersweb.dto.RencontreDTO
import org.ldv.monstersweb.model.dao.EspeceMonstreDAO
import org.ldv.monstersweb.model.dao.IndividuMonstreDAO
import org.ldv.monstersweb.model.entity.EspeceMonstre
import org.ldv.monstersweb.model.entity.IndividuMonstre
import org.ldv.monstersweb.model.entity.Utilisateur
import org.springframework.stereotype.Service
import kotlin.random.Random

@Service
class ExplorationService(
    private val especeMonstreDAO: EspeceMonstreDAO,
    private val individuMonstreDAO: IndividuMonstreDAO
) {

    /**
     * Génère une rencontre aléatoire dans une zone
     */
    fun genererRencontre(zone: String): RencontreDTO {
        // Récupère toutes les espèces disponibles
        val especes = especeMonstreDAO.findAll()

        if (especes.isEmpty()) {
            throw IllegalStateException("Aucune espèce de monstre disponible dans la base de données")
        }

        // Sélectionne une espèce aléatoire
        val especeAleatoire = especes[Random.nextInt(especes.size)]

        // Détermine le niveau en fonction de la zone
        val niveauMonstre = obtenirNiveauParZone(zone)

        // Crée un individu sauvage
        val monstreSauvage = creerIndividuSauvage(especeAleatoire, niveauMonstre)

        return RencontreDTO(
            monstreSauvage = monstreSauvage,
            zone = zone,
            tauxCapture = calculerTauxCapture(niveauMonstre)
        )
    }

    /**
     * Détermine le niveau des monstres selon la zone
     */
    private fun obtenirNiveauParZone(zone: String): Int {
        val niveauBase = when (zone.lowercase()) {
            "forest", "foret" -> 3
            "mountain", "montagne" -> 7
            "volcano", "volcan" -> 12
            "ocean" -> 17
            else -> 5
        }

        // Ajoute une variabilité de ±2 niveaux
        return niveauBase + Random.nextInt(-2, 3)
    }

    /**
     * Calcule le taux de capture en fonction du niveau
     */
    private fun calculerTauxCapture(niveau: Int): Int {
        // Plus le monstre est fort, plus il est difficile à capturer
        return when {
            niveau <= 3 -> 80
            niveau <= 7 -> 60
            niveau <= 12 -> 40
            else -> 25
        }
    }

    /**
     * Crée un individu monstre sauvage
     */
    private fun creerIndividuSauvage(espece: EspeceMonstre, niveau: Int): IndividuMonstre {
        // Calcul des stats en fonction du niveau
        val multiplicateurNiveau = 1 + (niveau * 0.1)

        val pv = (espece.pvBase * multiplicateurNiveau).toInt()
        val attaque = (espece.attaqueBase * multiplicateurNiveau).toInt()
        val defense = (espece.defenseBase * multiplicateurNiveau).toInt()

        return IndividuMonstre(
            nom = espece.nom,
            niveau = niveau,
            attaque = attaque,
            defense = defense,
            pv = pv,
            pvMax = pv,
            espece = espece,
            proprietaire = null,
            equipe = null
        )
    }

    /**
     * Tente de capturer un monstre
     */
    fun tenterCapture(rencontre: RencontreDTO, joueur: Utilisateur): Boolean {
        val chanceCaptureBase = rencontre.tauxCapture
        val tirage = Random.nextInt(100)

        val captureReussie = tirage < chanceCaptureBase

        if (captureReussie) {
            // Assigne le monstre au joueur et sauvegarde
            val monstre = rencontre.monstreSauvage
            monstre.proprietaire = joueur
            individuMonstreDAO.save(monstre)
        }

        return captureReussie
    }

    /**
     * Récupère un monstre capturé pour l'ajouter à la collection du joueur
     */
    fun capturerMonstre(especeId: Long, joueur: Utilisateur): IndividuMonstre? {
        val espece = especeMonstreDAO.findById(especeId).orElse(null) ?: return null

        val niveau = Random.nextInt(1, 6)
        val monstre = creerIndividuSauvage(espece, niveau)
        monstre.proprietaire = joueur

        return individuMonstreDAO.save(monstre)
    }
}