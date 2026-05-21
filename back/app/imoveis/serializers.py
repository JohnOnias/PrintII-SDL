from rest_framework import serializers
from .models import Imovel, ImovelMidia

class ImovelMidiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImovelMidia
        fields = ['id', 'arquivo', 'created_at']

class ImovelSerializer(serializers.ModelSerializer):
    midias = ImovelMidiaSerializer(many=True, read_only=True)
    midias_upload = serializers.ListField(
        child=serializers.FileField(max_length=10000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    def validate_midias_upload(self, value):
        allowed_types = ['image/png', 'image/jpg', 'image/jpeg']
        max_total_size = 100 * 1024 * 1024

        total_size = 0
        for file in value:
            if file.content_type not in allowed_types:
                raise serializers.ValidationError(
                    f"Apenas imagens PNG, JPG e JPEG são permitidas. Tipo recebido: {file.content_type}"
                )
            total_size += file.size

        if total_size > max_total_size:
            raise serializers.ValidationError("O tamanho total das imagens não pode exceder 100MB.")

        return value
    midias_remover = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Imovel
        fields = ['id', 'locador', 'tipo', 'categoria', 'endereco', 'descricao', 'valor', 'status', 'midias', 'midias_upload', 'midias_remover', 'created_at', 'updated_at']
        read_only_fields = ['locador']

    def create(self, validated_data):
        midias_data = validated_data.pop('midias_upload', [])
        validated_data.pop('midias_remover', None) # Ignora se vier no create
        imovel = Imovel.objects.create(**validated_data)
        
        for midia in midias_data:
            ImovelMidia.objects.create(imovel=imovel, arquivo=midia)
            
        return imovel

    def update(self, instance, validated_data):
        midias_data = validated_data.pop('midias_upload', [])
        midias_remover = validated_data.pop('midias_remover', [])
        
        # Remove mídias selecionadas
        if midias_remover:
            ImovelMidia.objects.filter(id__in=midias_remover, imovel=instance).delete()
            
        # Atualiza os campos do imóvel
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Adiciona novas mídias se houver
        for midia in midias_data:
            ImovelMidia.objects.create(imovel=instance, arquivo=midia)
            
        return instance
