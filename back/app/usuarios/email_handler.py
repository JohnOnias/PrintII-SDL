from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """
    Serviço centralizado para envio de e-mails do sistema PrintII.
    Abstrai a lógica de envio e permite o uso de templates HTML.
    """
    
    @staticmethod
    def send_password_reset_email(user, reset_link):
        """
        Envia o e-mail de redefinição de senha para o usuário.
        """
        subject = "Redefinição de Senha - PrintII"
        
        # Contexto para o e-mail
        context = {
            'username': user.username,
            'reset_link': reset_link,
            'frontend_url': settings.FRONTEND_URL
        }
        
        # No futuro, podemos usar templates HTML
        # html_message = render_to_string('emails/password_reset.html', context)
        # plain_message = strip_tags(html_message)
        
        message = (
            f"Olá {user.username},\n\n"
            f"Você solicitou a redefinição de sua senha no PrintII.\n"
            f"Clique no link abaixo para cadastrar uma nova senha:\n\n"
            f"{reset_link}\n\n"
            f"Este link é válido por tempo limitado. Se você não solicitou esta alteração, "
            f"por favor ignore este e-mail.\n\n"
            f"Atenciosamente,\n"
            f"Equipe PrintII"
        )
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            logger.error(f"Erro ao enviar e-mail de redefinição para {user.email}: {str(e)}")
            return False

    @staticmethod
    def send_welcome_email(user):
        """
        Exemplo de outro tipo de e-mail (Boas-vindas).
        """
        subject = "Bem-vindo ao PrintII!"
        message = f"Olá {user.username}, seu cadastro foi realizado com sucesso!"
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            logger.error(f"Erro ao enviar e-mail de boas-vindas para {user.email}: {str(e)}")
            return False
