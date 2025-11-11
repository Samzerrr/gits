// ⚙️ CONFIGURATION - Remplacez cette URL par votre webhook Discord
// Pour créer un webhook : Paramètres du serveur > Intégrations > Webhooks > Nouveau webhook
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1437932552592560208/AwRcp_YAkKAhv1cXe_No4ZqLqI2QOfzQjKeWirZS42cvjEtCktN4d6b9mlo5L_VYaTpJ';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recruitmentForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = document.querySelector('.btn-submit');

    // Validation personnalisée
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Vérifier que le webhook est configuré
        if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === 'VOTRE_WEBHOOK_URL_ICI') {
            alert('⚠️ Erreur de configuration : Le webhook Discord n\'est pas configuré. Veuillez contacter l\'administrateur.');
            console.error('Webhook Discord non configuré dans script.js');
            return;
        }

        // Vérifier que la case de validation est cochée
        const validationCheckbox = document.getElementById('validation');
        if (!validationCheckbox.checked) {
            alert('⚠️ Vous devez accepter les conditions pour envoyer votre candidature.');
            validationCheckbox.focus();
            return;
        }

        // Vérifier que Discord est au bon format (optionnel mais recommandé)
        const discordInput = document.getElementById('discord');
        const discordValue = discordInput.value.trim();
        if (discordValue && !discordValue.includes('#')) {
            if (!confirm('⚠️ Votre identifiant Discord ne contient pas de "#". Êtes-vous sûr de votre identifiant ? (Exemple : Nom#1234)')) {
                discordInput.focus();
                return;
            }
        }

        // Désactiver le bouton pendant l'envoi
        submitButton.disabled = true;
        submitButton.textContent = '⏳ Envoi en cours...';

        // Récupérer les données du formulaire
        const formData = new FormData(form);
        const data = {};
        
        // Récupérer tous les champs
        for (let [key, value] of formData.entries()) {
            if (key === 'activites') {
                // Pour les checkboxes, créer un tableau
                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }

        // Formater les données pour Discord
        const discordEmbed = formatDiscordEmbed(data);

        // Envoyer à Discord
        sendToDiscord(discordEmbed)
            .then(() => {
                showSuccessMessage();
                form.reset();
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi:', error);
                alert('❌ Une erreur est survenue lors de l\'envoi de votre candidature. Veuillez réessayer ou contacter un administrateur.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = '⚔️ Envoyer ma candidature';
            });
    });

    function formatDiscordEmbed(data) {
        // Traduire les valeurs pour un affichage plus lisible
        const experienceMap = {
            'debutant': 'Débutant',
            'intermediaire': 'Intermédiaire',
            'experimente': 'Expérimenté',
            'veteran': 'Vétéran'
        };

        const activitesMap = {
            'pvp': 'PvP (ZvZ, GvG, petits comités)',
            'pve': 'PvE (donjons, world bosses, etc.)',
            'gathering': 'Gathering / Crafting',
            'economie': 'Économie / Marché',
            'exploration': 'Exploration / Transport'
        };

        const participationMap = {
            'oui': 'Oui',
            'non': 'Non',
            'selon': 'Selon mes disponibilités'
        };

        // Construire la liste des activités
        let activitesList = 'Aucune';
        if (data.activites && data.activites.length > 0) {
            activitesList = data.activites.map(a => activitesMap[a] || a).join('\n• ');
            activitesList = '• ' + activitesList;
        }

        // Construire l'embed Discord
        const embed = {
            title: '🛡️ Nouvelle Candidature — Recrutement Guilde',
            color: 0xFFD700, // Couleur or
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: '🔰 Informations générales',
                    value: `**Pseudo :** ${data.pseudo || 'Non renseigné'}\n**Discord :** ${data.discord || 'Non renseigné'}\n**Âge :** ${data.age || 'Non renseigné'}\n**Région :** ${data.region || 'Non renseigné'}`,
                    inline: false
                },
                {
                    name: '⚒️ Expérience de jeu',
                    value: `**Niveau :** ${experienceMap[data.experience] || data.experience || 'Non renseigné'}\n**Rôle préféré :** ${data.role || 'Non renseigné'}\n**IP moyen :** ${data.ip || 'Non renseigné'}`,
                    inline: false
                },
                {
                    name: '⚔️ Activités préférées',
                    value: activitesList,
                    inline: false
                },
                {
                    name: '📅 Disponibilité',
                    value: data.tempsJeu || 'Non renseigné',
                    inline: false
                },
                {
                    name: '🏰 Engagement',
                    value: `**Participation aux events :** ${participationMap[data.participation] || data.participation || 'Non renseigné'}\n**Micro/Discord :** ${data.discordMicro === 'oui' ? '✅ Oui' : '❌ Non'}`,
                    inline: false
                }
            ],
            footer: {
                text: 'Formulaire de recrutement — Albion Online'
            }
        };

        // Ajouter les champs optionnels s'ils sont remplis
        if (data.anciennesGuildes && data.anciennesGuildes.trim()) {
            embed.fields.push({
                name: '📜 Anciennes guildes',
                value: data.anciennesGuildes.substring(0, 1024), // Limite Discord
                inline: false
            });
        }

        if (data.recherche && data.recherche.trim()) {
            embed.fields.push({
                name: '🎯 Recherche dans une guilde',
                value: data.recherche.substring(0, 1024),
                inline: false
            });
        }

        if (data.autre && data.autre.trim()) {
            embed.fields.push({
                name: '💬 Message supplémentaire',
                value: data.autre.substring(0, 1024),
                inline: false
            });
        }

        return {
            embeds: [embed]
        };
    }

    async function sendToDiscord(embedData) {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(embedData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur Discord: ${response.status} - ${errorText}`);
        }

        return response;
    }

    function showSuccessMessage() {
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Animation d'apparition
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            successMessage.style.transition = 'all 0.5s ease';
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 10);
    }

    // Amélioration UX : Animation au survol des sections
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Validation en temps réel pour Discord
    const discordInput = document.getElementById('discord');
    discordInput.addEventListener('blur', function() {
        const value = this.value.trim();
        if (value && !value.includes('#')) {
            this.style.borderColor = '#ff6b6b';
            this.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.5)';
        } else {
            this.style.borderColor = '#654321';
            this.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.5)';
        }
    });

    // Animation des inputs au focus
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

