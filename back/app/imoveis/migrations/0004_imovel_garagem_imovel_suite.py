from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imoveis', '0003_imovel_banheiros_imovel_quartos'),
    ]

    operations = [
        migrations.AddField(
            model_name='imovel',
            name='garagem',
            field=models.BooleanField(default=False, verbose_name='Garagem'),
        ),
        migrations.AddField(
            model_name='imovel',
            name='suite',
            field=models.BooleanField(default=False, verbose_name='Suíte'),
        ),
    ]
