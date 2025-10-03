from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Trip
from .serializers import TripSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class TripViewSet(viewsets.ModelViewSet):
	queryset = Trip.objects.prefetch_related("activities").all()
	serializer_class = TripSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

	def get_queryset(self):
		if self.action in ["retrieve"] and self.request.method == "GET":
			return Trip.objects.prefetch_related("activities").all()
		if self.action == "share":
			return Trip.objects.prefetch_related("activities").all()
		user = self.request.user
		if not user or not user.is_authenticated:
			return Trip.objects.none()
		return Trip.objects.prefetch_related("activities").filter(owner=user)

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		serializer.save(owner=request.user if request.user.is_authenticated else None)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

	@action(detail=False, methods=['get'], url_path='share/(?P<share_token>[^/.]+)')
	def share(self, request, share_token=None):
		"""Bonus: Shareable link endpoint"""
		trip = get_object_or_404(Trip, share_token=share_token)
		serializer = self.get_serializer(trip)
		return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
	username = request.data.get('username')
	password = request.data.get('password')
	if not username or not password:
		return Response({'detail': 'username and password required'}, status=status.HTTP_400_BAD_REQUEST)
	if User.objects.filter(username=username).exists():
		return Response({'detail': 'username already exists'}, status=status.HTTP_400_BAD_REQUEST)
	user = User.objects.create_user(username=username, password=password)
	token, _ = Token.objects.get_or_create(user=user)
	return Response({'token': token.key, 'username': user.username}, status=status.HTTP_201_CREATED)
