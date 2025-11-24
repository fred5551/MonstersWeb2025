package org.ldv.service

import org.ldv.model.dao.UtilisateurDAO
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

/**
 * Service chargé de charger un utilisateur depuis la base de données
 * pour Spring Security.
 *
 * Cette classe implémente l'interface UserDetailsService, qui est
 * utilisée par Spring Security pour récupérer les informations
 * de l'utilisateur lors de l'authentification.
 */
@Service
class MyUserDetailsService(private val utilisateurDAO: UtilisateurDAO) : UserDetailsService {

    /**
     * Méthode appelée automatiquement par Spring Security lors
     * du login, afin de récupérer un utilisateur grâce à son username.
     *
     * @param username : ici il s'agit de l'email entré dans le formulaire de login
     * @return UserDetails : objet utilisé par Spring Security pour authentifier l'utilisateur.
     */
    override fun loadUserByUsername(username: String): UserDetails {
        /**
         * Récupération de l'utilisateur via son email (username).
         * Si aucun utilisateur n'est trouvé, on lance une exception
         * attendue par Spring Security : UsernameNotFoundException.
         */
        val utilisateur = utilisateurDAO.findByEmail(username)
            ?: throw UsernameNotFoundException("Utilisateur non trouvé avec l'email : $username")

        /**
         * Logique d'attribution du rôle.
         * On récupère le nom du rôle associé à l'utilisateur (ex: "ADMIN", "CLIENT").
         * Ce rôle doit être une chaîne compatible avec Spring Security.
         */
        val leRole = utilisateur.role.nom

        /**
         * Construction de l'objet UserDetails attendu par Spring Security.
         *
         * - .withUsername() = username utilisé pour se connecter
         * - .password() = mot de passe stocké (DOIT être encodé en BCrypt ou autres)
         * - .roles() = rôle(s) attribué(s)
         *
         * ⚠ Attention :
         * Spring Security ajoute automatiquement "ROLE_" devant les rôles.
         * Exemple : roles("ADMIN") deviendra "ROLE_ADMIN"
         */
        return org.springframework.security.core.userdetails.User
            .withUsername(utilisateur.email) // Identifiant de connexion
            .password(utilisateur.password) // Mot de passe hashé
            .roles(leRole) // Rôle(s) attribué(s)
            .build()
    }
}