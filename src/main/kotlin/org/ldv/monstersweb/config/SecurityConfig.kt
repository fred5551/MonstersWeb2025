package org.ldv.monstersweb.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

/**
 * Configuration de Spring Security pour l'application Monsters Web
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {

    /**
     * Bean pour l'encodage des mots de passe avec BCrypt
     */
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    /**
     * Configuration de la chaîne de filtres de sécurité
     */
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            // Protection CSRF activée (sera configurée plus tard dans le sprint)
            .csrf { it.disable() } // TODO: Réactiver après avoir ajouté les tokens CSRF dans les formulaires

            // Configuration des autorisations d'accès
            .authorizeHttpRequests { auth ->
                // Pages publiques accessibles sans authentification
                auth.requestMatchers(
                    "/",
                    "/inscription",
                    "/a-propos",
                    "/contact",
                    "/rgpd",
                    "/css/**",
                    "/js/**",
                    "/img/**",
                    "/favicon.ico"
                ).permitAll()

                // Pages réservées aux administrateurs
                auth.requestMatchers("/monsters-web/admin/**").hasRole("ADMIN")

                // Pages réservées aux clients/joueurs
                auth.requestMatchers(
                    "/exploration",
                    "/mon-equipe",
                    "/inventaire",
                    "/combat"
                ).hasRole("CLIENT")

                // Toutes les autres requêtes nécessitent une authentification
                auth.anyRequest().authenticated()
            }

            // Configuration du formulaire de connexion
            .formLogin { form ->
                form
                    .loginPage("/login") // Page de login personnalisée
                    .loginProcessingUrl("/login-process") // URL de traitement du formulaire
                    .defaultSuccessUrl("/profil", true) // Redirection après succès
                    .failureUrl("/login?error=true") // Redirection en cas d'échec
                    .usernameParameter("username") // Nom du champ email
                    .passwordParameter("password") // Nom du champ password
                    .permitAll()
            }

            // Configuration de la déconnexion
            .logout { logout ->
                logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
                    .permitAll()
            }

        return http.build()
    }

    /**
     * Bean pour l'AuthenticationManager
     */
    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager {
        return config.authenticationManager
    }
}