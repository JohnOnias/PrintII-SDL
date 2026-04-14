from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializer import UserSerializer

@api_view(['POST'])
def create(request):
    serilazer = UserSerializer(data = request.data)

    if serilazer.is_valid():
        serilazer.save()

        return Response(serilazer.data, status=status.HTTP_201_CREATED)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def destroy(request):
    pass

@api_view(['GET'])
def all(request):
    pass

@api_view(['PUT'])
def update(request, id):
    pass