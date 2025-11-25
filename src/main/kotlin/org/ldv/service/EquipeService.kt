package org.ldv.monstersweb.service

import org.ldv.monstersweb.model.dao.EquipeDAO
import org.ldv.monstersweb.model.dao.IndividuMonstreDAO
import org.ldv.monstersweb.model.entity.Equipe
import org.ldv.monstersweb.model.entity.IndividuMonstre
import org.ldv.monstersweb.model.entity.Utilisateur
import org.springframework.stereotype.Service

@Service
class EquipeService(
    private val equipeDAO: EquipeDAO,
    private val individuMonstreDAO: IndividuMonstreDAO
) {

    companion object {
        const val TAILLE_MAX_EQUIPE = 6
    }

    /**
     * Récupère ou crée l'équipe principale d'un joueur
     */
    fun obtenirEquipePrincipale(utilisateur: Utilisateur): Equipe {
        // Cherche l'équipe existante
        val equipeExistante = equipeDAO.findAll()
            .firstOrNull { it.utilisateur.id == utilisateur.id }

        // Si elle existe, on la retourne
        if (equipeExistante != null) {
            return equipeExistante
        }

        // Sinon, on crée une nouvelle équipe
        val nouvelleEquipe = Equipe(
            nom = "Équipe de ${utilisateur.pseudo}",
            utilisateur = utilisateur
        )

        return equipeDAO.save(nouvelleEquipe)
    }

    /**
     * Ajoute un monstre à l'équipe active
     */
    fun ajouterMonstresAEquipe(monstre: IndividuMonstre, equipe: Equipe): Boolean {
        // Vérifie que l'équipe n'est pas pleine
        if (equipe.monstres.size >= TAILLE_MAX_EQUIPE) {
            return false
        }

        // Vérifie que le monstre n'est pas déjà dans l'équipe
        if (equipe.monstres.any { it.id == monstre.id }) {
            return false
        }

        // Ajoute le monstre à l'équipe
        monstre.equipe = equipe
        individuMonstreDAO.save(monstre)

        return true
    }

    /**
     * Retire un monstre de l'équipe active
     */
    fun retirerMonstreDeEquipe(monstre: IndividuMonstre): Boolean {
        if (monstre.equipe == null) {
            return false
        }

        monstre.equipe = null
        individuMonstreDAO.save(monstre)

        return true
    }

    /**
     * Récupère tous les monstres d'un joueur
     */
    fun obtenirMonstresJoueur(utilisateur: Utilisateur): List<IndividuMonstre> {
        return individuMonstreDAO.findAll()
            .filter { it.proprietaire?.id == utilisateur.id }
    }

    /**
     * Récupère les monstres actifs (dans l'équipe)
     */
    fun obtenirMonstresActifs(equipe: Equipe): List<IndividuMonstre> {
        return equipe.monstres.toList()
    }

    /**
     * Récupère les monstres en réserve (hors équipe)
     */
    fun obtenirMonstresReserve(utilisateur: Utilisateur): List<IndividuMonstre> {
        return individuMonstreDAO.findAll()
            .filter {
                it.proprietaire?.id == utilisateur.id && it.equipe == null
            }
    }

    /**
     * Vérifie si un joueur peut ajouter un monstre à son équipe
     */
    fun peutAjouterMonstre(equipe: Equipe): Boolean {
        return equipe.monstres.size < TAILLE_MAX_EQUIPE
    }
}