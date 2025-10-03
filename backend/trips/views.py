from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Trip
from .serializers import TripSerializer


class TripViewSet(viewsets.ModelViewSet):
	queryset = Trip.objects.prefetch_related("activities").all()
	serializer_class = TripSerializer

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

	@action(detail=False, methods=['get'], url_path='share/(?P<share_token>[^/.]+)')
	def share(self, request, share_token=None):
		"""Bonus: Shareable link endpoint"""
		trip = get_object_or_404(Trip, share_token=share_token)
		serializer = self.get_serializer(trip)
		return Response(serializer.data)
