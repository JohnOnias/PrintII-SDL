from django.db import models

class Usuario(models.Model):
    nome = models.TextField(max_length=100, null=False)
    cpf = models.TextField(max_length=11, null=False)
    idade = models.TextField(null=False)
    sexo = models.TextField(null=False)
    profissao = models.TextField(null=False)
    rua = models.TextField(null=False)
    bairro = models.TextField(null=False)
    cidade = models.TextField(default="Cedro") # levando em conta que se trata do cedro
    estado = models.TextField(default="CE")
    numero = models.IntegerField(null=False)
    email = models.TextField(null=False)
    senha = models.TextField(null=False)

    class UserType(models.TextChoices):
        LOCADOR = 'locador', 'Locador'
        LOCATARIO = 'locatario', 'Locatário'

    tipo_de_usuario = models.CharField(choices=UserType.choices, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome



    

